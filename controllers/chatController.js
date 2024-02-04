const asyncHandler = require("express-async-handler");
const { body } = require('express-validator');
const he = require('he');

const Chat = require('../models/chat');
const User = require('../models/user');
const UserInChat = require('../models/userInChat');

async function createUserInChatFromReqAndSave(newChat, user) {
    const matchingUser = User.findById(user._id);
    const newUserInChat = new UserInChat({
        chat: newChat,
        user: matchingUser,
    })

    // The hope is that newUserInChat can be used to obtain the Users from Chat.find().populate()
    await newUserInChat.save();
}

exports.create_new_chat = [
    
    body('chatName').trim().escape(),
    
    asyncHandler( async(req, res, next) => {
        console.log('checking req body')
        console.log(req.body)

        // this requires an array of user ids to make a chat with.
        // These may come from req.body maybe?
        // I think I need to create the userInChat models and attach User And Chat to them...
        const newChat = new Chat({})
        await newChat.save()

        // // maybe something like:
        async function createUserInChatFromReq(chat, user) {

        }
        // req.body.users.map(async user => createUserInChatFromReqAndSave(newChat, user));

        // // Might need to call next, or perhaps redirect using sent new Chat id.

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

exports.get_all_chats = asyncHandler( async( req, res, next ) => {

    console.log('checking if req.user exists');
    console.log(req.user);
    // sort these by lastUpdated field.
    // Do I need to populate here... maybe? 
    // Maybe the names of the users
    // And the latest comment.
    // Not sure if this is the right syntax 
    const allChats = await Chat.find({}).populate('userInChat').populate('user')

    res.json({user: req.user, allChats})
})

exports.get_chat_messages = asyncHandler( async(req, res, next) => {
    // finding all messages that are related to the chat.
    // Hopefully chatid is passed through req.params
    // req.params.chatid
    const chatMessages = Chat.findById(req.params.chatid).populate('chatMessages')
    const chatUsers = Chat.findById(req.params.chatid).populate('users')
    res.json({chatMessages, chatUsers})
})