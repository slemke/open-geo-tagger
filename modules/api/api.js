const express = require('express');
const router = express.Router();
const model = require('../objects/objects.model.js');

router.get('/', (request, response) => {

    // allows to filter data by id within a set range (default: 0-40)
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

    model.get({}, start, end, null, (err, result) => {

        if(err)
            return response.status(500).end();

        return response.json(result);
    });
});

module.exports = router;
