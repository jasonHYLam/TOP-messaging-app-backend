const app = require('./testConfig/testApp');
const request = require('supertest');
const { initializeMongoServer, closeMongoServer, dropDatabase } = require('../mongoTestingConfig');
const populateTestDB = require('./testConfig/populateTestDB');

const User = require("../models/user")

const users = require('./testConfig/users');
const loginData = {username: users[0].username, password: users[0].password}

beforeAll(async() => {
    await initializeMongoServer();
    // await populateTestDB();
})

afterAll( async() => {
    await closeMongoServer();
})

beforeEach(async () => {
    await populateTestDB();
})

afterEach(async() => {
    await dropDatabase();
})

describe('login route',() => {

    test('successful login with valid credentials', async() => {

        const usersInDatabase = await User.find();
        console.log('checking usersInDatabase')
        console.log(usersInDatabase)

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

        const usersInDatabase = await User.find();
        console.log('checking usersInDatabase')
        console.log(usersInDatabase)

        const data = {username: 'user9', password: 'a'};

        const response = await request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(data)
        expect(response.status).toEqual(401)
    })

    test('unsuccessful login with invalid password', async() => {

        const usersInDatabase = await User.find();
        console.log('checking usersInDatabase')
        console.log(usersInDatabase)
        const data = {username: 'user1', password: 'b'};
        const response = await request(app)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(data)
        expect(response.status).toEqual(401)
    })
})

describe('sign up route', () => {
    it('signs up successfully', async() => {
        const response = await request(app)

        .post('/signup')
        .type('form')
        .send({username: 'doris', password: 'DeafAids'})
        expect(response.status).toEqual(200)
    })
})