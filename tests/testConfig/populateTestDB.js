const bcrypt = require('bcryptjs');

const User = require('../../models/user');
const Chat = require('../../models/chat');
const UserInChat = require('../../models/userInChat');
const FriendToUser = require('../../models/friendToUser');
const Message = require('../../models/message');

const users = require('./users');
const friendToUsers = require('./friendToUsers');
const chats = require('./chats');
const userInChats = require('./userInChats');
const messages = require('./messages');

async function createUser(user) {

    const newUser = new User(user);
    const hashedPass = await bcrypt.hash(user.password, 10);
    newUser.password = hashedPass;

    // console.log('checking newUser')
    // console.log(newUser)
    await newUser.save();
}

async function createAllUsers() {
    users.map(user => createUser(user))
}

// create friendTouser
async function createFriendToUser(data) {
    const newFriendToUser = new FriendToUser(data);
    await newFriendToUser.save();

}

async function createAllFriendToUsers() {
    friendToUsers.map(data => createFriendToUser(data))
}

// create Chat
async function createChat(chat) {
    const newChat = new Chat(chat);
    await newChat.save();
}

async function createAllChats() {
    chats.map(chat => createChat(chat));
}

// create UserInChat
async function createUserInChat(data) {
    const newUserInChat = new UserInChat(data);
    await newUserInChat.save();
}

async function createAllUserInChats() {
    userInChats.map(data => createUserInChat(data))
}

// create Message
async function createMessage(data) {
    const newMessage = new Message(data);
    newMessage.save();
}

async function createAllMessages() {
    messages.map(data => createMessage(data));
}


async function populateTestDB() {
    await Promise.all([
        createAllUsers(),
        createAllFriendToUsers(),
        createAllChats(),
        createAllUserInChats(),
        createAllMessages(),
    ])
}

module.exports = populateTestDB;
