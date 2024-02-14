const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FriendToUserSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User"},
    friendUser: { type: Schema.Types.ObjectId, ref: "User"},
}, {versionKey: false})

module.exports = mongoose.model('FriendToUser', FriendToUserSchema,);

