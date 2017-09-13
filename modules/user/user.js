const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const path = require('path');

const User = require('./user.model.js')

router.get('/', function(request, response) {
    var db = request.app.locals.db;
    var collection = db.collection('users');

    collection.find({}).toArray(function(err, docs) {
        response.json(docs);
    });
});

router.get('/register/', function(request, response) {
    response.render('register')
});

// GET for logout logout
router.get('/logout', function (request, response, next) {
    
     var backURL=request.header('Referer') || '/';
    
    if (request.session) {

        // delete session object
        request.session.destroy(function (err) {
            if (err)
                return next(err);

            // redirect to base page
            return response.redirect('/');
        });
    }
});

//router.get('/:id', function(request, response) {
//
//    var id = request.params.id;
//
//    var db = request.app.locals.db;
//    var collection = db.collection('users');
//
//    collection.find({_id : mongo.ObjectID(id) }).toArray(function(err, result) {
//        response.json(result);
//    });
//	// return user data
//});

router.post('/search', function(request, response) {
    // update user

    var db = request.app.locals.db;
    var collection = db.collection('users');
                     
      if(request.body.username !== undefined) {
    
    collection.findOne({username : request.body.username}, function(err, result) {  
        
        if(result) {
            response.status(200);
          response.json(result);
         }
        else {
            response.status(404);
        }
        response.end();
    
    });
  
      }
    else if(request.body.email !== undefined) {
        
         collection.findOne({email : request.body.email}, function(err, result) {  
        
        if(result) {
            response.status(200);
          response.json(result);
         }
        else {
            response.status(404);
        }
        response.end();
    
    });
        
    }
    else {
        response.status(500);
    }
});

router.put('/', function(request, response) {
    // update

    var user = {
        email : request.body.email,
        password : request.body.password,
        passwordconfirm : request.body.passwordconfirm,
        username : request.body.username,
        points : 0
    };

    var db = request.app.locals.db;
    var collection = db.collection('users');

    collection.insertOne(user, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});



router.post('/register/', function (request, response, next) {

    if (request.body.email &&
        request.body.username &&
        request.body.password &&
        request.body.passwordconfirm) {

        var userData = {
            email: request.body.email,
            username: request.body.username,
            password: request.body.password,
            passwordconfirm: request.body.passwordconfirm
        };

        User.create(userData, function (error, user) {
            if (error)
                return next(error);


            request.session.userId = user._id;
            
            return response.redirect('/add');
        });

    }
    else {
        response.status(500);
        response.end();
    }
});

router.post('/login/', function (request, response, next) {

    if (request.body.logusername && request.body.logpassword) {
        User.authenticate(request.body.logusername, request.body.logpassword, function (error, user) {

            if (error || !user) {
                var err = new Error('Wrong username or password.');
                err.status = 401;
                return next(err);
            } else {
                request.session.userId = user._id;
                return response.redirect('/add');
            }
        });
    }
});

module.exports = router;
