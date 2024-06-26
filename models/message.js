const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;
const opts = {
  toJSON: { virtuals: true },
  versionKey: false,
};

const MessageSchema = new Schema(
  {
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },

    messageReplyingTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    imageURL: { type: String, default: null },

    isDeleted: { type: Boolean, default: false },

    timeStamp: { type: Date, required: true, default: new Date() },

    reactions: {
      reaction: {
        reactionType: { type: String },
        imageURL: { type: String },
        number: { type: Number },
      },
    },
  },
  opts
);

MessageSchema.virtual("timeStampFormatted").get(function () {
  return DateTime.fromJSDate(this.timeStamp).toFormat("T dd/LL/yy");
});

module.exports = mongoose.model("Message", MessageSchema);
