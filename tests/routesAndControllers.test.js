const request = require('supertest');
const express = require('express');
const {initializeMongoServer, closeMongoServer} = require('../mongoTestingConfig');
const populateTestDB = require('./populateTestDB');
// const app = express();

const app = require('../app');
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
    // return () => {

    await initializeMongoServer();
    await populateTestDB();
    // }
    console.log('done setting upo')
    const matchingUser = await User.find({username: 'user'})
    console.log(matchingUser)
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
        // .auth('user', 'Abc123')
        // expect(200)
        expect(response.status).toEqual(200)
    })
})

// test getting messages from chat when accessing chatid
// need to further populate...
// describe('chat route', () => {

// })

it('is a sanity check', () => {
    expect(1 + 1).toEqual(3)
})

// it('another sanity check', () => {
//     expect(1)
// })

// make new user
// describe('sign up route', () => {
//     it('signs up successfully', (done) => {
//         // const response = await request(app)
//         request(app)
//         .post('/signup')
//         .type('form')
//         .send({username: 'doris', password: 'DeafAids'})
//         .then(() => {
//             request(app)
//             .expect(200, done)
//         })
//     })
// })


// make new chat



