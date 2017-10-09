const express = require('express');
const router = express.Router();
const model = require('./quests.model.js');

// provides overall quest data

router.get('/quests', function(request, response) {

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

    // return quests unfiltered and sorted by id
    model.get({}, start, end, { _id: 1 }, function(err, result) {
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

router.get('/quests/:id', function(request, response) {
    const id = request.params.id;

    // return single quest data
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


router.post('/quests/progress/', function(request, response) {
    // update user progress on quest

    const userID = request.body.userID;
    const questID = request.body.questID;

    // update quest progress on userID
    model.update(id, quest, function(err, result) {
        // TODO return progress as response

        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});
