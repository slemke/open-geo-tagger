const express = require('express');
const router = express.Router();
const model = require('./user.model.js');
const auth = require('http-auth');
const basic = require('../../auth.js');

router.get('/', auth.connect(basic), function(request, response) {

    model.get({}, null, null, { _id: 1}, function(err, result) {
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

router.post('/', auth.connect(basic), function (request, response, next) {

    var user = {
        email: request.body.email,
        username: request.body.username,
        password: request.body.password,
        passwordconfirm: request.body.passwordconfirm
    };

    model.insert(user, function(err, result) {
        if(!err)
            response.status(201);
        else
            response.status(500);

        response.end();

    });
});

router.get('/:id', auth.connect(basic), function(request, response) {

    let id = request.params.id;

    collection.find({_id : mongo.ObjectID(id) }).toArray(function(err, result) {
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

router.put('/:id', auth.connect(basic), function(request, response) {

    var user = {
        email : request.body.email,
        password : request.body.password,
        passwordconfirm : request.body.passwordconfirm,
        username : request.body.username,
        points : 0
    };

    model.insert(user, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

module.exports = router;
