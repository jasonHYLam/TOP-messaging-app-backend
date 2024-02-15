const asyncHandler = require("express-async-handler");
const { body } = require('express-validator');
const he = require('he');

const Chat = require('../models/chat');
const User = require('../models/user');
const UserInChat = require('../models/userInChat');

// This involves creating a chat document as well as userInChat documents for each user being added to the chat.
// This requires an array of friendRelation objects (objects that store the ObjectId of friends to add to a chat).
exports.create_new_chat = [
    
    body('chatName').trim().escape(),
    
    asyncHandler( async(req, res, next) => {

        // this requires an array of user ids to make a chat with.
        // I think I need to create the userInChat models and attach User And Chat to them...
        const newChat = new Chat({
            name: he.decode(req.body.chatName)
        })
        await newChat.save()

        const usersAddedToChat = req.body.usersAddedToChat;

        async function createUserInChatFromReq(newChat, friendRelation) {
            const matchingUser = await User.findById(friendRelation.friendUser.id)
            const newUserInChat = new UserInChat({
                chat: newChat,
                user: matchingUser,
            })

            await newUserInChat.save();
        }

        usersAddedToChat.map(async friendRelation => createUserInChatFromReq(newChat, friendRelation));

        res.json({});

    })
]

exports.show_friends_for_chat = asyncHandler( async( req, res, next ) => {

    const currentUser = await User
    .findById(req.user.id)
    .populate({
        path: 'friends',
        populate: {path: 'friendUser'}
    })
    const friends = currentUser.friends
    // console.log('checking friends')
    // console.log(friends)

    res.json({friends});

})

exports.add_user_to_chat = asyncHandler( async( req, res, next ) => {

})

exports.get_chats_for_user = asyncHandler( async( req, res, next ) => {

    console.log('checking if req.user exists');
    console.log(req.user);
    // sort these by lastUpdated field.
    // Do I need to populate here... maybe? 
    // Maybe the names of the users
    // And the latest comment.

    const allChats = await Chat.find({}).populate('userInChat').populate('user')

    // this needs to be updated
    // const allChats = await Chat.find({})

    // res.json({user: req.user, allChats})
    res.json({allChats})
})

exports.get_chat_messages = asyncHandler( async(req, res, next) => {
    // finding all messages that are related to the chat.
    // Hopefully chatid is passed through req.params
    // req.params.chatid
    // const chatUsers = Chat.findById(req.params.chatid).populate('users')
    // res.json({chatMessages, chatUsers})
    console.log('checking get_chat_messages:')
    // console.log('req params:')
    // console.log(req.params)
    const chat = await Chat
    .findById(req.params.chatid)
    .populate({
        path: 'chatMessages',
        populate: [
            {path: 'author',
            select: 'username profilePicURL'
        },
            {path: 'messageReplyingTo',
            populate: {
                path: 'author',
                select: 'username',
            },
        },
        ]
})
    .sort({'chatMessages': 1})
    // const chatMessages = chat.chatMessages
    // console.log('chatMessages:')
    // console.log(chatMessages)

    res.json({chat})
})