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
        bcrypt.hash(escapedPassword, 10, async( err, hashedPass ) => {
            if (err) throw err;
            else {
                const newUser = new User({
                    username: escapedUsername,
                    password: hashedPass,
                })
                await newUser.save();
            }
        })

        
        // create a new User model 
        // const newUser = new User({})
        // perhaps set default values
        // save User model

    })
]

exports.login = [
    // body().trim().escape(),
    // body().trim().escape(),

    // if login credentials are not correct, send message. Check how to handle this correctly when using asyncHandler.
    passport.authenticate('local')


    // asyncHandler(async(req, res, next) => {
    //     // hm need to do something with session I think.
    //     // perhaps need to do something with PassportJS... my bottom lip trembled slightly as I thought about that.
    // })

]

exports.logout = asyncHandler(async(req, res, next) => {
    // do something with PassportJS and sessions.

})


