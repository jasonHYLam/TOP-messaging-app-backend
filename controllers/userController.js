const { ObjectId } = require('mongoose').Types;

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

    const currentUser = await User.findById(req.user.id)
    const userToAdd = await User.findById(req.params.userid)

    const currentUserWithFriends = await User
    .findById(req.user.id)
    .populate({path: 'friends'})
    .exec();

    function checkUserIsAlreadyAdded(friendsList, userId) {
        return friendsList.some(friendToUser => friendToUser.friendUser.toString() === userId)
    }

    if (checkUserIsAlreadyAdded(currentUserWithFriends.friends, req.params.userid)) {
        return res.status(400).end();
    }
    else if (req.user.id === req.params.userid) {
        return res.status(400).end();
    }
    else {

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
        }
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
    
    const matchingUser = await User
    .findById(req.params.userid, 'username description profilePicURL ')
    .exec();

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

exports.get_friends_list = asyncHandler( async( req, res, next ) => {
    const currentUserWithFriends = await User
    .findById(req.user.id)
    .populate({
        path: 'friends',
        populate: {
            path: 'friendUser',
            select: 'username profilePicURL'
        }
    }).exec()

    const friends = currentUserWithFriends.friends
    .map(friendToUser => friendToUser.friendUser)
    // console.log('checking')
    // console.log(friends)

    res.json({friends})

})

exports.remove_friend = asyncHandler( async( req, res, next ) => {

    if (req.params.userid === req.user.id) return res.status(400).end()

    function checkIfUserIsNotInFriendsList(friendsList, userId) {
        console.log(
            friendsList.map(friendToUser => friendToUser.friendUser.toString() === userId)
        )
    }


    const currentUserWithFriends = await User.findById(req.user.id).populate('friends').exec();
    console.log('checking currentUserWithFriends')
    console.log(currentUserWithFriends)

    checkIfUserIsNotInFriendsList(currentUserWithFriends.friends, req.params.userid)


    await Promise.all([
        FriendToUser.deleteOne({
            user: req.user.id,
            friendUser: req.params.userid
        }),

        FriendToUser.deleteOne({
            user: req.params.userid,
            friendUser: req.user.id,
        }),
    ])

    res.json({})
})
