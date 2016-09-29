'use strict'


var express = require('express');
//var morgan = require('morgan')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var data = require('./db');

var config = require('./config.js');
var db = config.connectDB();



passport.use('login', new LocalStrategy(
    function(username, password, done) {
        data.users.findByUsername(username, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) { return done(null, false); }
            if (user.password !== password) {
                return done(null, false); }
            return done(null, user);
        });
    }
));

passport.use('signup', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
    var findOrCreateUser = function() {
        data.users.findByUsername(username, function(err, user) {
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, false);
            } else {
                var newUser;
                db.one('INSERT INTO users(first_name, last_name, username, password) VALUES($1, $2, $3, $4) returning *',
                [req.body.first_name, req.body.last_name, username, password])
                    .then(data => {
                        newUser = data;
                        return done(null, newUser);
                    })
                    .catch(error => res.send(error));
            }
      });
    };
    process.nextTick(findOrCreateUser);
  }
));



passport.serializeUser(function(user, done) {
    done(null, user.id);
});


passport.deserializeUser(function(id, done) {
    data.users.findById(id, function(err, user) {
        if (err) { return done(err); }
        done(null, user);
    });
});



var app = express();

//app.use('/', express.static(__dirname));
app.use('/login', express.static('build'));
app.use('/signup', express.static('build'));
app.use('/user', express.static('build'));
app.use('/*', express.static('build'));

//app.use(morgan('combined'));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());
var isLogin = require('connect-ensure-login');


app.get('/', isLogin.ensureLoggedIn('/login'),
    function(req, res) {
        res.redirect('/user');
});

app.get('/login', function(req, res) {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/signup', function(req, res) {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/user', isLogin.ensureLoggedIn('/login'),
    function(req, res){
        res.sendFile('index.html', { root: __dirname });
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
});

app.post('/login',
    function(req, res) {
        passport.authenticate('login', function(err, user, info) {
        if (err) { return res.send(err); }
        if (!user) { return res.send('Unauthorized'); }
        req.logIn(user, function(err) {
            if (err) { return res.send(err); }
            return res.send('Success');
        });
      })(req, res);
});

app.post('/signup',
    function(req, res) {
        passport.authenticate('signup', function(err, user, info) {
        if (err) { return res.send(err); }
        if (!user) { return res.send('Used'); }
        req.logIn(user, function(err) {
            if (err) { return res.send(err); }
            return res.send('Success');
        });
      })(req, res);
});

app.post('/add_event', isLogin.ensureLoggedIn('/login'), function(req, res) {
    db.one('INSERT INTO events(user_id, title, start_date, end_date, place, category, discription,'
            + ' is_repeat, repeat_rate, repeat_duration, repeat_end)'
            + ' VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning id',
            [req.user.id, req.body.title, req.body.start_date, req.body.end_date, req.body.place, req.body.category,
            req.body.discription, req.body.repeat, req.body.repeat_rate, req.body.repeat_duration, req.body.repeat_end])
        .then(data => res.send('Perfect'))
        .catch(error => {
            console.log(error);
            res.send(error)
        });
});

app.post('/edit_event', isLogin.ensureLoggedIn('/login'), function(req, res) {
    db.none('UPDATE events SET  title=$3, start_date = $4, end_date = $5, place = $6, category = $7, discription = $8,'
            + ' is_repeat = $9, repeat_rate = $10, repeat_duration = $11, repeat_end = $12'
            + ' WHERE id = $1 and user_id = $2', [req.body.id, req.user.id, req.body.title, req.body.start_date,
            req.body.end_date, req.body.place, req.body.category, req.body.discription, req.body.repeat,
            req.body.repeat_rate, req.body.repeat_duration, req.body.repeat_end])
        .then(function() {
            res.send('Perfect');
        })
        .catch(error => {
            console.log(error);
            res.send(error);
        });
});

app.post('/delete_event', isLogin.ensureLoggedIn('/login'), function(req, res) {
    db.none('DELETE FROM events WHERE id = $1', req.body.id)
    .then(function() {
        res.send('YES')
    })
    .catch(error => {
        console.log(error);
        res.send(error);
    });
});

app.post('/get_events', isLogin.ensureLoggedIn('/login'), function(req, res) {
    db.query('SELECT * FROM events WHERE user_id = $1 AND start_date BETWEEN $2 AND $3'
             + ' OR user_id = $1 AND start_date NOT BETWEEN $2 AND $3 AND end_date > $2 AND end_date <= $3'
             + ' OR user_id = $1 AND start_date < $2 AND end_date > $3'
             + ' OR user_id = $1 AND start_date < $3 AND repeat_end >= $2',
             [req.user.id, req.body.start, req.body.end])
    .then(date => res.send(date))
    .catch(error => {
        console.log(error);
        res.send(error);
    });
});

app.get('/*', function(req, res) {
    res.sendFile('error404.html', { root: __dirname + '/build/error' });
});


app.set('port', (process.env.PORT || 8080));
var server = app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
