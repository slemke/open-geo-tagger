const express = require('express');
const router = express.Router();
const mongo = require('mongodb');

const Theme = require('./theme.model.js')

router.get('/', function(request, response) {
    var db = request.app.locals.db;
    var collection = db.collection('themes');

    collection.find({}).toArray(function(err, docs) {
        response.json(docs);
    });
});

router.put('/', function(request, response) {

    var name = request.body.name;
    var db = request.app.locals.db;
    var collection = db.collection('themes');

    collection.updateOne({ name: name }, function(err, result) {
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
    var collection = db.collection('themes');

    collection.findOne({_id : mongo.ObjectID(id) },function(err, result) {
        response.json(result);
    });
});


router.post('/', function (request, response, next) {

    if (request.body.name) {

        var themeData = {
            name: request.body.name
        };

        Theme.create(themeData, function (error, user) {
            if (error)
                return next(error);

            response.status(200);
            response.end();

        });

    }
    else {
        response.status(500);
        response.end();
    }
});

router.post('/', function(request, response) {

    var name = request.body.name;

    var db = request.app.locals.db;

    var collection = db.collection('themes');

    collection.updateOne({_id : new mongo.ObjectID() }, { $set : { name: name} }, function(err, result) {
        if(!err) {
            response.status(200);
            response.json(result);
        }
        else {
            response.status(500);
        }
        response.end();
    });
});

router.delete('/:id', function(request, response) {

    var id = request.params.id;

    var db = request.app.locals.db;
    var collection = db.collection('themes');

    collection.deleteOne({_id : mongo.ObjectID(id) }, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

module.exports = router;
