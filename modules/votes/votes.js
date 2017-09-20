const express = require('express');
const router = express.Router();
const model = require('./votes.model.js');
const auth = require('http-auth');
const basic = require('../../auth.js');
const userModel = require('../user/user.model.js');
const as = require('async');

router.get('/', auth.connect(basic), function(request, response) {

    const userID = request.query.userID;
    const objectID = request.query.objectID;
    let start = request.query.start;
    let end = request.query.end;

    let filter = {};

    if(userID != undefined && userID != '')
        filter["userID"] = userID;

    if(objectID != undefined && objectID != '')
        filter["objectID"] = objectID;

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

    model.get(filter, start, end, {_id: 1}, function(err, result) {
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

router.post('/', auth.connect(basic), function(request, response) {
    var vote = {
        vote : request.body.vote,
        objectID: request.body.objectID,
        userID : request.body.userID
    };

    as.waterfall([
        function(callback) {

            model.insert(vote, function(err, result) {
                if(err)
                    callback(err);
                else
                    callback(null, result);
            });

        }, function(vote, callback) {
            userModel.setPoints(vote.userID, 1, function(err, result) {
                if(err)
                    callback(err);
                else
                    callback(null, vote);
            });
        }
    ], function(err, result) {

        if(err)
            return response.status(500).end();

        response.status(201);

        response.json(result);
    });
});

router.get('/:id', auth.connect(basic), function(request, response) {

    var id = request.params.id;

    model.get({"_id" : id }, function(err, result) {
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

    var id = request.params.id;

    var vote = {};

    if(request.body.vote !== undefined)
        vote.vote = request.body.vote;

    if(request.body.userID !== undefined)
        vote.userID = request.body.userID;

    if(request.body.objectID !== undefined)
        vote.objectID = request.body.objectID;

    model.update(id, { $set : vote }, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

router.delete('/:id', auth.connect(basic), function(request, response) {

    var id = request.params.id;

    model.delete(id, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

module.exports = router;
