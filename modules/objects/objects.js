const express = require('express');
const router = express.Router();
const mongo = require('mongodb');


router.get('/', function(request, response) {
    var db = request.app.locals.db;
    var collection = db.collection('objects');

    collection.find({}).toArray(function(err, docs) {
        response.json(docs);
    });
});

router.put('/:id', function(request, response) {

    var object = {
        location: request.body.location,
        created: request.body.created,
        updated: request.body.updated,
        category: request.body.category,
        description: request.body.description,
        userID : request.body.userID,
        votes : 0,
        themeID : request.body.themeID
    };


    var db = request.app.locals.db;
    var collection = db.collection('objects');

    collection.insertOne(object, function(err, result) {
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
    var collection = db.collection('objects');

    collection.find({_id : new mongo.ObjectID(id) }).toArray(function(err, result) {
        response.json(result);
    });
});

router.post('/', function(request, response) {

    var id = request.params.id;

    var object = {};

    if(request.body.location !== undefined)
        object.location = request.body.location;

    if(request.body.created !== undefined)
        object.created = request.body.created;

    if(request.body.updated !== undefined)
        object.updated = request.body.updated;

    if(request.body.category !== undefined)
        object.category = request.body.category;

    if(request.body.description !== undefined)
        object.description = request.body.description;

    if(request.body.userID !== undefined)
        object.userID = request.body.userID;

    if(request.body.themeID !== undefined)
        object.themeID = request.body.themeID;

    var db = request.app.locals.db;
    var collection = db.collection('objects');

    collection.updateOne({_id : new mongo.ObjectID() }, { $set : object }, function(err, result) {
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
    var collection = db.collection('objects');

    collection.deleteOne({_id : new mongo.ObjectID(id) }, function(err, result) {

        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});




module.exports = router;
