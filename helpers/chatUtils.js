const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat");
const User = require("../models/user");
const UserInChat = require("../models/userInChat");

exports.createUserInChatFromReq = async (chat, userid) => {
  const matchingChat = await Chat.findById(chat).exec();
  const matchingUser = await User.findById(userid).exec();

  const newUserInChat = new UserInChat({
    chat: matchingChat,
    user: matchingUser,
  });
  await newUserInChat.save();
};

exports.checkUserIsPartOfChat = asyncHandler(async (req, res, next) => {
  const matchingUserInChat = await UserInChat.findOne({
    chat: req.params.chatid,
    user: req.user.id,
  });

  if (!matchingUserInChat) {
    return res.status(400).end();
  } else {
    next();
  }
});
