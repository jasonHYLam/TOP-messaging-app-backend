const { ObjectId } = require('mongoose').Types;

const objectIds = {
    userIDs: [
        ObjectId(`65be5813dad7a9ce85209436`),
        ObjectId(`65be5818dad7a9ce85209438`),
        ObjectId(`65be581edad7a9ce8520943a`),
        ObjectId(`65bead9ffc37f417a9ca2770`),
    ],

    chatIDs: [
        ObjectId(`65c00221c4dffec208392074`),
    ],

    userInChatIDs: [
        ObjectId(`65c00221c4dffec208392077`),
        ObjectId(`65c65c2323b8d051d7302f8d`),
        ObjectId(`65c65c3423b8d051d7302fa7`),
    ],

    friendToUserIDs: [
        ObjectId(`65be5825dad7a9ce85209448`), // user1 , user2
        ObjectId(`65be5825dad7a9ce85209449`), // user2 , user1

        ObjectId(`65be5828dad7a9ce85209457`), // user1 , user3
        ObjectId(`65be5828dad7a9ce85209458`), // user3 , user1
    ],

    messageIDs: [
        ObjectId(`65c0f5dcf0e1ac63c1209398`),
        ObjectId(`65c11539f0e1ac63c12093a5`),
        ObjectId(`65c1165baa050fa15b0bf575`),
    ]
}

module.exports = objectIds