const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const he = require("he");

const Chat = require("../models/chat");
const User = require("../models/user");
const UserInChat = require("../models/userInChat");
const FriendToUser = require("../models/friendToUser");

const { createUserInChatFromReq } = require("../helpers/chatUtils");

// This involves creating a chat document as well as userInChat documents for each user being added to the chat.
// This requires an array of friendRelation objects (objects that store the ObjectId of friends to add to a chat).
exports.create_new_chat = [
  body("chatName").trim().escape(),

  asyncHandler(async (req, res, next) => {
    // From the frontend (and test), request sends an array variable called addToChatUserIds.
    // This is an array of userIds.
    // This will be used to find matching users and create corresponding userInChat models and attach User And Chat to them.

    if (!req.body.addToChatUserIds) {
      return res.status(404).end();
    } else if (req.body.addToChatUserIds.length === 0) {
      return res.status(404).end();
    } else {
      const chatName = req.body.chatName
        ? he.decode(req.body.chatName)
        : "New Chat";
      const newChat = new Chat({
        name: chatName,
        last_updated: new Date(),
      });

      await newChat.save();

      const addToChatUserIds = [...req.body.addToChatUserIds, req.user.id];

      addToChatUserIds.map(
        async (userid) => await createUserInChatFromReq(newChat, userid)
      );
      res.json({ chatid: newChat._id });
    }
  }),
];

exports.show_friends_for_initial_chat_creation = asyncHandler(
  async (req, res, next) => {
    const currentUser = await User.findById(req.user.id).populate({
      path: "friends",
      populate: { path: "friendUser" },
    });
    const friends = currentUser.friends;

    res.json({ friends });
  }
);

exports.show_friends_in_chat = asyncHandler(async (req, res, next) => {
  const userInChatQuery = await UserInChat.find({
    chat: req.params.chatid,
  }).populate({
    path: "user",
    select: "username profilePicURL",
  });

  // This corresponds to the people in the chat
  const allUsersInChat = userInChatQuery.map((userInChat) => userInChat.user);

  // Find the friends not part of the chat.
  const friendToUserDocsQuery = await FriendToUser.find({
    user: req.user.id,
  }).populate({
    path: "friendUser",
    select: "username profilePicURL",
  });
  const friendsList = friendToUserDocsQuery.map((doc) => doc.friendUser);

  const friendsNotAddedToChat = friendsList.filter((friend) => {
    // Return the friends that are not part of userInChat
    return !allUsersInChat.some((user) => user.id === friend.id);
  });

  res.json({ allUsersInChat, friendsNotAddedToChat });
});

exports.add_user_to_chat = asyncHandler(async (req, res, next) => {
  await createUserInChatFromReq(req.params.chatid, req.params.userid);
  res.json({});
});

exports.get_chats_for_user = asyncHandler(async (req, res, next) => {
  const userWithChatsQuery = await User.findOne({ _id: req.user.id })
    .populate({
      path: "chats",
      select: "chat -_id -user",
      populate: {
        path: "chat",
      },
    })
    .exec();

  let allChats = userWithChatsQuery.chats.map((doc) => doc.chat);
  allChats = allChats.sort((a, b) => {
    return b.lastUpdated - a.lastUpdated;
  });

  res.json({ allChats });
});

exports.get_chat_messages = asyncHandler(async (req, res, next) => {
  // Need to implement preventing a user access to a  chat if they are not part of that chat.
  // Finding all messages that are related to the chat.
  const chat = await Chat.findById(req.params.chatid);
  if (!chat) return res.status(400).send();
  else {
    const chat = await Chat.findById(req.params.chatid).populate({
      path: "chatMessages",

      populate: [
        { path: "author", select: "username profilePicURL" },
        {
          path: "messageReplyingTo",
          populate: {
            path: "author",
            select: "username",
          },
        },
      ],
    });

    res.json({ chat });
  }
});

exports.change_chat_name = [
  body("chat_name").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const chatName = he.decode(req.body.chat_name);
    const currentChat = await Chat.findById(req.params.chatid);
    if (!currentChat) return res.status(400).end();

    currentChat.name = chatName;
    await currentChat.save();

    res.json({});
  }),
];

exports.view_participants = asyncHandler(async (req, res, next) => {
  const chatQuery = await Chat.findById(req.params.chatid);
  // add something to check if chatid is valid, and if not, return 400 error

  const participants = chatQuery;
  res.json(participants);
});
