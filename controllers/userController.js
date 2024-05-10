const mongoose = require("mongoose");

const asyncHandler = require("express-async-handler");

const { body } = require("express-validator");

const User = require("../models/user");
const FriendToUser = require("../models/friendToUser");

function checkIfParamsAreInvalid(userid) {
  const isValid = mongoose.isValidObjectId(userid);
  return !isValid;
}

// Returns a list of users whose usernames match the search query; separated into friends and non-friends.
exports.search_user = [
  body("searchQuery").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const matchingUsers = await User.find({
      _id: { $ne: req.user.id },
      username: req.body.searchQuery,
    }).exec();

    const currentUser = await User.findById(req.user.id).populate("friends");

    const friends = matchingUsers.filter((searchedUser) =>
      currentUser.friends.some((friend) =>
        searchedUser.equals(friend.friendUser)
      )
    );

    const nonFriends = matchingUsers.filter((searchedUser) => {
      if (!currentUser.friends.length) return true;

      return currentUser.friends.every(
        (friend) => !searchedUser.equals(friend.friendUser)
      );
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
  }
  if (req.user.id === req.params.userid) {
    return res.status(400).end();
  }
  {
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

    res.json({});
  }
});

//
exports.get_user_profile = asyncHandler(async (req, res, next) => {
  if (checkIfParamsAreInvalid(req.params.userid)) {
    return res.status(404).end();
  }
  {
    const matchingUser = await User.findById(
      req.params.userid,
      "username description profilePicURL "
    ).exec();

    const isCurrentUserProfile = req.user.id === req.params.userid;
    res.json({ matchingUser, isCurrentUserProfile });
  }
});

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
  }
  if (req.params.userid === req.user.id) {
    return res.status(400).end();
  }
  if (
    checkIfUserIsNotInFriendsList(
      currentUserWithFriends.friends,
      req.params.userid
    )
  ) {
    return res.status(400).end();
  }
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
});
