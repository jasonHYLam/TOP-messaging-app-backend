const { DateTime } = require("luxon");

const opts = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  versionKey: false,
};
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChatSchema = new Schema(
  {
    name: { type: String },
    lastUpdated: { type: Date, default: new Date() },
  },
  opts
);

ChatSchema.virtual("lastUpdatedFormatted").get(function () {
  return DateTime.fromJSDate(this.lastUpdated).toLocaleString(
    DateTime.DATETIME_SHORT
  );
});

ChatSchema.virtual("users", {
  ref: "UserInChat",
  localField: "_id",
  foreignField: "user",
});

ChatSchema.virtual("chatMessages", {
  ref: "Message",
  localField: "_id",
  foreignField: "chat",
});

module.exports = mongoose.model("Chat", ChatSchema);
