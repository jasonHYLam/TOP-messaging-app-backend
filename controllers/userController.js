const asyncHandler = require("express-async-handler");

const { body } = require('express-validator');
const he = require('he');

const User = require('../models/user');

// may need to change name
// intended to handle adding friends and seeing who is online

// I think this is just used to bring up a list of users that match the user username
exports.search_user = [
    body('user').trim().escape(),

    asyncHandler( async(req, res, next) => {
        const matchingUsers = await User.find({username: req.body.user}).exec();
        res.json({matchingUsers})
    })
    
]

// Post to add them
exports.add_user = []

// 
exports.get_user_profile = asyncHandler( async(req, res, next) => {
    

})

// Perhaps I can use this to see how many people are online. But I have no idea how to approach that.
// What determines whether someone is online. How can the backend know?
exports.count_online_number = asyncHandler( async(req, res, next) => {

})

exports.count_friends_number = asyncHandler( async(req, res, next) => {

})