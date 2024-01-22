const request = require('supertest');
const express = require('express');
const {initializeMongoServer, closeMongoServer} = require('../mongoTestingConfig');
const populateTestDB = require('./populateTestDB');
const app = express();
const index = require('../routes/index');
// not sure if passport is needed
const passport = require('passport');
require('../passportConfig');
app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({ extended: false }));
app.use('/', index);

// might need to add stuff to database beforehand... how do I go about that.
beforeAll( async() => {
    // initializeMongoServer();
    // populateTestDB();
    await initializeMongoServer();
    await populateTestDB();
})

afterAll( async() => {
    // closeMongoServer();
    // await closeMongoServer();
})

describe('login route',() => {

    test('successful login', async () => {
        const response = await request(app)
        .post('/login')
        // .type('form')
        .send({username: 'user', password: 'Abc123'})
        // .auth('user', 'Abc123')
        expect(response.status).toEqual(200)
    })
})

// test getting messages from chat when accessing chatid
// need to further populate...
describe('chat route', () => {


})



