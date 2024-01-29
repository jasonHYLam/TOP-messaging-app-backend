const User = require('../models/user');

const request = require('supertest');
const express = require('express');
const {initializeMongoServer, closeMongoServer} = require('../mongoTestingConfig');
const populateTestDB = require('./populateTestDB');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const index = require('../routes/index');
// not sure if passport is needed
const passport = require('passport');
const initializePassport = require('../passportConfig');
initializePassport(passport);

const app = express();


app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: process.env.MODE === 'prod',
        secure: process.env.MODE === 'prod',
        sameSite: process.env.MODE === 'prod' ? 'none' : 'lax',
    }
}))

// app.use(passport.initialize())
app.use(passport.session())

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

describe('create chat', () => {

        // const response = request(app);
        const agent = request.agent(app)
        agent.post('/login', (req, res) => {
            console.log('not sure')
            console.log(req.cookie)
        })

    it('create chat if successful login', async (req, res) => {
    //     const data = {username: 'user', password: 'Abc123'};

        // const response = request(app);
        // const agent = response.agent(app);

        agent
        // const agent = response.agent(app);
        .post('/login')
        .type('form')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        // // .send(data)
        .auth('user1', 'a')

        console.log('getting agent')

        // console.log(agent.jar)
        // console.log(agent.jar.getCookie())
        const cookie = agent.jar.getCookie()
        console.log(cookie)
        console.log('checking cookie')
        // expect(req.user).toEqual('yes')
        expect(agent.status).toEqual(200)

        // agent
    })

})


