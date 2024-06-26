const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const opts = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    description: { type: String, default: "" },
    profilePicURL: { type: String, default: "" },
    imageID: { type: String, default: "" },
    isGuest: { type: Boolean, default: false },
  },
  opts
);

// Virtual field for obtaining Friend documents associated with User.
UserSchema.virtual("friends", {
  ref: "FriendToUser",
  localField: "_id",
  foreignField: "user",
});

// Virtual field for obtaining Chat documents associated with User.
UserSchema.virtual("chats", {
  ref: "UserInChat",
  localField: "_id",
  foreignField: "user",
});

module.exports = mongoose.model("User", UserSchema);
