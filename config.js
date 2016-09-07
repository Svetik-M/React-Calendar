'use strict'

var config = {
    connectDB: function() {
        var pgp = require("pg-promise")();
        var connection = {
            host: 'localhost',
            port: 5432,
            database: 'DB',
            user: 'postgres',
            password: '8235648'
        };
        return pgp(connection);
    }
};

module.exports = config;
