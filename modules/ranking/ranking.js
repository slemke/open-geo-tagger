const express = require('express');
const router = express.Router();
const model = require('./user.model.js')

router.get('/', function(request, response) {

    model.get({}, null, null, { points: -1 }, function(err, result) {
        response.json(docs);
    });
});

module.exports = router;
