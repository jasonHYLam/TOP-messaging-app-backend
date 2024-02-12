const {initializeMongoServer, closeMongoServer} = require('../../mongoTestingConfig');
const populateTestDB = require('./populateTestDB');

beforeAll(async() => {
    await initializeMongoServer();
    await populateTestDB();
})

afterAll( async() => {
    await closeMongoServer();
})