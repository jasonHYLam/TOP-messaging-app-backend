const asyncHandler = require("express-async-handler");
const { body } = require('express-validator');
const he = require('he');

const User = require('../models/user');


// validate by trimming and escaping
exports.signup = [

    // username, password
    // body().trim().escape(),
    // body().trim().escape(),
    asyncHandler(async(req, res, next) => {

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

    asyncHandler(async(req, res, next) => {
        // hm need to do something with session I think.

    })

]
