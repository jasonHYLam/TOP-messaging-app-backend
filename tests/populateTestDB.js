const User = require('../models/user');

async function createUser(username, password) {

    const newUser = new User({
        username,
        password
    })
     await newUser.save();
    //  console.log(`new User saved: ${newUser.username}`)
}

async function createAllUsers() {
    await Promise.all([
        createUser('user1', 'a'),
        createUser('user2', 'a'),
        createUser('user3', 'a'),
        createUser('user4', 'a'),
    ])
}



async function populateTestDB() {
    await createAllUsers()
}

module.exports = populateTestDB;
