var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config.json');

var app = express();
app.use(function (req, res, next) {

            // Website you wish to allow to connect
     res.setHeader('Access-Control-Allow-Origin', '*');

     // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

     next();
});
/*
 * Get Configuration parameter, @TODO: localize as much as possible
 */
var mongoUrl = config.mongoConnection.URL;
var auth_key = config.authKey;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var mongoHandle = require('./routes/db_handler.js');
mongoHandle.mongoConnect(mongoUrl);

// TODO: Can define multiple routes here
var routes = require('./routes/main');
app.use('/', routes);

var server = app.listen(8082);
console.log("Route app listening at http://%s:%s", server.address().address, server.address().port);