const express = require('express');
const router = express.Router();
const model = require('./theme.model.js')

router.get('/', function(request, response) {

    model.get({}, null, null, {_id: 1}, function(err, result) {
        response.json(docs);
    });
});


router.post('/', function (request, response, next) {

    const theme = {
        name: request.body.name
    };

    model.insert(theme, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

router.get('/:id', function(request, response) {

    const id = request.params.id;

    model.get({_id : mongo.ObjectID(id) }, function(err, result) {
        response.json(result);
    });
});


router.put('/:id', function(request, response) {

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