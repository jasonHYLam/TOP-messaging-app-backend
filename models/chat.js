const opts = { toJSON: { virtuals: true } };
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    // lastUpdated field
    lastUpdated: { type: Date, default: new Date()}
}, opts)

ChatSchema.virtual('users', {
    ref: 'UserInChat',
    localField: '_id',
    foreignField: 'user',
})

ChatSchema.virtual('chatMessages', {
    ref: 'Message'
})
module.exports = mongoose.model('Chat', ChatSchema);

