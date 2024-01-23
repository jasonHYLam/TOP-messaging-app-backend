const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true},
    password: { type: String, required: true},
    description: { type: String, default: ''},
    // profile picture...
    profilePicURL: { type: String, default: ''},
    // deletedStatus
    // not sure if user should contain array of chats.
})

// make friends virtual
UserSchema.virtual('friends', {
    ref: 'FriendToUserSchema',
    localField: '_id',
    foreignField: 'user',
})

module.exports = mongoose.model('User', UserSchema);
