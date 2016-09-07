var config = require('../config.js');
var db = config.connectDB();

exports.findById = function(id, cb) {
    process.nextTick(function() {
        var user;
        db.query('SELECT * FROM users WHERE id = $1', id)
        .then(data => {
            user = data[0];
            if (user !== undefined) {
                cb(null, user);
            } else {
                cb(new Error('User ' + id + ' does not exist'));
            }
        });
    });
}

exports.findByUsername = function(username, cb) {
    process.nextTick(function() {
        var user;
        db.query('SELECT * FROM users WHERE username = $1', username)
        .then(data => {
            user = data[0];
            if (user !== undefined) {
                return cb(null, user);
            };
            return cb(null, null);
        });
    });
}
