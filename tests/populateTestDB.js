const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Chat = require('../models/chat');
const UserInChat = require('../models/userInChat');
const FriendToUser = require('../models/friendToUser');
const Message = require('../models/message');

const { users } = require('./testConfig/users');

// async function createUser(user) {

//     const newUser = new User(user)
//     const hashedPass = await bcrypt.hash(user.password, 10)
//     newUser.password = hashedPass
//     await newUser.save();
// }

// async function createAllUsers() {
//     testUsers.map(user => createUser(user))
// }

// create friendTouser
async function createFriendToUser() {

}

// create Chat
// create UserInChat

// create Message


async function populateTestDB() {
    // await createAllUsers()
}

module.exports = populateTestDB;
