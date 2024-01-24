const asyncHandler = require("express-async-handler");

const Chat = require('../models/chat');
const User = require('../models/user');
const UserInChat = require('../models/userInChat');

exports.create_new_chat = asyncHandler( async(req, res, next) => {
    // this requires an array of user ids to make a chat with.
    // These may come from req.body maybe?
    // I think I need to create the userInChat models and attach User And Chat to them...
    const newChat = new Chat({})
    await newChat.save()

    // maybe something like:
    req.body.users.map(async userid => {
        const matchingUser = User.findById(userid);
        const newUserInChat = new UserInChat({
            chat: newChat,
            user: matchingUser,
        })

        // The hope is that newUserInChat can be used to obtain the Users from Chat.find().populate()
        await newUserInChat.save();

    })

})

exports.get_chats = asyncHandler()

exports.get_chat_messages = asyncHandler( async(req, res, next) => {
    // finding all messages that are related to the chat.
})