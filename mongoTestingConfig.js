const mongoose = require('mongoose');

const { MongoMemoryServer } = require('mongodb-memory-server');

async function initializeMongoServer() {
    console.log('This should happen first')
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    mongoose.connect(mongoUri);


    mongoose.connection.on('error', e => {
        if (e.message.code === 'ETIMEDOUT') {
            console.log(e)
            mongoose.connect(mongoUri);
        }
        console.log(e)
    })

    mongoose.connection.once('open', () => {
        console.log(`MongoDB successfully connected to ${mongoUri}`)
    })
}

async function closeMongoServer() {
    mongoose.disconnect();
    mongoose.connection.close()
}

module.exports = {initializeMongoServer, closeMongoServer};