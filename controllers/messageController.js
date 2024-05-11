const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const he = require("he");
const { upload } = require("../cloudinaryConfig");

const Message = require("../models/message");
const User = require("../models/user");
const Chat = require("../models/chat");

async function updateChatLastUpdatedProperty(chat) {
  chat.lastUpdated = new Date();
  await chat.save();
}

exports.validate_text = (req, res, next) => {
  body("text").trim().escape();
  next();
};

exports.create_message = asyncHandler(async (req, res, next) => {
  const currentUser = await User.findById(req.user._id);

  const currentChat = await Chat.findById(req.params.chatid);
  if (!currentChat) return res.status(400).end();

  let messageToReplyTo = null;
  if (req.params.messageid) {
    // add check if Message exists. create variable for found message.
    // if it doesn't exist, then send 400 status
    messageToReplyTo = await Message.findById(req.params.messageid);
  }

  const newMessage = new Message({
    text: he.decode(req.body.message),
    author: currentUser,
    chat: currentChat,
    timeStamp: new Date(),

    messageReplyingTo: messageToReplyTo,
    imageURL: null,
    reactions: {},
  });

  await newMessage.save();

  await updateChatLastUpdatedProperty(currentChat);

  res.json({ newMessage });
});

exports.create_message_with_image = [
  upload.single("image"),
  body("message").trim().escape(),

  asyncHandler(async (req, res, next) => {
    if (!req.file) return res.status(400).end();

    const currentUser = await User.findById(req.user._id);
    const currentChat = await Chat.findById(req.params.chatid);

    let messageToReplyTo = null;
    if (req.params.messageid) {
      messageToReplyTo = await Message.findById(req.params.messageid);
    }
    if (!currentChat) return res.status(400).end();
    await updateChatLastUpdatedProperty(currentChat);

    const newMessage = new Message({
      text: he.decode(req.body.message),
      author: currentUser,
      chat: currentChat,
      timeStamp: new Date(),

      messageReplyingTo: messageToReplyTo,
      imageURL: req.file.path,
      reactions: {},
    });

    await newMessage.save();

    res.json({ newMessage });
  }),
];

exports.delete_message = asyncHandler(async (req, res, next) => {});

exports.edit_message = asyncHandler(async (req, res, next) => {
  const currentChat = await Chat.findById(req.params.chatid);
  const messageToEdit = await Message.findById(req.params.messageid);

  if (!messageToEdit || !currentChat) return res.status(400).send();

  messageToEdit.text = he.decode(req.body.text);
  await messageToEdit.save();

  res.json({});
});

exports.reply_to_message = asyncHandler(async (req, res, next) => {
  const currentUser = await User.findById(req.user._id);
  const currentChat = await Chat.findById(req.params.chatid);
  const messageReplyingTo = await Message.findById(req.body.messageToReply._id);

  const newMessage = new Message({
    text: req.body.text,
    author: currentUser,
    chat: currentChat,
    timeStamp: new Date(),
    messageReplyingTo: messageReplyingTo,
    reactions: {},
  });

  await newMessage.save();
  res.json({});
});
