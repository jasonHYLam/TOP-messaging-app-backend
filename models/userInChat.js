const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserInChatSchema = new Schema({
    chat: { type: Schema.Types.ObjectId, ref: "Chat"},
    user: { type: Schema.Types.ObjectId, ref: "User"},
})

module.exports = mongoose.model('UserInChatSchema', UserInChatSchema)