const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat");
const User = require("../models/user");
const UserInChat = require("../models/userInChat");

const ObjectId = require('mongoose').Types.ObjectId;

exports.createUserInChatFromReq = async(chat, userid) => {

  const matchingChat = await Chat.findById(chat).exec();
  const matchingUser = await User.findById(userid).exec();

  const newUserInChat = new UserInChat({
      chat: matchingChat,
      user: matchingUser,
  })
  await newUserInChat.save();
}

exports.checkUserIsPartOfChat = asyncHandler( async( req, res, next ) => {

  // check that user is part of chat
  const matchingUserInChat = await UserInChat.findOne({
    chat: req.params.chatid,
    user: req.user.id,
  })

  console.log('checking matchingUserInChat')
  console.log(matchingUserInChat)

  if(!matchingUserInChat) {
    console.log('seems to not exist, terrible earth')
    return res.status(400).end();
  } else {
    console.log('it exists, phew')
    next()
  }

})