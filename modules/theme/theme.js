const express = require('express');
const router = express.Router();
const model = require('./theme.model.js');
const auth = require('http-auth');
const basic = require('../../auth.js');

router.get('/', auth.connect(basic), function(request, response) {

    const name = request.query.name;
    let start = request.query.start;
    let end = request.query.end;

    let filter = {};

    if(name != undefined && name != '')
        filter = { name:  new RegExp(name) };

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


router.post('/', auth.connect(basic), function (request, response, next) {

    const name = request.body.name;

    model.insert({ name : name }, function(err, result) {
        if(!err)
            response.status(201);
        else
            response.status(500);

        response.end();
    });
});

router.get('/:id', auth.connect(basic), function(request, response) {

    const id = request.params.id;

    model.get({ "_id" : id }, null, null, null, function(err, result) {
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

    const id = request.params.id;
    const name = request.body.name;

    model.update(id, { name: name }, function(err, result) {
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
