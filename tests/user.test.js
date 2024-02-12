const app = require('./testConfig/testApp');
const request = require('supertest');

const users = require('./testConfig/users');

const { initializeMongoServer, closeMongoServer } = require('../mongoTestingConfig');
const populateTestDB = require('./testConfig/populateTestDB');

console.log('checking app')
console.log(app)

beforeAll(async() => {
    await initializeMongoServer();
    await populateTestDB();
})

afterAll( async() => {
    await closeMongoServer();
})

const loginData = {
    username: users[0].username,
    password: users[0].password,
}

// describe('login route',() => {

//     test('successful login', async() => {

//         const data = {username: 'user1', password: 'a'};
//         const response = await request(app)

//         .post('/login')
//         .set('Content-Type', 'application/json')
//         .send(data)
//         expect(response.status).toEqual(200)
//     })

//     test('unsuccessful login', async() => {

//         const data = {username: 'user1', password: 'b'};
//         const response = await request(app)

//         .post('/login')
//         .set('Content-Type', 'application/json')
//         .send(data)
//         expect(response.status).toEqual(401)
//     })

// })

// make new user
describe('sign up route', () => {
    it('signs up successfully', async() => {
        const response = await request(app)

        .post('/signup')
        .type('form')
        .send({username: 'doris', password: 'DeafAids'})
        expect(response.status).toEqual(200)
    })
})

// get specific user
describe('get user', () => {
    test('userProfile route', () => {
        return request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(loginData)

        .expect(200)
        .then( res => {

            expect(res.body).toEqual('something')
        })

    })

})