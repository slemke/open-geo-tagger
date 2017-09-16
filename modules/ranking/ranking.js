const express = require('express');
const router = express.Router();
const model = require('../user/user.model.js')

router.get('/', function(request, response) {

    model.get({}, null, null, { points: -1 }, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        if(!result)
            response.status(404).end();
        else
            response.json(result);
    });
});

module.exports = router;
