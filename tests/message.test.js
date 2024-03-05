const app = require("./testConfig/testApp");
const request = require("supertest");

const {initializeMongoServer, closeMongoServer, dropDatabase} = require("../mongoTestingConfig");
const populateTestDB = require("./testConfig/populateTestDB");

const messages = require("./testConfig/messages");

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