const objectIds = require('./objectIds');

const messages = [
    {
        _id: objectIds.messageIDs[0],
        text: 'message1',
        author: objectIds.userIDs[0],
        messageReplyingTo: null,
        imageURL: null,
        isDeleted: false,
        timeStamp: Date(),
        reactions: null,
    },

    {
        _id: objectIds.messageIDs[1],
        text: 'message2',
        author: objectIds.userIDs[1],
        messageReplyingTo: null,
        imageURL: null,
        isDeleted: false,
        timeStamp: Date(),
        reactions: null,
    },

    {
        _id: objectIds.messageIDs[2],
        text: 'message3',
        author: objectIds.userIDs[0],
        messageReplyingTo: null,
        imageURL: null,
        isDeleted: false,
        timeStamp: Date(),
        reactions: null,
    },
]

module.exports = messages
