const express = require('express');
const router = express.Router();
const mongo = require('mongodb');

router.get('/', function(request, response) {
    var db = request.app.locals.db;
    var collection = db.collection('users');

    collection.find({}).sort({ points: -1 }).toArray(function(err, docs) {
        response.json(docs);
    });
});

module.exports = router;
