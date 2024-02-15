const app = require('./testConfig/testApp');
const request = require('supertest');

const { initializeMongoServer, closeMongoServer } = require('../mongoTestingConfig');
const populateTestDB = require('./testConfig/populateTestDB');

const chats = require('./testConfig/chats');

beforeAll(async() => {
    await initializeMongoServer();
    await populateTestDB();
})

afterAll( async() => {
    await closeMongoServer();
})
// fetch chats
describe('fetch chats', () => {
    it ('logs in then fetches chats', async() => {

        const data = {username: 'user1', password: 'a'};
        const agent = request.agent(app) 

        const loginResponse = await agent
        .post('/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(data)
        expect(loginResponse.status).toEqual(200)

        const getChatsResponse = await agent
        .get('/home/get_chats_for_user')
        expect(getChatsResponse.status).toEqual(200)
        expect(getChatsResponse.body).toEqual([
            chats[0]
        ])


        // console.log(agent.status)



        // expect(agent.body.chats.length === 4)
    })
})


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


