const app = require("./testConfig/testApp");
const request = require("supertest");

const {initializeMongoServer, closeMongoServer, dropDatabase} = require("../mongoTestingConfig");
const populateTestDB = require("./testConfig/populateTestDB");

const messages = require("./testConfig/messages");
const chats = require("./testConfig/chats");

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

describe("message tests", () => {
  describe("get messages", () => {
    it("gets all messages for a chat", async () => {})
  })

  describe("update message", () => {
    it("updates message after successful edit", async () => {
    })

    it("does not update message after unsuccessful edit", async () => {
    })

  })

  describe("create message", () => {
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

  describe("delete message", () => {
    it("successfully deletes message", async () => {

    })

  })
})