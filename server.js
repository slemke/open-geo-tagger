const express = require('express')
const https = require('https');
const app = express()
const fs = require('fs')
const port = 3000

app.use('/static', express.static(__dirname + '/assets'));
app.use(require('./modules'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/add', function (req, res) {
    res.sendFile(__dirname + '/views/add.html');
});

app.get('/rounds', function (req, res) {
    res.sendFile(__dirname + '/views/rounds.html');
});

var privateKey = fs.readFileSync( 'key.pem' );
var certificate = fs.readFileSync( 'cert.pem' );

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(port);
