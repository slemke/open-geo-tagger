const express = require('express');
const router = express.Router();
const model = require('./user.model.js');
const auth = require('http-auth');
const basic = require('../../auth.js');
const questsSchema = require('../quests/quests.schema.js');
const mongoose = require('mongoose');
let questsModel = mongoose.model('Quests', questsSchema);

router.get('/', function(request, response) {

    const email = request.query.email;
    const username = request.query.username;

    let filter = {};

    if(email != undefined && email != '')
        filter["email"] = new RegExp(email);

    if(username != undefined && username != '')
        filter["username"] = new RegExp(username);

    let start = request.query.start;
    let end = request.query.end;

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

    model.get(filter, start, end, { _id: 1}, function(err, result) {
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

router.post('/', function (request, response, next) {

    const user = {
        email: request.body.email,
        username: request.body.username,
        password: request.body.password,
        passwordconfirm: request.body.passwordconfirm,
        points: 0
    };

    model.insert(user, function(err, result) {
        if(!err)
            response.status(201).end();
        else
            response.status(500).end();

        //return response.end();
    });
});

router.get('/:id', function(request, response) {

    const id = request.params.id;

    model.get({_id : id }, null, null, null, function(err, result) {

        if(!err)
            response.status(200);
        else
            response.status(500);

        if(!result)
            response.status(404).end();
        else
            return response.json(result);
    });
});

router.put('/:id', function(request, response) {

    const id = request.params.id;

    const user = {};

    if(request.body.email !== undefined)
        user.email = request.body.email;

    if(request.body.password !== undefined)
        user.password = request.body.password;

    if(request.body.passwordconfirm !== undefined)
        user.passwordconfirm = request.body.passwordconfirm;

    if(request.body.username !== undefined)
        user.username = request.body.username;

    if(request.body.tags !== undefined)
        user.tags = request.body.tags;

    model.update(id, user, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

// returns current quests for user
router.get('/user/:id/quests', function(request, response) {

    // user id
    const id = request.params.id;

    questsModel.today(id, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        if(!result)
            response.status(404).end();
        else
            return response.json(result);
    });
});

module.exports = router;
