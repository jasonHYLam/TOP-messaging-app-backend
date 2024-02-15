const app = require('./testConfig/testApp');
const request = require('supertest');
const { initializeMongoServer, closeMongoServer } = require('../mongoTestingConfig');
const populateTestDB = require('./testConfig/populateTestDB');

const users = require('./testConfig/users');
const loginData = {username: users[0].username, password: users[0].password}

beforeAll(async() => {
    await initializeMongoServer();
    await populateTestDB();
})

afterAll( async() => {
    await closeMongoServer();
})

describe('login route',() => {

    test('successful login with valid credentials', async() => {

        const loginData = {username: users[0].username, password: users[0].password}
        const data = {username: 'user1', password: 'a'}

        const response = await request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(data)

        expect(response.status).toEqual(200)
    })

    test('unsuccessful login with invalid username', async() => {

        const data = {username: 'user9', password: 'a'};

        const response = await request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(data)
        expect(response.status).toEqual(401)
    })

    test('unsuccessful login with invalid password', async() => {

        const data = {username: 'user1', password: 'b'};
        const response = await request(app)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(data)
        expect(response.status).toEqual(401)
    })
})