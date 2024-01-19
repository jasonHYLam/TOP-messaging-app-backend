const asyncHandler = require("express-async-handler");
const { body } = require('express-validator');
const he = require('he');

const Message = require('../models/message');

exports.create_message = [
    // validate the text first
    // body().trim().escape(),

    asyncHandler( async(req, res, next) => {

        // create Message model
        // const newMessage = new Message({})

        // save
        // newMessage.save() 
        // I think that is the correct syntax?
        
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
})