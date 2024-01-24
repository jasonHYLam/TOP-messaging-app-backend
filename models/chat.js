const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    // should Chat contain array of users
    // or should users contain array of chats...
    // 
    // lastUpdated field
})

ChatSchema.virtual('users', {
    ref: 'UserInChatSchema',
    localField: '_id',
    foreignField: 'user',
})

module.exports = mongoose.model('Chat', ChatSchema);

