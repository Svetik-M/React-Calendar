'use strict'


var express = require('express');
var pgp = require('pg-promise')();
var bodyParser = require('body-parser');

var cn = {
    host: 'localhost',
    port: 5432,
    database: 'DB',
    user: 'postgres',
    password: '8235648'
};

var db = pgp(cn);

var app = express();

app.set('port', (process.env.PORT || 8080));

app.use('/', express.static(__dirname));
app.use(bodyParser.json());

// app.post('/event', function(req, res) {
//     res.send(req.body);
    // db.any("select * from $1~", ['users'])
    // .then(function (data) {
    //     res.send(data[0].login);
    //     //console.log("DATA:", data);
    // })
    // .catch(function (error) {
    //     res.send(error);
    //     console.log("ERROR:", error);
    // })
// })


var server = app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
