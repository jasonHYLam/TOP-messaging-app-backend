const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const opts = { toJSON: { virtuals: true }}

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    text: { type: String, required: true},
    author: { type: Schema.Types.ObjectId, ref: "User"},
    // isReply

    // messageReplyingTo

    // image

    // isDeleted

    // timeStamp
    timeStamp: { type: Date, required: true},
}, opts)

CommentSchema.virtual('timeStampFormatted').get(function() {
    return DateTime.fromJSDate(this.timeStamp).toFormat('T dd/LL/yy');
})

module.exports = mongoose.model('Comment', CommentSchema);

