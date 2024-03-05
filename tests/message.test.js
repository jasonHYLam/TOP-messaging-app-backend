const app = require("./testConfig/testApp");
const request = require("supertest");

const {initializeMongoServer, closeMongoServer, dropDatabase} = require("../mongoTestingConfig");
const populateTestDB = require("./testConfig/populateTestDB");

const messages = require("./testConfig/messages");
const messageIds = messages.map((message) => message._id.toString());
const chats = require("./testConfig/chats");
const chatIds = chats.map((chat) => chat._id.toString());

const fakeid = '65c0f5dcf0e1ac63c1209390';
let agent;

beforeAll(async () => {
  await initializeMongoServer();
});

afterAll(async () => {
  await closeMongoServer();
});

beforeEach(async () => {
  await populateTestDB();

  agent = request.agent(app);
  const loginResponse = await agent
  .post("/login")
  .send(loginData)

});

afterEach(async () => {
  await dropDatabase();
  // agent = null;
});

const loginData = { username: "user1", password: "a" };

describe("message tests", () => {
  describe("get messages", () => {
    it("gets all messages for a chat", async () => {

    const agent = request.agent(app);
    const loginResponse = await agent
    .post("/login")
    .send(loginData)

      const getMessagesResponse = await agent
      .get(`/home/chat/${chatIds[0]}`)
      expect(getMessagesResponse.status).toEqual(200);

      const returnedBody = getMessagesResponse.body
      const chatMessages = returnedBody.chat.chatMessages.map(message => message.text)
      expect(chatMessages).toEqual([
        messages[0].text,
        messages[1].text,
        messages[2].text,
      ])
    })

  })

  describe("update message", () => {
    it("updates message after successful edit", async () => {


      const messageText = {text: "Oh my TVC15..."}

      const editMessageResponse = await agent
      .put(`/home/chat/${chatIds[0]}/${messageIds[0]}`)
      .send(messageText)
      expect(editMessageResponse.status).toEqual(200)

      const getMessagesResponse = await agent
      .get(`/home/chat/${chatIds[0]}`)
      expect(getMessagesResponse.status).toEqual(200);

      const returnedBody = getMessagesResponse.body
      const chatMessages = returnedBody.chat.chatMessages.map(message => message.text)
      expect(chatMessages).toContain(messages[1].text)
      expect(chatMessages).toContain(messages[2].text)
      expect(chatMessages).toContain("Oh my TVC15...")
      expect(chatMessages).not.toContain(messages[0].text)
    })

    it("does not update message if message does not exist", async () => {
      const messageText = {text: "Oh my TVC15..."}
      const editMessageResponse = await agent
      .put(`/home/chat/${chatIds[0]}/${fakeid}`)
      .send(messageText)
      expect(editMessageResponse.status).toEqual(400)
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