const express = require('express');
const router = express.Router();
const model = require('./objects.model.js')

router.get('/', function(request, response) {
    model.get({}, null, null, { _id: 1 }, function(err, result) {
        response.json(result);
    });
});

router.post('/', function(request, response, next) {

    let categories;

    try {
        categories = JSON.parse(request.body.categories);
    } catch(err) {
        return response.status(500).end();
    }

    const object = {
        location: request.body.location,
        categories: categories,
        description: request.body.description,
        userID : request.body.userID,
        votes : 0,
        themeID : request.body.themeID
    };

    model.insert(object, function(err, result) {
        if(err)
            response.status(500);
        else
            response.status(200);

        response.end();

    });
});

router.get('/:id', function(request, response) {

    const id = request.params.id;

    model.get({_id: mongo.ObjectID(id)}, function(err, result) {
        response.json(result);
    })
});

router.put('/:id', function(request, response) {

    const id = request.params.id;

    let object = {};

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

    model.update({_id : new mongo.ObjectID() }, { $set : object }, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

router.delete('/:id', function(request, response) {

    const id = request.params.id;

    model.delete({_id : new mongo.ObjectID(id) }, function(err, result) {

        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

module.exports = router;
