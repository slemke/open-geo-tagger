const express = require('express');
const router = express.Router();
const model = require('./user.model.js')

router.get('/', function(request, response) {

    model.get({}, null, null, { _id: 1}, function(err, result) {
        response.json(result);
    });
});

router.post('/', function (request, response, next) {

    var user = {
        email: request.body.email,
        username: request.body.username,
        password: request.body.password,
        passwordconfirm: request.body.passwordconfirm
    };

    model.insert(user, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();

    });
});

router.get('/:id', function(request, response) {

    let id = request.params.id;

    collection.find({_id : mongo.ObjectID(id) }).toArray(function(err, result) {
        response.json(result);
    });
});

router.put('/:id', function(request, response) {

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
