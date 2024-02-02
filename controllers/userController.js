const asyncHandler = require("express-async-handler");

const { body } = require('express-validator');
const he = require('he');

const User = require('../models/user');
const FriendToUser = require('../models/friendToUser')

// may need to change name
// intended to handle adding friends and seeing who is online

// I think this is just used to bring up a list of users that match the user username
exports.search_user = [
    body('username').trim().escape(),

    // may need to unescape it?
    asyncHandler( async(req, res, next) => {
        // console.log('req body')
        // console.log(req.body)

    // I'll probably have to modify this find such that it doesn't include password.
        const matchingUsers = await User.find({username: req.body.username}).exec();

        // const currentUser = await User.findById(req.user)
        const currentUser = await User.findById(req.user.id).populate('friends')
        console.log('checking currentUserFriends')
        // console.log(currentUser)
        console.log(currentUser.friends)

        console.log('checking out friendToUser documents')
        const allFriendToUsers = await FriendToUser.find().exec();
        console.log(allFriendToUsers)
        

        // const friends = matchingUsers.map(user => {
        //     if (currentUserFriends)
        //     return currentUserFriends.map(friend => {
        //         if (user.id === friend.id) return user
        //     })
        // })

        // const nonFriends = matchingUsers.map(user => {
        //     return currentUserFriends.map(friend => {
        //         if (user.id !== friend.id) return user
        //     })
        // })

        // console.log('checking friends')
        // console.log(friends)
        // console.log('checking non friends')
        // console.log(nonFriends)

        res.json({matchingUsers})
    })
    
]

// Post to add them
exports.add_user = asyncHandler( async(req, res, next) => {
    // How does adding a user work...
    // Get the current logged in user somehow
    // Get the user to add via their id and params. Add to their friendlist.
    // I think I have access to req.user...

    console.log('i hope this works first time')

    // console.log('checking req user')
    // console.log(req.user)
    // console.log('checking reqparams')
    // console.log(req.params)
    const currentUser = await User.findById(req.user.id)
    const userToAdd = await User.findById(req.params.userid)

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
    res.json({genericMessage: "it's... "});

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

// May need to make a get friends callback