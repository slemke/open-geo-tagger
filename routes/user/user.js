const express = require('express');
const app = express.Router();
const path = require('path');

var User = require('../../models/user.js')

app.get('/register/', function(req, res) {

  res.render('register')

});

// GET route after registering
app.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
            
          var sessionID = req.session.userId;
      res.render('profile', {
          sessionID : sessionID,
          user: user
      });
        }
      }
    });
});

// GET for logout logout
app.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

app.post('/register/', function (req, res, next) {
 
    

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordconfirm) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordconfirm: req.body.passwordconfirm,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/user/profile');
      }
    });

  } 
});

app.post('/login/', function (req, res, next) {
 
    if (req.body.logusername && req.body.logpassword) {
    User.authenticate(req.body.logusername, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong username or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/user/profile');
      }
    });
  } 

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordconfirm) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordconfirm: req.body.passwordconfirm,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/user/profile');
      }
    });

  } 
});

module.exports = app;