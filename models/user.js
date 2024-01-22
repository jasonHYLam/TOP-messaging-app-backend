const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true},
    password: { type: String, required: true},
    // description: { type: String, required: true, default: ''},
    // profile picture...
    // deletedStatus
    // not sure if user should contain array of chats.
    // friendsList field
    // not sure if this is correct
    friendsList: [{type: Schema.Types.ObjectId, ref: "User"}],
    // isOnline field... maybe... 
})

module.exports = mongoose.model('User', UserSchema);
