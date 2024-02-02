const opts = { 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }, 
};
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true},
    password: { type: String, required: true},
    description: { type: String, default: ''},
    // profile picture...
    profilePicURL: { type: String, default: ''},
    // deletedStatus
}, opts)

// Virtual field for obtaining Friend documents associated with User.
UserSchema.virtual('friends', {
    ref: 'FriendToUser',
    localField: '_id',
    foreignField: 'user',
})

// Virtual field for obtaining Chat documents associated with User. 
UserSchema.virtual('chats', {
    ref: 'UserInChat',
    localField: '_id',
    foreignField: 'chat',
})

module.exports = mongoose.model('User', UserSchema);
