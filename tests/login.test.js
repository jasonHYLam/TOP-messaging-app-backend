const app = require("./testConfig/testApp");
const request = require("supertest");
const {
  initializeMongoServer,
  closeMongoServer,
  dropDatabase,
} = require("../mongoTestingConfig");
const populateTestDB = require("./testConfig/populateTestDB");

const User = require("../models/user");

const users = require("./testConfig/users");
const validLoginData = { username: "user1", password: "a" };

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

describe("login tests", () => {
  describe("login route", () => {
    test("successful login with valid credentials", async () => {

      const response = await request(app)
        .post("/login")
        .send(validLoginData);

      expect(response.status).toEqual(200);
    });

    test("unsuccessful login with invalid username", async () => {
      const data = { username: "user9", password: "a" };

      const response = await request(app)
        .post("/login")
        .send(data);
      expect(response.status).toEqual(401);
    });

    test("unsuccessful login with invalid password", async () => {
      const data = { username: "user1", password: "b" };
      const response = await request(app)
        .post("/login")
        .send(data);
      expect(response.status).toEqual(401);
    });
  });

  describe("sign up route", () => {
    it("signs up successfully", async () => {
      const response = await request(app)
        .post("/signup")
        .type("form")
        .send({ username: "doris", password: "DeafAids" });
      expect(response.status).toEqual(200);
    });
  });

  describe("logout route", () => {
    it("logs out successfully", async () => {
      const agent = request.agent(app);
      const loginResponse = await agent
      .post("/login")
      .send(validLoginData)
      expect(loginResponse.status).toEqual(200)

      const logoutResponse = await agent
      .delete("/logout")
      expect(logoutResponse.status).toEqual(200)
    })
  })
});
