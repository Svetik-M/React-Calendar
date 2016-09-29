'use strict'

var config = {
    connectDB: function() {
        var pgp = require("pg-promise")();
        var connection = {
            host: 'ec2-184-73-202-229.compute-1.amazonaws.com',
            port: 5432,
            database: 'd8uaa32fcj80a7',
            user: 'tprnprooysdlcg',
            password: 'pdTR6NAXEE36wuQ6ds3-xC_EZo'
        };
        return pgp(connection);
    }
};

module.exports = config;
