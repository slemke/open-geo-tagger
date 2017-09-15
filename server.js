const express = require('express')
const https = require('https');
const app = express()
const config = require('./config.js');
const bodyParser = require('body-parser');
const fs = require('fs')
const mongoose = require('mongoose');
const auth = require('http-auth');

let basic = auth.basic({
        realm: "Users",
    }, function(username, password, callback) {
        callback(true); // ask mongoose db
    }
);

//connect to MongoDB
mongoose.connect(config.mongodb, { useMongoClient: true } );
const db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// use basic auth
app.use(auth.connect(basic));

// use json bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// setup routing for assets
app.use('/static', express.static(__dirname + '/assets'));

// use modules
app.use(require('./modules'));

// set base file for frontend output
app.get('/', function (req, res) {

    var userID = req.session.userId;
      res.render('index', {
          userID : userID
      });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

// setup server
const privateKey = fs.readFileSync( 'key.pem' );
const certificate = fs.readFileSync( 'cert.pem' );

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(config.port);
