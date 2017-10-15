const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db/db-requests.js');


passport.use('login', new LocalStrategy(((username, password, done) => {
  db.findByUsername(username, password, db.verifyUser, done);
})));

passport.use('signup', new LocalStrategy(
  {
    passReqToCallback: true,
  },
  ((req, username, password, done) => {
    const findOrCreateUser = () => {
      db.findByUsername(username, password, db.createNewUser, done, req);
    };
    process.nextTick(findOrCreateUser);
  })
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.findById(id, (err, user) => {
    if (err) { return done(err); }
    done(null, user);
  });
});


const app = express();

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

const isLogin = require('connect-ensure-login');


app.get(
  '/', isLogin.ensureLoggedIn('/login/'),
  (req, res) => {
    res.redirect('/user/');
  }
);

app.get('/login/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

app.get('/signup/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

app.get(
  '/user/', isLogin.ensureLoggedIn('/login/'),
  (req, res) => {
    res.sendFile('index.html', { root: __dirname });
  }
);

app.get('/logout/', (req, res) => {
  req.logout();
  res.redirect('/login/');
});

app.get('/images/preview.png', (req, res) => {
  res.sendFile('preview.png', { root: `${__dirname}/build/images` });
});

app.post('/login', (req, res) => {
  passport.authenticate('login', (err, user) => {
    if (err) return res.send(err);
    if (!user) return res.send('Unauthorized');

    req.logIn(user, (error) => {
      if (error) return res.send(error);

      return res.send('Success');
    });
  })(req, res);
});

app.post('/signup', (req, res) => {
  passport.authenticate('signup', (err, user) => {
    if (err) return res.send(err);
    if (!user) return res.send('Used');

    req.logIn(user, (error) => {
      if (error) return res.send(error);

      return res.send('Success');
    });
  })(req, res);
});

app.post('/add_event', isLogin.ensureLoggedIn('/login'), db.addEvent);

app.post('/edit_event', isLogin.ensureLoggedIn('/login'), db.editEvent);

app.post('/delete_event', isLogin.ensureLoggedIn('/login'), db.deleteEvent);

app.post('/get_events', isLogin.ensureLoggedIn('/login'), db.getEvents);

app.get('/*', (req, res) => {
  res.sendFile('error404.html', { root: `${__dirname}/build/error` });
});


app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), () => {
  console.log(`Server started: http://localhost:${app.get('port')}/`);
});
