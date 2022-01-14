const express = require("express");
const request = require("supertest");
const app = express();

// Set up testing DB

// Set up Route
const indexRoute = require("../routes/index");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const initializeDatabase = require("./initializeDatabase");

// Set up global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", indexRoute);

describe("Testing Index Route", () => {
  beforeEach(async () => {
    let mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {});
    await initializeDatabase();
  });
  afterEach(async () => {
    await mongoose.disconnect();
  });
  it("Sends projects on get route", (done) => {
    request(app)
      .get("/projects")
      .expect("Content-Type", /json/)
      .expect({
        projects: [
          {
            name: "Project 1",
            details: "Project 1 Details",
            img: "http://google.com",
          },
        ],
      })
      .expect(200, done);
  });
});
