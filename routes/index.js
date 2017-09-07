var express = require('express');
var app = express.Router();

// list routers
// example: router.use('/search', require('./search'));

app.use('/user', require('./user/user.js'));

module.exports = app;
