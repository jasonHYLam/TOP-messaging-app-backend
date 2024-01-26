const request = require('supertest');
const express = require('express');
const {initializeMongoServer, closeMongoServer} = require('../mongoTestingConfig');
const populateTestDB = require('./populateTestDB');

const app = express();

const index = require('../routes/index');
// not sure if passport is needed
const passport = require('passport');
const initializePassport = require('../passportConfig');
initializePassport(passport);

const User = require('../models/user');
// app.use(passport.initialize())
// app.use(passport.session())

app.use(express.urlencoded({ extended: false }));
app.use('/', index);

// might need to add stuff to database beforehand... how do I go about that.
beforeAll(async() => {
    await initializeMongoServer();
    await populateTestDB();

    console.log('done setting upo')
    // const matchingUser = await User.find({username: 'user'})
    const matchingUser = await User.find()
    // console.log(matchingUser)
})

afterAll( async() => {
    await closeMongoServer();
})

describe('login route',() => {

    // test('successful login using without async', (done) => {
    //     request(app)
    //     .post('/login')
    //     .type('form')
    //     .send({username: 'user', password: 'Abc123'})
    //     // .auth('user', 'Abc123')
    //     .expect(200, done())
    // })

    test('successful login using with async', async() => {

        const data = {username: 'user', password: 'Abc123'};
        const response = await request(app)
        .post('/login')
        .type('form')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data)
        expect(response.status).toEqual(200)
    })

    test('successful login with req.user set', async() => {

        const data = {username: 'user', password: 'Abc123'};
        const agent = request.agent(app)
        // const response = await request(app)
        agent
        .post('/login')
        .type('form')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data)
        // expect(response.status).toEqual(200)
        console.log('checking agent object')
        console.log(agent)
        expect(agent.user.username).toEqual('user')

    })
})

// test getting messages from chat when accessing chatid
// need to further populate...
// describe('chat route', () => {

// })

// it('is a sanity check', () => {
//     expect(1 + 1).toEqual(3)
// })

// it('another sanity check', () => {
//     expect(1)
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


// make new chat
// this requires at least 2 users. 
// If there are less than two, how would I plan around that.
// Also it seems I need the current user, aka i need req.user



