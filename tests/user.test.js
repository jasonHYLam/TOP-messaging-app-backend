const app = require('./testConfig/testApp');
const request = require('supertest');

const users = require('./testConfig/users');
const friendToUsers = require('./testConfig/friendToUsers')

const { initializeMongoServer, closeMongoServer } = require('../mongoTestingConfig');
const populateTestDB = require('./testConfig/populateTestDB');

const loginData = {username: users[0].username, password: users[0].password}

const userIds = users.map(user => user._id.toString())
const userDataForFrontend = users.map((user) => {
    return {
        username: user.username,
        _id: user._id.toString(),
        id: user._id.toString(),
        profilePicURL: user.profilePicURL,
    }
})

console.log('checking userDataForFrontend')
console.log(userDataForFrontend)

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


describe.skip('sign up route', () => {
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
    test.skip('access userProfile route without logging in results in internal error', () => {
        return request.agent(app)
        .get(`/home/user_profile/${userIds[0]}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(500)
    })

    test.skip('login then access personal profile', () => {
        const agent = request.agent(app)
        return agent
        .post('/login')
        .send(loginData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
        .then(() => {

            return agent
            .get(`/home/user_profile/${userIds[0]}`)
            .expect(200)
            .then( res => {
                expect(res.body).toEqual({
                    matchingUser: {
                        _id:userIds[0],
                        id:userIds[0],
                        username: users[0].username,
                        description: users[0].description,
                        profilePicURL: users[0].profilePicURL,
                    },
                    isCurrentUserProfile: true,
                })
            })
        })
    })

    test.skip("login then access other user's profile, returning their data.", async () => {
        const agent = request.agent(app)
        const response = await agent
        .post('/login')
        .send(loginData)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        expect(response.status).toEqual(200)

        const response2 = await agent
        .get(`/home/user_profile/${userIds[1]}`)
        expect(response2.status).toEqual(200)
        expect(response2.body).toEqual({
            matchingUser: {
                _id: userIds[1],
                id: userIds[1],
                username: users[1].username,
                description: users[1].description,
                profilePicURL: users[1].profilePicURL,
            },
            isCurrentUserProfile: false,
        }
        )
    })

    test("After adding a friend, they should be in the user's friend list", async () => {
        const agent = request.agent(app)

        const loginResponse = await agent
        .post('/login')
        .send(loginData)
        expect(loginResponse.status).toEqual(200)

        const checkFriendsResponse1 = await agent
        .get(`/home/get_friends_list`)
        expect(checkFriendsResponse1.status).toEqual(200)
        expect(checkFriendsResponse1.body).toEqual({
            friends: [
                userDataForFrontend[1],
                userDataForFrontend[2],
            ]
        })

        const addFriendResponse = await agent
        .post(`/home/user_profile/${userIds[3]}`)
        expect(addFriendResponse.status).toEqual(200)
        
        const checkFriendsResponse2 = await agent
        .get(`/home/get_friends_list`)
        expect(checkFriendsResponse2.status).toEqual(200)
        expect(checkFriendsResponse2.body).toEqual({
            friends: [
                userDataForFrontend[1],
                userDataForFrontend[2],
                userDataForFrontend[3],
            ]
        })
    })

    test("Send 400 if user tries to add friend that is already on their friend list.", async () => {

        const agent = request.agent(app)

        const loginResponse = await agent
        .post('/login')
        .send(loginData)
        expect(loginResponse.status).toEqual(200)

        const addFriendResponse = await agent
        .post(`/home/user_profile/${userIds[2]}`)
        expect(addFriendResponse.status).toEqual(400)
    })

})

