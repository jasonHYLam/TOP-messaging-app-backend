const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const opts = { toJSON: { virtuals: true }}

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    text: { type: String, required: true},
    author: { type: Schema.Types.ObjectId, ref: "User"},
    chat: { type: Schema.Types.ObjectId, ref: "Chat"},
    // isReply

    // messageReplyingTo

    // image
    imageURL: { type: String },

    // isDeleted

    // timeStamp
    timeStamp: { type: Date, required: true},

    // reaction
    reactions: { reaction: {
        reactionType: {type: String},
        imageURL: {type: String},
        number: {type: Number}
    }}

}, opts)

MessageSchema.virtual('timeStampFormatted').get(function() {
    return DateTime.fromJSDate(this.timeStamp).toFormat('T dd/LL/yy');
})

module.exports = mongoose.model('Message', MessageSchema);

