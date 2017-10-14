var config = require('./config.js');
var db = config.connectDB();

module.exports = {

    findById: function(id, cb) {
        process.nextTick(function() {
            var user;

            db.query('SELECT * \
                        FROM users WHERE id = $1',
                    id)
            .then(data => {
                user = data[0];

                if (user !== undefined) {
                    cb(null, user);
                } else {
                    cb(new Error('User ' + id + ' does not exist'));
                }
            });
        });
    },


    findByUsername: function(username, password, cb, done, req) {
        process.nextTick(function() {
            var user;

            db.query('SELECT * \
                        FROM users WHERE username = $1',
                    username)
            .then(data => {
                user = data[0];

                if (user !== undefined) {
                    return cb(null, user, password, done);
                };
                return cb(null, null, password, done, req);
            });
        });
    },


    verifyUser: function(err, user, password, done) {
        if (err) return done(err);
        if (!user) return done(null, false);
        if (user.password !== password) return done(null, false);

        return done(null, user);
    },


    createNewUser: function(err, user, password, done, req) {
        if (err) return done(err);
        if (user) return done(null, false);

        db.one('INSERT INTO users(first_name, last_name, username, password) \
                    VALUES($1, $2, $3, $4) returning *',
                [req.body.first_name, req.body.last_name, req.body.username, password])
            .then(data => done(null, data))
            .catch(error => done(error));
    },


    addEvent: function(req, res) {
        db.one('INSERT INTO events(user_id, title, start_date, end_date, place, category, description, \
                        is_repeat, repeat_rate, repeat_duration, repeat_end) \
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) \
                    returning id',
                [req.user.id, req.body.title, req.body.start_date, req.body.end_date, req.body.place,
                    req.body.category, req.body.description, req.body.repeat, req.body.repeat_rate,
                    req.body.repeat_duration, req.body.repeat_end])
            .then(data => res.send('Perfect'))
            .catch(error => res.send(error));
    },


    editEvent: function(req, res) {
        db.none('UPDATE events SET  title=$3, start_date = $4, end_date = $5, place = $6, category = $7, \
                    description = $8, is_repeat = $9, repeat_rate = $10, repeat_duration = $11, repeat_end = $12 \
                    WHERE id = $1 and user_id = $2',
                [req.body.id, req.user.id, req.body.title, req.body.start_date, req.body.end_date, req.body.place,
                    req.body.category, req.body.description, req.body.repeat, req.body.repeat_rate,
                    req.body.repeat_duration, req.body.repeat_end])
            .then(() => res.send('Perfect'))
            .catch(error => res.send(error));
    },


    deleteEvent: function(req, res) {
        db.none('DELETE FROM events \
                    WHERE id = $1', req.body.id)
        .then(() => res.send('YES'))
        .catch(error => res.send(error));
    },


    getEvents: function(req, res) {
        db.query('SELECT * FROM events \
                    WHERE user_id = $1 AND start_date BETWEEN $2 AND $3 \
                    OR user_id = $1 AND start_date NOT BETWEEN $2 AND $3 AND end_date > $2 AND end_date <= $3 \
                    OR user_id = $1 AND start_date < $2 AND end_date > $3 \
                    OR user_id = $1 AND start_date < $3 AND repeat_end >= $2',
                 [req.user.id, req.body.start, req.body.end])
        .then(date => res.send(date))
        .catch(error => res.send(error));
    }
}
