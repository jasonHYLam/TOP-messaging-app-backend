const app = require("./testConfig/testApp");
const request = require("supertest");

const {initializeMongoServer, closeMongoServer, dropDatabase} = require("../mongoTestingConfig");
const populateTestDB = require("./testConfig/populateTestDB");

const messages = require("./testConfig/messages");
const chats = require("./testConfig/chats");
const chatIds = chats.map((chat) => chat._id.toString());

beforeAll(async () => {
  await initializeMongoServer();
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

describe("message tests", () => {
  describe("get messages", () => {
    it("gets all messages for a chat", async () => {
      const agent = request.agent(app);
      const loginResponse = await agent
      .post("/login")
      .send(loginData)
      expect(loginResponse.status).toEqual(200);

      const getMessagesResponse = await agent
      .get(`/home/chat/${chatIds}`)
      expect(getMessagesResponse.status).toEqual(200);

      const returnedBody = getMessagesResponse.body
      console.log('checking returnedBody')
      console.log(returnedBody)
      const chatMessages = returnedBody.chat.chatMessages.map(message => message.text)
      expect(chatMessages).toEqual([
        messages[0].text,
        messages[1].text,
        messages[2].text,
      ])

    })

  })

  describe.skip("update message", () => {
    it("updates message after successful edit", async () => {
    })

    it("does not update message after unsuccessful edit", async () => {
    })

  })

  describe.skip("create message", () => {
    it("creates new message without image if successful validation", async () => {
    })

    it("does not create new message without image if unsuccessful validation", async () => {
    })

    it("creates new message with image if successful validation", async () => {
    })

    it("does not create new message with image if unsuccessful validation", async () => {
    })

    it("creates new reply without image if successful validation", async () => {
    })

    it("does not create new reply without image if unsuccessful validation", async () => {
    })

    it("creates new reply with image if successful validation", async () => {
    })

    it("does not create new reply with image if unsuccessful validation", async () => {
    })

  })

  describe.skip("delete message", () => {
    it("successfully deletes message", async () => {

    })

  })
})