const express = require('express');
const router = express.Router();
const model = require('./objects.model.js')
const auth = require('http-auth');
const basic = require('../../auth.js');

router.get('/', auth.connect(basic), function(request, response) {
    model.get({}, null, null, { _id: 1 }, function(err, result) {
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

router.post('/', auth.connect(basic), function(request, response, next) {

    let categories;

    const object = {
        location: request.body.location,
        categories: request.body.categories,
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

        response.json(result);

    });
});

router.get('/:id', auth.connect(basic), function(request, response) {

    const id = request.params.id;

    model.get({ "_id": id }, null, null, null, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        if(!result)
            response.status(404).end();
        else
            response.json(result);
    })
});

router.put('/:id', auth.connect(basic), function(request, response) {

    const id = request.params.id;

    let object = {};

    if(request.body.location !== undefined)
        object.location = request.body.location;

    if(request.body.created !== undefined)
        object.created = request.body.created;

    if(request.body.updated !== undefined)
        object.updated = request.body.updated;

    if(request.body.categories !== undefined)
        object.category = request.body.categories;

    if(request.body.description !== undefined)
        object.description = request.body.description;

    if(request.body.userID !== undefined)
        object.userID = request.body.userID;

    if(request.body.themeID !== undefined)
        object.themeID = request.body.themeID;

    model.update(id, object, function(err, result) {

        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

router.delete('/:id', auth.connect(basic), function(request, response) {

    const id = request.params.id;

    model.delete(id, function(err, result) {

        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

module.exports = router;
