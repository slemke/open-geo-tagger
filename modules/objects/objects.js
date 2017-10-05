const express = require('express');
const router = express.Router();
const model = require('./objects.model.js');
const userModel = require('../user/user.model.js');
const auth = require('http-auth');
const basic = require('../../auth.js');
const as = require('async');

router.get('/', function(request, response) {

    const themeID = request.query.themeid;
    const category = request.query.category;
    let start = request.query.start;
    let end = request.query.end;

    let filter = {};

    if(themeID != undefined && themeID != '')
        filter["themeID"] = themeID ;


        if(category != undefined && category != '')
            filter["categories"] = {text: category};

    if(start != undefined && start != '')
        start = parseInt(start, 10);
    else
        start = 0;

    if(start < 0)
        start = 0;

    if(end != undefined && end != '')
        end = parseInt(end, 10);
    else
        end = 40;

    if(end > start) {
        let tmp = start;
        start = end;
        end = tmp;
    }

    model.get(filter, start, end, { _id: 1 }, function(err, result) {
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

router.post('/', model.upload(), function(request, response, next) {

    const object = {
        location: request.body.location,
        categories: request.body.categories,
        description: request.body.description,
        userID : request.body.userID,
        upvote : 0,
        downvote: 0,
        themeID : request.body.themeID
    };

    as.waterfall([
        function(callback) {
            model.insert(object, function(err, result) {
                if(err)
                    return callback(err);

                return callback(null, result);
            });
        }, function(object, callback) {

            userModel.setPoints(object.userID, 5, function(err, result) {
                if(err)
                    callback(err);
                else
                    callback(null, object);

            });
        }
    ], function(err, result) {

        // TODO if err, cleanup the mess

        result = JSON.stringify(result);

        if(err)
            return response.status(500).end();
        else
            return response.status(201).end(result);
    });
});

router.get('/:id', function(request, response) {

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

router.put('/:id', function(request, response) {

    const id = request.params.id;

    let object = {};

    if(request.body.location !== undefined)
        object.location = request.body.location;

    if(request.body.created !== undefined)
        object.created = request.body.created;

    if(request.body.updated !== undefined)
        object.updated = request.body.updated;

    if(request.body.categories !== undefined)
        object.categories = request.body.categories;

    if(request.body.description !== undefined)
        object.description = request.body.description;

    if(request.body.userID !== undefined)
        object.userID = request.body.userID;

    if(request.body.upvotes !== undefined)
        object.upvotes = request.body.upvotes;

    if(request.body.downvotes !== undefined)
        object.downvotes = request.body.downvotes;

    if(request.body.themeID !== undefined)
        object.themeID = request.body.themeID;

    model.update(id, object, function(err, result) {

        if(!err) {
            response.status(200);
            response.json(result);
          }
        else {
            response.status(500).end();
        }

    });
});

router.delete('/:id', function(request, response) {

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
