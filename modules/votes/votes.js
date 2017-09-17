const express = require('express');
const router = express.Router();
const model = require('./votes.model.js')
const auth = require('http-auth');
const basic = require('../../auth.js');

router.get('/', auth.connect(basic), function(request, response) {
    model.find({}, null, null, {_id: 1}, function(err, result) {
        response.json(result);
    });
});

router.post('/', auth.connect(basic), function(request, response) {
    var vote = {
        vote : request.body.vote,
        objectID: request.body.objectid,
        userID : request.body.userID
    };

    model.insert(vote, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

router.get('/:id', auth.connect(basic), function(request, response) {

    var id = request.params.id;

    model.get({_id : new mongo.ObjectID(id) }, function(err, result) {
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

    model.update({_id : new mongo.ObjectID(id) }, { $set : vote }, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

router.delete('/:id', auth.connect(basic), function(request, response) {

    var id = request.params.id;

    model.delete({_id : new mongo.ObjectID(id) }, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

module.exports = router;
