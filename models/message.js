const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const opts = { 
    toJSON: { virtuals: true },
    versionKey: false,
}

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    text: { type: String, required: true},
    author: { type: Schema.Types.ObjectId, ref: "User"},
    chat: { type: Schema.Types.ObjectId, ref: "Chat"},
    // isReply

    // messageReplyingTo
    messageReplyingTo: { type: Schema.Types.ObjectId, ref: "Message", default: null},

    // image
    imageURL: { type: String, default: null },

    // isDeleted
    isDeleted: { type: Boolean, default: false },

    // timeStamp
    timeStamp: { type: Date, required: true, default: new Date()},

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

