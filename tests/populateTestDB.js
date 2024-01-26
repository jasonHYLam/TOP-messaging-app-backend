const User = require('../models/user');

async function createUser(username, password) {

    console.log('This should happen second')
    const newUser = new User({
        username,
        password
    })
     await newUser.save();
     console.log(`new User saved: ${newUser.username}`)
}

async function populateTestDB() {
    await Promise.all([
        createUser('user', 'Abc123')
    ])
}

module.exports = populateTestDB;
