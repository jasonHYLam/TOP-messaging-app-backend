const asyncHandler = require("express-async-handler");

const { body } = require('express-validator');
const he = require('he');

const User = require('../models/user');
const FriendToUser = require('../models/friendToUser')

// may need to change name
// intended to handle adding friends and seeing who is online

// I think this is just used to bring up a list of users that match the user username
exports.search_user = [
    body('user').trim().escape(),

    // may need to unescape it?
    asyncHandler( async(req, res, next) => {
    // I'll probably have to modify this find such that it doesn't include password.
        const matchingUsers = await User.find({username: req.body.user}).exec();
        res.json({matchingUsers})
    })
    
]

// Post to add them
exports.add_user = asyncHandler( async(req, res, next) => {
    // How does adding a user work...
    // Get the current logged in user somehow
    // Get the user to add via their id and params. Add to their friendlist.
    // I think I have access to req.user...

    const currentUser = await User.findById(req.user.id)
    const userToAdd = await User.findById(req.params.user.id)

    const friendAdding = new FriendToUser({
        user: currentUser,
        friendUser: userToAdd,
    })

    const friendToAdd = new FriendToUser({
        user: userToAdd,
        friendUser: currentUser,
    })

    await friendAdding.save();
    await friendToAdd.save();

    // To access friends, need to call populate on User.

})

// 
exports.get_user_profile = asyncHandler( async(req, res, next) => {
    // This makes use of params to get userid I believe.
    // I'll probably have to modify this find such that it doesn't include password.
    const matchingUser = await User.findById(req.params.userid).exec();
    res.json({matchingUser})
})

// Perhaps I can use this to see how many people are online. But I have no idea how to approach that.
// What determines whether someone is online. How can the backend know?
exports.count_online_number = asyncHandler( async(req, res, next) => {

})

exports.count_friends_number = asyncHandler( async(req, res, next) => {

})