const express = require('express')
const https = require('https');
const app = express()
const config = require('./config.js');
const mongo = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const fs = require('fs')
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const User = require('./modules/user/user.model.js')

//connect to MongoDB
mongoose.connect(config.mongodb, { useMongoClient: true } );
const db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//use sessions for tracking logins
app.use(session({
    secret: 'opendata',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs')
app.use('/static', express.static(__dirname + '/assets'));
app.use(require('./modules'));

// set base file for frontend output
app.get('/', function (req, res) {

    var userID = req.session.userId;
      res.render('index', {
          userID : userID
      });
});

app.get('/add', function (req, res,next) {
  
User.findById(req.session.userId)
    .exec(function (error, user) {

        if (error)
            return next(error);

        if (user === null) {

            var err = new Error('Not authorized! Go back!');
            err.status = 400;
            return next(err);

        } else {

           res.render('add', {
          user : user
      });
        }
    });  
});

app.get('/rounds', function (req, res) {
   var userID = req.session.userId;
      res.render('rounds', {
          userID : userID
      });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

var privateKey = fs.readFileSync( 'key.pem' );
var certificate = fs.readFileSync( 'cert.pem' );

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

// connect to mongo db
mongo.connect(config.mongodb, function(err, db) {
    if(err) throw err;

    // store mongo db object globally
    app.locals.db = db;

    https.createServer({
        key: privateKey,
        cert: certificate
    }, app).listen(config.port);

});
