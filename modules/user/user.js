const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const path = require('path');

const User = require('./user.model.js')

router.get('/', function(request, response) {
    var db = request.app.locals.db;
    var collection = db.collection('user');

    collection.find({}).toArray(function(err, docs) {
        response.json(docs);
    });
});

router.put('/', function(request, response) {
    // create user

    var user = {
        email : request.body.email,
        password : request.body.password,
        username : request.body.username,
        points : 0
    };

    var db = request.app.locals.db;
    var collection = db.collection('user');

    collection.insertOne(user, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

router.get('/:id', function(request, response) {

    var id = request.params.id;

    var db = request.app.locals.db;
    var collection = db.collection('user');

    collection.find({_id : new mongo.ObjectID(id) }).toArray(function(err, result) {
        response.json(result);
    });
	// return user data
});

router.post('/:id', function(request, response) {
    // update user

    var id = request.params.id;
    var user = {};

    if(request.body.email !== undefined)
        user.email = request.body.email;

    if(request.body.password !== undefined)
        user.password = request.body.password;

    if(request.body.username !== undefined)
        user.username = request.body.username;

    if(request.body.points !== undefined)
        user.points = request.body.points;

    var db = request.app.locals.db;
    var collection = db.collection('user');

    collection.updateOne({_id : new mongo.ObjectID(id) }, { $set : user }, function(err, result) {
        if(!err)
            response.status(200);
        else
            response.status(500);

        response.end();
    });
});

router.get('/register/', function(request, response) {
    response.render('register')
});

// GET route after registering
router.get('/profile', function (request, response, next) {
    User.findById(request.session.userId)
    .exec(function (error, user) {

        if (error)
            return next(error);

        if (user === null) {

            var err = new Error('Not authorized! Go back!');
            err.status = 400;
            return next(err);

        } else {

            var sessionID = request.session.userId;
            response.render('profile', {
                sessionID : sessionID,
                user: user
            });
        }
    });
});

// GET for logout logout
router.get('/logout', function (request, response, next) {
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
            return response.redirect('/user/profile');
        });

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
                return response.redirect('/user/profile');
            }
        });
    }

    if(request.body.email &&
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
            return response.redirect('/user/profile');
        });
    }
});

module.exports = router;
