const express = require('express');
const router = express.Router();
const mongo = require('mongodb');


const Object = require('./objects.model.js')

router.get('/', function(request, response) {
    var db = request.app.locals.db;
    var collection = db.collection('objects');

    collection.find({}).toArray(function(err, docs) {
        response.json(docs);
    });
});

router.post('/', function(request, response,next) {
   
    
     if (request.body.location && request.body.categories && request.body.description && request.body.userID && request.body.themeID) {

            var objectData = {
        location: request.body.location,
        categories: JSON.parse(request.body.categories),
        description: request.body.description,
        userID : request.body.userID,
        votes : 0,
        themeID : request.body.themeID
    };
         
             Object.create(objectData, function (error, object) {
            if (error)
                return next(error);
            
            response.status(200);
            response.json(object);
            
        });

    }
    else if (request.body.location && request.body.categories && request.body.userID && request.body.themeID) {
        
             var objectData = {
        location: request.body.location,
        categories: JSON.parse(request.body.categories),
        description: request.body.description,
        userID : request.body.userID,
        votes : 0,
        themeID : request.body.themeID
    };
        
            Object.create(objectData, function (error, object) {
            if (error)
                return next(error);
            
            response.status(200);
            response.json(object);
            
        });
        
        
    }
    else {
        response.status(500);
        response.end();
    }
    
});

router.get('/:id', function(request, response) {

    var id = request.params.id;
    
    Object.findById(id, function (err, object) {
            response.status(200);
           response.json(object);
            
    });
    
});

router.put('/:id', function(request, response) {

    var id = request.params.id;

    
    Object.findById(id, function (err, object) {
  if (err) return console.log(err);
  
    if(request.body.location !== undefined)
        object.location = request.body.location;

    if(request.body.categories !== undefined)
        object.categories = JSON.parse(request.body.categories);

    if(request.body.description !== undefined)
        object.description = request.body.description;

    if(request.body.userID !== undefined)
        object.userID = request.body.userID;

    if(request.body.themeID !== undefined)
        object.themeID = request.body.themeID;
        
       
        
  object.save(function (err, updatedObject) {
    if (!err) {
      response.status(200);
    response.json(updatedObject);
    }
      else {
           response.status(500);
         return console.error(err);
          response.end();
      }
  });
});

});

router.delete('/:id', function(request, response) {

    var id = request.params.id;

    var db = request.app.locals.db;
    var collection = db.collection('objects');

    collection.deleteOne({_id : new mongo.ObjectID(id) }, function(err, result) {

        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});




module.exports = router;
