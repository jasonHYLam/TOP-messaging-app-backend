const passport = require('passport');
const bcrypt = require('bcryptjs');

const asyncHandler = require("express-async-handler");
const { body } = require('express-validator');
const he = require('he');

const User = require('../models/user');

// LoginController?

// validate by trimming and escaping
exports.signup = [

    // username, password
    body('username').trim().escape(),
    body('password').trim().escape(),

    asyncHandler(async(req, res, next) => {
        // need bcryptjs
        const escapedUsername = he.decode(req.body.username);
        const escapedPassword = he.decode(req.body.password);
        
        const hashedPass = await bcrypt.hash(escapedPassword, 10)
        const newUser = new User({
            username: escapedUsername,
            password: hashedPass
        })
        await newUser.save();
        // in the login test, may need to account for bcrypt
        // next()
        res.json({newUser});
    })
]

exports.login = 

[
    body('username').trim().escape(),
    body('password').trim().escape(),

    // AsyncHandler not needed when using passport.authenticate. If login fails, then 401 is sent to client.
    passport.authenticate('local'),

    // IMPORTANT! passport.authenticate does not send a response to end the request-response cycle. The following middleware in the stack must thus send a response.
    asyncHandler(async(req, res, next) => {
        res.send();
    })
]

exports.logout = asyncHandler(async(req, res, next) => {
  console.log('check that logout is called')
    // do something with PassportJS and sessions.
    // I hope this works. Calling passport.authenticate apparently creates req.logout
    req.logout(function(err) {
      if (err) return next(err)
      res.end()
    });

})


