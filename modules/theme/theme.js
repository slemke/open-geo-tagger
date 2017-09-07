const express = require('express');
const router = express.Router();
const mongo = require('mongodb');

router.get('/', function(request, response) {
    var db = request.app.locals.db;
    var collection = db.collection('theme');

    collection.find({}).toArray(function(err, docs) {
        response.json(docs);
    });
});

router.put('/', function(request, response) {

    var name = request.body.name;
    var db = request.app.locals.db;
    var collection = db.collection('theme');

    collection.insertOne({ name: name }, function(err, result) {
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
    var collection = db.collection('theme');

    collection.find({_id : new mongo.ObjectID(id) }).toArray(function(err, result) {
        response.json(result);
    });
});

router.post('/:id', function(request, response) {

    var id = request.params.id;
    var name = request.body.name;

    var db = request.app.locals.db;
    var collection = db.collection('theme');

    collection.updateOne({_id : new mongo.ObjectID(id) }, { $set : { name: name} }, function(err, result) {
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
    var collection = db.collection('theme');

    collection.deleteOne({_id : new mongo.ObjectID(id) }, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

module.exports = router;
