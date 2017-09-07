const express = require('express');
const router = express.Router();
const mongo = require('mongodb');

router.get('/', function(request, response) {
    var db = request.app.locals.db;
    var collection = db.collection('user');

    collection.find({}).toArray(function(err, docs) {
        response.json(docs);
    });
});

router.put('/', function(request, response) {
    // create user

    var user = {
        email : request.body.email,
        password : request.body.password,
        username : request.body.username,
        points : 0
    };

    var db = request.app.locals.db;
    var collection = db.collection('user');

    collection.insertOne(user, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

router.get('/:id', function(request, response) {

    var id = request.params.id;

    var db = request.app.locals.db;
    var collection = db.collection('user');

    collection.find({_id : new mongo.ObjectID(id) }).toArray(function(err, result) {
        response.json(result);
    });
	// return user data
});

router.post('/:id', function(request, response) {
    // update user

    var id = request.params.id;
    var user = {};

    if(request.body.email !== undefined)
        user.email = request.body.email;

    if(request.body.password !== undefined)
        user.password = request.body.password;

    if(request.body.username !== undefined)
        user.username = request.body.username;

    if(request.body.points !== undefined)
        user.points = request.body.points;

    var db = request.app.locals.db;
    var collection = db.collection('user');

    collection.updateOne({_id : new mongo.ObjectID(id) }, { $set : user }, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

module.exports = router;
