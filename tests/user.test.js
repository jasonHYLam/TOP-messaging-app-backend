const app = require('./testConfig/testApp');
const request = require('supertest');

const users = require('./testConfig/users');

const { initializeMongoServer, closeMongoServer } = require('../mongoTestingConfig');
const populateTestDB = require('./testConfig/populateTestDB');

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
    test('access userProfile route without logging in results in internal error', () => {
        return request.agent(app)
        .get(`/home/user_profile/${users[0]._id.toString()}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(500)
    })

    test('login then access userProfile', () => {
        const agent = request.agent(app)
        return agent
        .post('/login')
        .send(loginData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
        .then(() => {

            return agent
            .get(`/home/user_profile/${users[0]._id.toString()}`)
            .expect(200)
            .then( res => {
                expect(res.body).toEqual('something')
            })
        })
    })

    test('login then access userProfile using async/await', async () => {
        // const agent = await request.agent(app)
        const agent = request.agent(app)
        const response = await agent
        .post('/login')
        .send(loginData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        expect(response.status).toEqual(200)

        const response2 = await agent
        .get(`/home/user_profile/${users[0]._id.toString()}`)
        expect(response2.status).toEqual(200)
        expect(response2.body).toEqual('something')
    })

})