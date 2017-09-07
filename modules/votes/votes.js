const express = require('express');
const router = express.Router();
const mongo = require('mongodb');

router.get('/', function(request, response) {
    var db = request.app.locals.db;
    var collection = db.collection('votes');

    collection.find({}).toArray(function(err, docs) {
        response.json(docs);
    });
});

router.put('/', function(request, response) {

    var db = request.app.locals.db;
    var collection = db.collection('votes');

    var vote = {
        vote : request.body.vote,
        objectID: request.body.objectid,
        userID : request.body.userID
    };

    collection.insertOne(vote, function(err, result) {
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
    var collection = db.collection('votes');

    collection.find({_id : new mongo.ObjectID(id) }).toArray(function(err, result) {
        response.json(result);
    });
});

router.post('/:id', function(request, response) {

    var id = request.params.id;

    var vote = {};

    if(request.body.vote !== undefined)
        vote.vote = request.body.vote;

    if(request.body.userID !== undefined)
        vote.userID = request.body.userID;

    if(request.body.objectID !== undefined)
        vote.objectID = request.body.objectID;

    var db = request.app.locals.db;
    var collection = db.collection('votes');

    collection.updateOne({_id : new mongo.ObjectID(id) }, { $set : vote }, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

router.delete('/:id', function(request, response) {

    var id = request.params.id;

    var db = request.app.locals.db;
    var collection = db.collection('votes');

    collection.deleteOne({_id : new mongo.ObjectID(id) }, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

module.exports = router;
