const app = require("./testConfig/testApp");
const request = require("supertest");

const users = require("./testConfig/users");
const friendToUsers = require("./testConfig/friendToUsers");

const {
  initializeMongoServer,
  closeMongoServer,
  dropDatabase,
} = require("../mongoTestingConfig");
const populateTestDB = require("./testConfig/populateTestDB");

const loginData = { username: users[0].username, password: users[0].password };

const userIds = users.map((user) => user._id.toString());
const userDataForFrontend = users.map((user) => {
  return {
    username: user.username,
    _id: user._id.toString(),
    id: user._id.toString(),
    profilePicURL: user.profilePicURL,
  };
});

beforeAll(async () => {
  await initializeMongoServer();
  // await populateTestDB();
});

afterAll(async () => {
  await closeMongoServer();
});

beforeEach(async () => {
  await populateTestDB();
});

afterEach(async () => {
  await dropDatabase();
});

// get specific user
describe("user tests", () => {
  describe("search user", () => {
    test("searching for own user does not return user");
  });
  describe("get user profile", () => {
    test("access userProfile route without logging in results in internal error", () => {
      return request
        .agent(app)
        .get(`/home/user_profile/${userIds[0]}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .expect(500);
    });

    test("login then access personal profile", () => {
      const agent = request.agent(app);
      return agent
        .post("/login")
        .send(loginData)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .expect(200)
        .then(() => {
          return agent
            .get(`/home/user_profile/${userIds[0]}`)
            .expect(200)
            .then((res) => {
              expect(res.body).toEqual({
                matchingUser: {
                  _id: userIds[0],
                  id: userIds[0],
                  username: users[0].username,
                  description: users[0].description,
                  profilePicURL: users[0].profilePicURL,
                },
                isCurrentUserProfile: true,
              });
            });
        });
    });

    test("login then access other user's profile, returning their data.", async () => {
      const agent = request.agent(app);
      const response = await agent
        .post("/login")
        .send(loginData)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json");
      expect(response.status).toEqual(200);

      const response2 = await agent.get(`/home/user_profile/${userIds[1]}`);
      expect(response2.status).toEqual(200);
      expect(response2.body).toEqual({
        matchingUser: {
          _id: userIds[1],
          id: userIds[1],
          username: users[1].username,
          description: users[1].description,
          profilePicURL: users[1].profilePicURL,
        },
        isCurrentUserProfile: false,
      });
    });

    test("Trying to access user_profile with invalid user id results in a 404 error.", async () => {
      const agent = request.agent(app);

      const loginResponse = await agent.post("/login").send(loginData);
      expect(loginResponse.status).toEqual(200);

      const userProfileResponse = await agent.get(
        `/home/user_profile/badUserID`
      );
      expect(userProfileResponse.status).toEqual(404);
    });
  });

  describe("Friend's list", () => {
    test("After adding a friend, they should be in the user's friend list", async () => {
      const agent = request.agent(app);

      const loginResponse = await agent.post("/login").send(loginData);
      expect(loginResponse.status).toEqual(200);

      const checkFriendsResponse1 = await agent.get(`/home/get_friends_list`);
      expect(checkFriendsResponse1.status).toEqual(200);
      expect(checkFriendsResponse1.body).toEqual({
        friends: [userDataForFrontend[1], userDataForFrontend[2]],
      });

      const addFriendResponse = await agent.post(
        `/home/user_profile/${userIds[3]}`
      );
      expect(addFriendResponse.status).toEqual(200);

      const checkFriendsResponse2 = await agent.get(`/home/get_friends_list`);
      expect(checkFriendsResponse2.status).toEqual(200);
      expect(checkFriendsResponse2.body).toEqual({
        friends: [
          userDataForFrontend[1],
          userDataForFrontend[2],
          userDataForFrontend[3],
        ],
      });
    });

    it("Prevents the user from adding a friend that is already on their friend list.", async () => {
      const agent = request.agent(app);

      const loginResponse = await agent.post("/login").send(loginData);
      expect(loginResponse.status).toEqual(200);

      const addFriendResponse = await agent.post(
        `/home/user_profile/${userIds[2]}`
      );
      expect(addFriendResponse.status).toEqual(400);
    });

    it("Prevents the user from adding themselves as a friend.", async () => {
      const agent = request.agent(app);

      const loginResponse = await agent.post("/login").send(loginData);
      expect(loginResponse.status).toEqual(200);

      const addFriendResponse = await agent.post(
        `/home/user_profile/${userIds[0]}`
      );
      expect(addFriendResponse.status).toEqual(400);
    });

    it("Successfully deletes a friend.", async () => {
      const agent = request.agent(app);

      const loginResponse = await agent.post("/login").send(loginData);
      expect(loginResponse.status).toEqual(200);

      const checkFriendsResponse1 = await agent.get(`/home/get_friends_list`);
      expect(checkFriendsResponse1.status).toEqual(200);
      expect(checkFriendsResponse1.body).toEqual({
        friends: [userDataForFrontend[1], userDataForFrontend[2]],
      });

      const deleteFriendResponse = await agent.delete(
        `/home/user_profile/${userIds[2]}`
      );
      expect(deleteFriendResponse.status).toEqual(200);

      const checkFriendsResponse2 = await agent.get(`/home/get_friends_list`);
      expect(checkFriendsResponse2.status).toEqual(200);
      expect(checkFriendsResponse2.body).toEqual({
        friends: [userDataForFrontend[1]],
      });
    });

    it("prevents removing a user from the friend list if they are not a friend.", async () => {
      const agent = request.agent(app);

      const loginResponse = await agent.post("/login").send(loginData);
      expect(loginResponse.status).toEqual(200);

      const deleteFriendResponse = await agent.delete(
        `/home/user_profile/${userIds[4]}`
      );
      expect(deleteFriendResponse.status).toEqual(400);
    });

    it("sends a 400 response if the params don't match with an existing user id.", async () => {
      const agent = request.agent(app);

      const loginResponse = await agent.post("/login").send(loginData);
      expect(loginResponse.status).toEqual(200);

      const deleteFriendResponse = await agent.delete(
        `/home/user_profile/badURL`
      );
      expect(deleteFriendResponse.status).toEqual(404);
    });
  });

  describe("Change user property", () => {
    test("User changes description", async () => {
      const agent = request.agent(app);
      const newDescription = { changeToSubmit: "Hi, my name's Merlyn..." };

      const loginResponse = await agent.post("/login").send(loginData);
      expect(loginResponse.status).toEqual(200);

      const userProfileResponse1 = await agent.get(
        `/home/user_profile/${userIds[0]}`
      );
      expect(userProfileResponse1.status).toEqual(200);
      expect(userProfileResponse1.body.matchingUser.description).toEqual(
        users[0].description
      );

      const changeDescriptionResponse = await agent
        .put(`/home/personal_profile/change_description`)
        .send(newDescription);
      expect(changeDescriptionResponse.status).toEqual(200);

      const userProfileResponse2 = await agent.get(
        `/home/user_profile/${userIds[0]}`
      );
      expect(userProfileResponse2.status).toEqual(200);
      expect(userProfileResponse2.body.matchingUser.description).toEqual(
        newDescription.changeToSubmit
      );
    });

    // This test adds an image to the cloud service used (Cloudinary), so skip this test after confirming it passes.
    test.skip("User changes profilePicURL", async () => {
      const agent = request.agent(app);
      const pathToImage = "tests/testConfig/testImages/abra.jpeg";

      const loginResponse = await agent.post("/login").send(loginData);
      expect(loginResponse.status).toEqual(200);

      const changeDescriptionResponse = await agent
        .put(`/home/personal_profile/change_image`)
        .attach("profilePic", pathToImage);
      expect(changeDescriptionResponse.status).toEqual(200);

      const userProfileResponse2 = await agent.get(
        `/home/user_profile/${userIds[0]}`
      );
      expect(userProfileResponse2.status).toEqual(200);
      expect(userProfileResponse2.body.matchingUser.profilePicURL).toEqual("");
    });
  });
});
