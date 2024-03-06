const asyncHandler = require("express-async-handler");
const { body } = require('express-validator');
const he = require('he');
const { upload } = require('../cloudinaryConfig')

const Message = require('../models/message');
const User = require('../models/user');
const Chat = require('../models/chat');

exports.validate_text = (req, res, next) => {
  body('text').trim().escape();
  next();
}

exports.validate_fields = asyncHandler(async ( req, res, next ) => {
  console.log('checking req body and req file')
  console.log(req.body)
  console.log(req.file)
})

exports.create_message = 

    asyncHandler( async(req, res, next) => {

      console.log('checking req params')
      console.log(req.params)
        const currentUser = await User.findById(req.user._id);

        const currentChat = await Chat.findById(req.params.chatid);
        if (!currentChat) return res.status(400).end();

        let messageToReplyTo = null;
        if(req.params.messageid) {
          messageToReplyTo = await Message.findById(req.params.messageid)
        }
        // console.log('does this happen')

        const newMessage = new Message({
            text: he.decode(req.body.message),
            author: currentUser,
            chat: currentChat,
            timeStamp: new Date(),

            messageReplyingTo: messageToReplyTo,
            imageURL: null,
            // isDeleted: false,
            reactions: {},
        })
        // console.log('guessing this doesnt happen')
        // console.log('checking out newMessage')
        // console.log(newMessage)

        await newMessage.save() 
        // pretty sure this is fine

        // not sure if this is needed
        res.json({});
    })

exports.create_message_with_image = 

[

    upload.single('image'),

    body('message').trim().escape(),

    asyncHandler(async (req, res, next) => {

        if(!req.file) return res.status(400).end();

        const currentUser = await User.findById(req.user._id);
        const currentChat = await Chat.findById(req.params.chatid);

        const newMessage = new Message({
            text: he.decode(req.body.message),
            author: currentUser,
            chat: currentChat,
            timeStamp: new Date(),

            // messageReplyingTo: null,
            imageURL: req.file.path,
            // isDeleted: false,
            reactions: {},
        })

        await newMessage.save();

        res.json({});
    })
    
]

exports.delete_message = asyncHandler( async(req, res, next) => {

    // delete based on id
})

exports.edit_message = asyncHandler( async(req, res, next) => {
  // edit based on id based on req.param

  const currentChat = await Chat.findById(req.params.chatid)
  const messageToEdit = await Message.findById(req.params.messageid)

  console.log(messageToEdit)

  if (!messageToEdit || !currentChat ) return res.status(400).send();

  messageToEdit.text = he.decode(req.body.text)
  await messageToEdit.save();

  res.json({});
})


exports.reply_to_message = 
// [
    // validate the text first
    // body('text').trim().escape(),
    // now what...
    // this is basically create message but with extra steps
    // do I need the ID of the message being replied to? possibly. 
    // maybe set a field to true
    // maybe set the message_to_reply field
    asyncHandler( async(req, res, next) => {

        const currentUser = await User.findById(req.user._id);
        const currentChat = await Chat.findById(req.params.chatid);
        const messageReplyingTo = await Message.findById(req.body.messageToReply._id);

        const newMessage = new Message({
            text: req.body.text,
            author: currentUser,
            chat: currentChat,
            timeStamp: new Date(),

            messageReplyingTo: messageReplyingTo,
            // imageURL: null,
            // isDeleted: false,
            reactions: {},
        })

        await newMessage.save() 

        // might need to call next() or res.json()
    })
// ]

exports.react_to_message = asyncHandler( async(req, res, next) => {
    // may need the ID of the message to react to.

    // how do i get the specific icon? perhaps with switch statement
    // req.reaction.ambivalent => ambivalent 
})

exports.attach_image = asyncHandler( async(req, res, next) => {
    // just how the heck does this work
    // do i need multer and cloudinary
    upload.single('image');
    next();
})