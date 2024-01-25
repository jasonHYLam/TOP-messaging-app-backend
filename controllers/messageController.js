const asyncHandler = require("express-async-handler");
const { body } = require('express-validator');
const he = require('he');

const Message = require('../models/message');
const User = require('../models/user');
const Chat = require('../models/chat');

exports.create_message = [
    // validate the text first
    body().trim().escape(),


    asyncHandler( async(req, res, next) => {

        const currentUser = await User.findById(req.user._id);
        const currentChat = await Chat.findById(req.params.chatid);

        const newMessage = new Message({
            text: req.body.text,
            author: currentUser,
            chat: currentChat,
            timeStamp: new Date(),

        })

        await newMessage.save() 
    })

]

exports.delete_message = asyncHandler( async(req, res, next) => {

    // delete based on id
    // Message.findByIdAndDelete()
})

exports.edit_message = asyncHandler( async(req, res, next) => {

    // edit based on id
    // Message.findByIdAndUpdate()
})

exports.reply_to_message = [
    // validate the text first
    // now what...
    // this is basically create message but with extra steps
    // do I need the ID of the message being replied to? possibly. 
    // maybe set a field to true
    // maybe set the message_to_reply field
]

exports.react_to_message = asyncHandler( async(req, res, next) => {
    // may need the ID of the message to react to.

    // how do i get the specific icon? perhaps with switch statement
    // req.reaction.ambivalent => ambivalent 
})

exports.attach_image = asyncHandler( async(req, res, next) => {
    // just how the heck does this work
    // do i need multer and cloudinary
})