'use strict'


var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./db/db-requests.js');


passport.use('login', new LocalStrategy(
    function(username, password, done) {
        db.findByUsername(username, password, db.verifyUser, done);
    }));

passport.use('signup', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        var findOrCreateUser = function() {
            db.findByUsername(username, password, db.createNewUser, done, req);
        };
        process.nextTick(findOrCreateUser);
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    db.findById(id, function(err, user) {
        if (err) { return done(err); }
        done(null, user);
    });
});


var app = express();

app.use('/login', express.static('build'));
app.use('/signup', express.static('build'));
app.use('/user', express.static('build'));
app.use('/*', express.static('build'));
app.use('/images/preview.png', express.static('build'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

var isLogin = require('connect-ensure-login');


app.get('/', isLogin.ensureLoggedIn('/login/'),
    function(req, res) {
        res.redirect('/user/');
});

app.get('/login/', function(req, res) {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/signup/', function(req, res) {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/user/', isLogin.ensureLoggedIn('/login/'),
    function(req, res){
        res.sendFile('index.html', { root: __dirname });
});

app.get('/logout/', function(req, res) {
    req.logout();
    res.redirect('/login/');
});

app.get('/images/preview.png', function(req, res) {
  res.sendFile('preview.png', { root: __dirname + '/build/images' });
});

app.post('/login', function(req, res) {
    passport.authenticate('login', function(err, user, info) {
        if (err) return res.send(err);
        if (!user) return res.send('Unauthorized');

        req.logIn(user, function(err) {
            if (err) return res.send(err);

            return res.send('Success');
        });
    })(req, res);
});

app.post('/signup', function(req, res) {
    passport.authenticate('signup', function(err, user, info) {
        if (err) return res.send(err);
        if (!user) return res.send('Used');

        req.logIn(user, function(err) {
            if (err) return res.send(err);

            return res.send('Success');
        });
    })(req, res);
});

app.post('/add_event', isLogin.ensureLoggedIn('/login'), db.addEvent);

app.post('/edit_event', isLogin.ensureLoggedIn('/login'), db.editEvent);

app.post('/delete_event', isLogin.ensureLoggedIn('/login'), db.deleteEvent);

app.post('/get_events', isLogin.ensureLoggedIn('/login'), db.getEvents);

app.get('/*', function(req, res) {
    res.sendFile('error404.html', { root: __dirname + '/build/error' });
});


app.set('port', (process.env.PORT || 8080));

var server = app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
