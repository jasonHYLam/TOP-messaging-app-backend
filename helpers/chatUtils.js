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