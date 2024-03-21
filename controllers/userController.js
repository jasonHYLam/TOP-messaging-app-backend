const { ObjectId } = require("mongoose").Types;
const mongoose = require("mongoose");

const asyncHandler = require("express-async-handler");

const { body } = require("express-validator");
const he = require("he");

const User = require("../models/user");
const FriendToUser = require("../models/friendToUser");

// may need to change name
// intended to handle adding friends and seeing who is online

function checkIfParamsAreInvalid(userid) {
  // console.log('checking checkIfParamsCorrespondsToUser call: ')
  // console.log(`userid: ${userid}`)
  // console.log(!mongoose.isValidObjectId(userid))
  const isValid = mongoose.isValidObjectId(userid);
  return !isValid;
}

// I think this is just used to bring up a list of users that match the user username
exports.search_user = [
  body("searchQuery").trim().escape(),

  asyncHandler(async (req, res, next) => {
    // I'll probably have to modify this find such that it doesn't include password.
    const matchingUsers = await User.find({
      _id: { $ne: req.user.id },
      username: req.body.searchQuery,
    }).exec();
    const matchingUserIds = matchingUsers.map((user) => {
      return user.id;
    });
    console.log("checking matchingUser ids");
    console.log(matchingUserIds);

    // const currentUser = await User.findById(req.user)
    const currentUser = await User.findById(req.user.id).populate("friends");
    const friendIds = currentUser.friends.map((friend) => friend.id);
    console.log();

    // took me ages to figure this out :/
    // Object.equals() is used for Object equality.
    // Alternatively, compare the stringified Object ids.
    const friends = matchingUsers.filter((searchedUser) => {
      return currentUser.friends.some((friend) => {
        return searchedUser.equals(friend.friendUser);
      });
    });

    // it must be here
    const nonFriends = matchingUsers.filter((searchedUser) => {
      if (!currentUser.friends.length) return true;
      else {
        return currentUser.friends.every((friend) => {
          return !searchedUser.equals(friend.friendUser);
        });
      }
    });

    // console.log('checking friends')
    // console.log(friends)
    // console.log('checking non friends')
    // console.log(nonFriends)
    // console.log(' ')

    res.json({
      friends,
      nonFriends,
    });
  }),
];

// Post to add them
exports.add_user = asyncHandler(async (req, res, next) => {
  // Get the current logged in user via id.
  // Get the user to add via their id and params. Add to each other's friendlist.

  const currentUser = await User.findById(req.user.id);
  const userToAdd = await User.findById(req.params.userid);

  const currentUserWithFriends = await User.findById(req.user.id)
    .populate({ path: "friends" })
    .exec();

  function checkUserIsAlreadyAdded(friendsList, userId) {
    return friendsList.some(
      (friendToUser) => friendToUser.friendUser.toString() === userId
    );
  }

  if (checkIfParamsAreInvalid(req.params.userid)) {
    return res.status(404).end();
  }

  if (
    checkUserIsAlreadyAdded(currentUserWithFriends.friends, req.params.userid)
  ) {
    return res.status(400).end();
  } else if (req.user.id === req.params.userid) {
    return res.status(400).end();
  } else {
    const friendAdding = new FriendToUser({
      user: currentUser,
      friendUser: userToAdd,
    });

    const friendToAdd = new FriendToUser({
      user: userToAdd,
      friendUser: currentUser,
    });

    await friendAdding.save();
    await friendToAdd.save();

    // To access friends, need to call populate on User.
    res.json();
  }
});

//
exports.get_user_profile = asyncHandler(async (req, res, next) => {
  if (checkIfParamsAreInvalid(req.params.userid)) {
    return res.status(404).end();
  } else {
    const matchingUser = await User.findById(
      req.params.userid,
      "username description profilePicURL "
    ).exec();

    const isCurrentUserProfile = req.user.id === req.params.userid;
    res.json({ matchingUser, isCurrentUserProfile });
  }
});

// Perhaps I can use this to see how many people are online. But I have no idea how to approach that.
// What determines whether someone is online. How can the backend know?
exports.count_online_number = asyncHandler(async (req, res, next) => {});

exports.count_friends_number = asyncHandler(async (req, res, next) => {});

exports.get_friends_list = asyncHandler(async (req, res, next) => {
  const currentUserWithFriends = await User.findById(req.user.id)
    .populate({
      path: "friends",
      populate: {
        path: "friendUser",
        select: "username profilePicURL",
      },
    })
    .exec();

  const friends = currentUserWithFriends.friends.map(
    (friendToUser) => friendToUser.friendUser
  );
  // console.log('checking')
  // console.log(friends)

  res.json({ friends });
});

exports.remove_friend = asyncHandler(async (req, res, next) => {
  const currentUserWithFriends = await User.findById(req.user.id)
    .populate("friends")
    .exec();

  function checkIfUserIsNotInFriendsList(friendsList, userId) {
    return friendsList.every(
      (friendToUser) => friendToUser.friendUser.toString() !== userId
    );
  }

  console.log("checking the call of checkIfParamsAreInvalid:");
  console.log(`req.params.userid:${req.params.userid}`);
  console.log(checkIfParamsAreInvalid(req.params.userid));

  if (checkIfParamsAreInvalid(req.params.userid)) {
    console.log("a");
    return res.status(404).end();
  } else if (req.params.userid === req.user.id) {
    console.log("b");
    return res.status(400).end();
  } else if (
    checkIfUserIsNotInFriendsList(
      currentUserWithFriends.friends,
      req.params.userid
    )
  ) {
    console.log("or is this happening");
    return res.status(400).end();
  } else {
    console.log("d");

    const user1 = await FriendToUser.find({
      user: req.user.id,
      friendUser: req.params.userid,
    });
    const user2 = await FriendToUser.find({
      user: req.user.id,
      friendUser: req.params.userid,
    });

    console.log("checking users to delete:");
    console.log(user1);
    console.log(user2);

    await Promise.all([
      FriendToUser.deleteOne({
        user: req.user.id,
        friendUser: req.params.userid,
      }),

      FriendToUser.deleteOne({
        user: req.params.userid,
        friendUser: req.user.id,
      }),
    ]);

    res.json({});
  }
});
