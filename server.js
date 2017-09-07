const express = require('express')
const https = require('https');
const app = express()
const fs = require('fs')
const port = 3000
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.connect('mongodb://localhost/opendata',{ useMongoClient: true });
var db = mongoose.connection;

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

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs')


app.use(require('./routes'));

app.use('/static', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    
    var sessionID = req.session.userId;
      res.render('index', {
          sessionID : sessionID
      });
});

app.get('/add', function (req, res) {
   var sessionID = req.session.userId;
      res.render('add', {
          sessionID : sessionID
      });
});

app.get('/rounds', function (req, res) {
   var sessionID = req.session.userId;
      res.render('rounds', {
          sessionID : sessionID
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


var privateKey = fs.readFileSync( 'key.pem' );
var certificate = fs.readFileSync( 'cert.pem' );

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(port);
