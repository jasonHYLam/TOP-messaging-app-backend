const mongoose = require('mongoose');

const { MongoMemoryServer } = require('mongodb-memory-server');

async function initializeMongoServer() {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);

    await mongoose.connection.on('error', e => {
        if (e.message.code === 'ETIMEDOUT') {
            console.log(e)
            mongoose.connect(mongoUri);
        }
        console.log(e)
    })

    await mongoose.connection.once('open', () => {
        console.log(`MongoDB successfully connected to ${mongoUri}`)
    })

}

async function closeMongoServer() {
    await mongoose.disconnect();
    mongoose.connection.close()
}

async function dropDatabase() {
    await mongoose.connection.dropDatabase()
}

module.exports = {initializeMongoServer, closeMongoServer, dropDatabase};