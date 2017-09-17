const express = require('express');
const router = express.Router();
const model = require('../user/user.model.js')
const auth = require('http-auth');
const basic = require('../../auth.js');

router.get('/', auth.connect(basic), function(request, response) {

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
