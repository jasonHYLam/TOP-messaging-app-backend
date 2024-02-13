const asyncHandler = require("express-async-handler");

const { body } = require('express-validator');
const he = require('he');

const User = require('../models/user');
const FriendToUser = require('../models/friendToUser')

// may need to change name
// intended to handle adding friends and seeing who is online

// I think this is just used to bring up a list of users that match the user username
exports.search_user = [
    body('searchQuery').trim().escape(),

    asyncHandler( async(req, res, next) => {

    // I'll probably have to modify this find such that it doesn't include password.
        const matchingUsers = await User.find({username: req.body.searchQuery}).exec();
        const matchingUsersIds = matchingUsers.map(user => {
            return user.id
        })
        console.log('checking matchingUser ids')
        console.log(matchingUsersIds)

        // const currentUser = await User.findById(req.user)
        const currentUser = await User.findById(req.user.id).populate('friends')

            // took me ages to figure this out :/
            // Object.equals() is used for Object equality.
            // Alternatively, compare the stringified Object ids.
        const friends = matchingUsers.filter(searchedUser => {
            return currentUser.friends.some((friend) => {
                return (searchedUser.equals(friend.friendUser))
            })
        })

        // it must be here
        const nonFriends = matchingUsers.filter(searchedUser => {
            if (!currentUser.friends.length) return true
            else {
                return currentUser.friends.every((friend) => {
                    return (!searchedUser.equals(friend.friendUser))
                })
            }
        })

        // console.log('checking friends')
        // console.log(friends)
        // console.log('checking non friends')
        // console.log(nonFriends)
        // console.log(' ')

        res.json({
            
            friends,
            nonFriends,
        })
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

    console.log('checking currentUser')
    console.log(currentUser)
    console.log('checking userToAdd')
    console.log(userToAdd)
    console.log(' ')

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
    // console.log('checking get_user_profile:')
    // console.log('checking:')
    // console.log('req user')
    // console.log(req.user)

    // console.log('checking get user profile is called')
    // console.log('checking req params')
    // console.log(req.params)
    
    const matchingUser = await User.findById(req.params.userid, 'username description profilePicURL').exec();

    // req.user causes postman to fail
    const isCurrentUserProfile = (req.user.id === req.params.userid);
    // console.log('checking isCurrentUserProfile')
    // console.log(isCurrentUserProfile)


    // console.log('matchingUser:')
    // console.log(matchingUser)
    res.json({matchingUser, isCurrentUserProfile})
    // res.json({matchingUser})
})

// Perhaps I can use this to see how many people are online. But I have no idea how to approach that.
// What determines whether someone is online. How can the backend know?
exports.count_online_number = asyncHandler( async(req, res, next) => {

})

exports.count_friends_number = asyncHandler( async(req, res, next) => {

})

// May need to make a get friends callback