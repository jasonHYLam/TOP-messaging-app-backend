const Chat = require("../models/chat");
const User = require("../models/user");
const UserInChat = require("../models/userInChat");

exports.createUserInChatFromReq = async(chatid, userid) => {

  const chat = await Chat.findById(chatid).exec();
  const matchingUser = await User.findById(userid).exec();
  const newUserInChat = new UserInChat({
      chat: chat,
      user: matchingUser,
  })
  await newUserInChat.save();
}