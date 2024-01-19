const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true},
    password: { type: String, required: true},
    description: { type: String, required: true},
    // profile picture...
    // deletedStatus
    // not sure if user should contain array of chats.
})

module.exports = mongoose.model('User', UserSchema);
