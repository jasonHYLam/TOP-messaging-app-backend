const asyncHandler = require("express-async-handler");
const { body } = require('express-validator');
const he = require('he');

const Chat = require('../models/chat');
const User = require('../models/user');
const UserInChat = require('../models/userInChat');

const { createUserInChatFromReq } = require("../helpers/chatUtils");

// This involves creating a chat document as well as userInChat documents for each user being added to the chat.
// This requires an array of friendRelation objects (objects that store the ObjectId of friends to add to a chat).
exports.create_new_chat = [
    
    body('chatName').trim().escape(),
    
    asyncHandler( async(req, res, next) => {

        // From the frontend (and test), request sends an array variable called addToChatUserIds.
        // This is an array of userIds
        // This will be used to find matchingUser and add user to chat

        // this requires an array of user ids to make a chat with.
        // I think I need to create the userInChat models and attach User And Chat to them...

        if (!req.body.addToChatUserIds) {
            return res.status(404).end();
        }
        else if (req.body.addToChatUserIds.length === 0) {
            return res.status(404).end();
        }
        else {

            const newChat = new Chat({
                name: he.decode(req.body.chatName)
            })
            await newChat.save()

            const addToChatUserIds = req.body.addToChatUserIds;


            addToChatUserIds.map(async userid => await createUserInChatFromReq(newChat, userid));
            // res.json({});
            res.json({chatid: newChat._id})
        }
    })
]

exports.show_friends_for_initial_chat_creation = asyncHandler( async( req, res, next ) => {


    const currentUser = await User
    .findById(req.user.id)
    .populate({
        path: 'friends',
        populate: {path: 'friendUser'}
    })
    const friends = currentUser.friends
    // console.log('checking friends')
    // console.log(friends)

    res.json({friends});

})

exports.show_friends_in_chat = asyncHandler(async (req, res, next) => {
  // right. for a given chat, get users
  const userInChatQuery = await UserInChat.
  find({chat: req.params.chatid}).
  populate({
    path: 'user',
    select: 'username profilePicURL',
  })
  const allUsers = userInChatQuery.map(userInChat => userInChat.user)

  console.log('checking allusers')
  console.log(allUsers)

  res.json({allUsers})
})

exports.add_user_to_chat = asyncHandler( async( req, res, next ) => {
  // for a given chat, add the user to the chat
  await createUserInChatFromReq(req.params.chatid, req.params.userid)
  res.json({})
})

exports.get_chats_for_user = asyncHandler( async( req, res, next ) => {

    console.log('checking if req.user exists');
    console.log(req.user);
    // sort these by lastUpdated field.
    // Do I need to populate here... maybe? 
    // Maybe the names of the users
    // And the latest comment.

    const userInChatsQuery = await UserInChat.find({user: req.user.id})
    .populate('chat', {
      // sort: {'last_updated': -1}
    })
    // is it possible to sort by lastUpdated...?
    .exec();

    const allChats = userInChatsQuery.map(userInChat => userInChat.chat)

    // console.log('checking allChats')
    // console.log(allChats)

    res.json({allChats})
})

exports.get_chat_messages = asyncHandler( async(req, res, next) => {
    // finding all messages that are related to the chat.
    const chat = await Chat.findById(req.params.chatid)
    if (!chat) return res.status(400).send();
    else {
      const chat = await Chat
      .findById(req.params.chatid)
      .populate({
          path: 'chatMessages',
          
          populate: [
              {path: 'author',
              select: 'username profilePicURL'
          },
              {path: 'messageReplyingTo',
              populate: {
                  path: 'author',
                  select: 'username',
              },
          },
          ]
      })
      res.json({chat})
    }

})

exports.change_chat_name = [
  body('chat_name').trim().escape(),

  asyncHandler(async( req, res, next ) => {

    const chatName = he.decode(req.body.chat_name);
    const currentChat = await Chat.findById(req.params.chatid);
    if (!currentChat) return res.status(400).end();

    currentChat.name = chatName;
    await currentChat.save();

    res.json({});
  })
]