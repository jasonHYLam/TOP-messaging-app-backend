const User = require('../models/user');

async function createUser(username, password) {
    const newUser = new User({
        username,
        password
    })
     newUser.save();
}

async function populateTestDB() {
    await Promise.all([
        createUser('user', 'Abc123')
    ])
}

module.exports = populateTestDB;
