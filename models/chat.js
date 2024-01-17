const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    // should Chat contain array of users
    // or should users contain array of chats...
})

module.exports = mongoose.model('Chat', ChatSchema);

