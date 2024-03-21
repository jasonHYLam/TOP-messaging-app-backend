const mongoose = require("mongoose");

const asyncHandler = require("express-async-handler");

const { body } = require("express-validator");

const User = require("../models/user");
const FriendToUser = require("../models/friendToUser");

function checkIfParamsAreInvalid(userid) {
  const isValid = mongoose.isValidObjectId(userid);
  return !isValid;
}

// Returns up a list of users whose usernames match the search query; separated into friends and non-friends.
exports.search_user = [
  body("searchQuery").trim().escape(),

  asyncHandler(async (req, res, next) => {
    // I'll probably have to modify this find such that it doesn't include password.
    const matchingUsers = await User.find({
      _id: { $ne: req.user.id },
      username: req.body.searchQuery,
    }).exec();

    const currentUser = await User.findById(req.user.id).populate("friends");

    const friends = matchingUsers.filter((searchedUser) => {
      return currentUser.friends.some((friend) => {
        return searchedUser.equals(friend.friendUser);
      });
    });

    const nonFriends = matchingUsers.filter((searchedUser) => {
      if (!currentUser.friends.length) return true;
      else {
        return currentUser.friends.every((friend) => {
          return !searchedUser.equals(friend.friendUser);
        });
      }
    });

    res.json({
      friends,
      nonFriends,
    });
  }),
];

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

// exports.count_online_number = asyncHandler(async (req, res, next) => {});

// exports.count_friends_number = asyncHandler(async (req, res, next) => {});

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

  res.json({ friends });
});

// Not implemented yet.
exports.remove_friend = asyncHandler(async (req, res, next) => {
  const currentUserWithFriends = await User.findById(req.user.id)
    .populate("friends")
    .exec();

  function checkIfUserIsNotInFriendsList(friendsList, userId) {
    return friendsList.every(
      (friendToUser) => friendToUser.friendUser.toString() !== userId
    );
  }

  if (checkIfParamsAreInvalid(req.params.userid)) {
    return res.status(404).end();
  } else if (req.params.userid === req.user.id) {
    return res.status(400).end();
  } else if (
    checkIfUserIsNotInFriendsList(
      currentUserWithFriends.friends,
      req.params.userid
    )
  ) {
    return res.status(400).end();
  } else {
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
