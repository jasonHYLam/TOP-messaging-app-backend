import * as matchers from "jest-extended";
expect.extend(matchers);

const {
  initializeMongoServer,
  closeMongoServer,
  dropDatabase,
} = require("../../mongoTestingConfig");
const populateTestDB = require("./populateTestDB");

beforeAll(async () => {
  await initializeMongoServer();
  // await populateTestDB();
});

beforeEach(async () => {
  await populateTestDB();
});

afterEach(async () => {
  await dropDatabase();
});

afterAll(async () => {
  await closeMongoServer();
});
