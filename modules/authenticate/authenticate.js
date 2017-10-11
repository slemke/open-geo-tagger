const express = require('express');
const router = express.Router();
const model = require('../user/user.model.js');


router.post('/authenticate', function(request, response) {

    const username = request.body.username;
    const password = request.body.password;

    model.authenticate(username, password, function(err, result) {

        if(err)
            return response.status(err.status).json({success : false});

        if(result)
            return response.status(200).json({success : true});

        return response.status(200).json({success : false});

    });
});

module.exports = router;
