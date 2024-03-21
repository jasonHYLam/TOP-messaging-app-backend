const asyncHandler = require("express-async-handler");
const { upload } = require("../cloudinaryConfig");
const { body } = require("express-validator");
const he = require("he");

const User = require("../models/user");

// Will not bother with changing username and password.

exports.get_logged_in_user = asyncHandler(async (req, res, next) => {
  const loggedInUser = await User.findById(
    req.user.id,
    "username profilePicURL"
  );
  res.json({ loggedInUser });
});

exports.change_description = [
  body("changeToSubmit").trim().escape(),

  asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {
      description: he.decode(req.body.changeToSubmit),
    });
    res.json({});
  }),
];

exports.change_image = [
  upload.single("profilePic"),

  asyncHandler(async (req, res, next) => {
    // modify User document.
    await User.findByIdAndUpdate(req.user.id, {
      profilePicURL: req.file.path,
      imageID: req.file.fieldname,
    });
    res.json({});
  }),
];
