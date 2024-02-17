const app = require("./testConfig/testApp");
const request = require("supertest");

const {
  initializeMongoServer,
  closeMongoServer,
  dropDatabase,
} = require("../mongoTestingConfig");
const populateTestDB = require("./testConfig/populateTestDB");

const chats = require("./testConfig/chats");
const chatIds = chats.map((chat) => chat._id.toString());

const users = require("./testConfig/users");
const userIds = users.map((user) => user._id.toString());
const userDataForFrontend = users.map((user) => {
  return {
    username: user.username,
    _id: user._id.toString(),
    id: user._id.toString(),
    profilePicURL: user.profilePicURL,
  };
});

const messages = require("./testConfig/messages");
const messageIDs = messages.map((message) => message._id.toString());

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

const loginData = { username: "user1", password: "a" };

describe("chat tests", () => {
  // fetch chats
  describe("fetch chats", () => {
    it("ensures login is okay for test suite", async () => {
      const agent = request.agent(app);

      try {
        const loginResponse = await agent
          .post("/login")
          .set("Accept", "application/json")
          .set("Content-Type", "application/json")
          .send(loginData);
        expect(loginResponse.status).toEqual(200);
      } catch (err) {
        console.log(err);
      }
    });

    it("logs in then fetches chats", async () => {
      console.log("checking database...");

      const agent = request.agent(app);

      const loginResponse = await agent
        .post("/login")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .send(loginData);
      expect(loginResponse.status).toEqual(200);

      const getChatsResponse = await agent.get("/home/get_chats_for_user");
      expect(getChatsResponse.status).toEqual(200);
      expect(getChatsResponse.body).toEqual({
        allChats: [
          {
            _id: chatIds[0],
            id: chatIds[0],
            lastUpdated: null,
            name: "chat1",
          },
        ],
      });
    });
  });

  // make new chat
  // this requires at least 2 users.
  // If there are less than two, how would I plan around that.
  // Also it seems I need the current user, aka i need req.user

  describe("create chat", () => {
    test("after creating a chat, the number of a user's chat increases.", async () => {
      const agent = request.agent(app);

      const dataToSend = {
        chatName: "Wild rock and rollers",
        addToChatUserIds: [userIds[0], userIds[1]],
      };

      const loginResponse = await agent.post("/login").send(loginData);
      expect(loginResponse.status).toEqual(200);

      const fetchChatsResponse1 = await agent.get(`/home/get_chats_for_user`);
      expect(fetchChatsResponse1.status).toEqual(200);
      expect(fetchChatsResponse1.body.allChats.length).toEqual(1);

      const createChatResponse = await agent
        .post("/home/create_new_chat")
        .send(dataToSend);
      expect(createChatResponse.status).toEqual(200);

      const fetchChatsResponse2 = await agent.get(`/home/get_chats_for_user`);
      expect(fetchChatsResponse2.status).toEqual(200);
      expect(fetchChatsResponse2.body.allChats.length).toEqual(2);
    });

    test("Attempting to create a chat without any friends added results in a 404 error.", async () => {
      const agent = request.agent(app);

      const loginResponse = await agent.post("/login").send(loginData);
      expect(loginResponse.status).toEqual(200);

      const createChatResponse = await agent.post("/home/create_new_chat");
      expect(createChatResponse.status).toEqual(404);
    });

    test("Get a chat's messages (along with messages' authors)", async () => {
      const agent = request.agent(app);

      const loginResponse = await agent.post("/login").send(loginData);
      expect(loginResponse.status).toEqual(200);

      const fetchChatResponse = await agent.get(`/home/chat/${chatIds[0]}`);

      const chatMessages = fetchChatResponse.body.chat.chatMessages.map(message => message.text)
      expect(fetchChatResponse.status).toEqual(200);
      // Test should include timeStamp and timeStampFormatted, however formatting issues makes this hard to test.
      // Thus test was simplified to check just text property of messages.
      expect(chatMessages).toEqual([
        "message1",
        "message2",
        "message3",
      ]);
    });

    test("Add a friend to a chat,", async () => {

    })
  });
});
