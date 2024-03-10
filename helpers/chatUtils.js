const Chat = require("../models/chat");
const User = require("../models/user");
const UserInChat = require("../models/userInChat");

const ObjectId = require('mongoose').Types.ObjectId;

exports.createUserInChatFromReq = async(chat, userid) => {

  console.log('checking userid')
  console.log(userid)
  const matchingChat = await Chat.findById(chat).exec();
  const matchingUser = await User.findById(userid.toString()).exec();

  console.log('checking matchingUser')
  console.log(matchingUser)

  console.log('checking chat, does it work???')
  console.log(matchingChat)

  const newUserInChat = new UserInChat({
      chat: matchingChat,
      user: matchingUser,
  })
  await newUserInChat.save();
}