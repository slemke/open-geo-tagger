var express = require('express');
var router = express.Router();

// list routers
// example: router.use('/search', require('./search'));

router.use('/user', require('./user/user.js'));
router.use('/categories', require('./categories/categories.js'));
router.use('/objects', require('./objects/objects.js'));
router.use('/theme', require('./theme/theme.js'));
router.use('/votes', require('./votes/votes.js'));
router.use('/ranking', require('./ranking/ranking.js'));

module.exports = router;
