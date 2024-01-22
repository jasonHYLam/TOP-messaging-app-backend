const request = require('supertest');
const express = require('express');
const {initializeMongoServer, closeMongoServer} = require('../mongoTestingConfig');
const populateTestDB = require('./populateTestDB');
const app = express();
const index = require('../routes/index');

app.use(express.urlencoded({ extended: false }));
app.use('/', index);

// might need to add stuff to database beforehand... how do I go about that.
beforeAll( async() => {
    initializeMongoServer();
    populateTestDB();
})

afterAll( async() => {
    closeMongoServer();
})

describe('login route', () => {

    test('successful login', async () => {
        const response = await request(app)
        .post('/login')
        // .type('form')
        // .send({username: 'user', password: 'Abc123'})
        .auth('user', 'Abc123')
        expect(response.status).toEqual(200)
    })
})

// test getting messages from chat when accessing chatid



