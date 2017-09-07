const express = require('express')
const app = express()
const config = require('./config.js');
const mongo = require('mongodb').MongoClient;
const bodyParser = require('body-parser');


// setup statics and modules
app.use(bodyParser.json());

app.use('/static', express.static(__dirname + '/assets'));

app.use(require('./modules'));

// set base file for frontend output
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

// connect to mongo db
mongo.connect(config.mongodb, function(err, db) {
    if(err) throw err;

    // store mongo db object globally
    app.locals.db = db;

    app.listen(config.port, () => {
        console.log(`Example app listening on port ${config.port}!`)
    });
});
