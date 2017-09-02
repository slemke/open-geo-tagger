var express = require('express');
var router = express.Router();

// list routers
// example: router.use('/search', require('./search'));

router.use('/user', require('./user/user.js'));

module.exports = router;
