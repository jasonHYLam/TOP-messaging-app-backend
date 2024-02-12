const User = require('../models/user');
const app = require('./testConfig/testApp');

describe('login route',() => {

    test('successful login', async() => {

        const data = {username: 'user1', password: 'a'};
        const response = await request(app)

        .post('/login')
        .set('Content-Type', 'application/json')
        .send(data)
        expect(response.status).toEqual(200)
    })

    test('unsuccessful login', async() => {

        const data = {username: 'user1', password: 'b'};
        const response = await request(app)

        .post('/login')
        .set('Content-Type', 'application/json')
        .send(data)
        expect(response.status).toEqual(401)
    })

})

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

// fetch chats
describe('fetch chats', () => {
    it ('logs in then fetches chats', async() => {

        const data = {username: 'user1', password: 'a'};
        const agent = request.agent(app) 
        // await agent
        // .post('/login')
        // .set('Content-Type', 'application/json')
        // .withCredentials()
        // .send(data)

        // await agent
        // .get('/home/get_chats_for_user')

        // console.log(agent.status)


        agent
        .post('/login')
        .set('Content-Type', 'application/json')
        .withCredentials()
        .send(data)
        .then(res => {
            res
            .get('/home/get_chats_for_user')

            console.log(
                (res.status)
            )
        })

        // expect(agent.body.chats.length === 4)
    })
})



// add new friend
// describe('adding friends',  () => {
//     it('logs in then adds a friend', () => {})
// })

// make new chat
// this requires at least 2 users. 
// If there are less than two, how would I plan around that.
// Also it seems I need the current user, aka i need req.user

// describe('create chat', () => {

//         // const response = request(app);
//         const agent = request.agent(app)
//         agent.post('/login', (req, res) => {
//             console.log('not sure')
//             console.log(req.cookie)
//         })

//     it('create chat if successful login', async (req, res) => {
//     //     const data = {username: 'user', password: 'Abc123'};

//         // const response = request(app);
//         // const agent = response.agent(app);

//         agent
//         // const agent = response.agent(app);
//         .post('/login')
//         .type('form')
//         .set('Content-Type', 'application/json')
//         .set('Accept', 'application/json')
//         // // .send(data)
//         .auth('user1', 'a')

//         console.log('getting agent')

//         // console.log(agent.jar)
//         // console.log(agent.jar.getCookie())
//         const cookie = agent.jar.getCookie()
//         console.log(cookie)
//         console.log('checking cookie')
//         // expect(req.user).toEqual('yes')
//         expect(agent.status).toEqual(200)

//         // agent
//     })

// })


