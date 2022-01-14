const express = require("express");
const supertest = require("supertest");
const app = express();

// Set up Route
const indexRoute = require("../routes/index");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const initializeDatabase = require("./initializeDatabase");

// Set up global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", indexRoute);

const request = supertest(app);

describe("Testing Project Route", () => {
  let userList;
  beforeEach(async () => {
    let mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {});
    userList = await initializeDatabase();
  });
  afterEach(async () => {
    await mongoose.disconnect();
  });
  it("Sends projects on get route", async () => {
    const response = await request.get("/projects");
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      projects: expect.arrayContaining([
        expect.objectContaining({
          name: "Project 1",
          details: "Project 1 Details",
          img: "http://google.com",
        }),
      ]),
    });
  });
  it("Creates new project on post route", async () => {
    const response = await request.post("/projects").send({
      name: "Test Project",
      details: "Test Details",
      img: "test img",
      user: userList[0],
    });
    expect(response.body).toMatchObject({
      msg: "Project Saved",
      project: expect.objectContaining({
        name: "Test Project",
        details: "Test Details",
        img: "test img",
      }),
    });
  });
  it("rejects new project on post if data is not complete", async () => {
    const response = await request.post("/projects").send({
      user: userList[0],
      details: "Test Details",
    });
    expect(response.body).toMatchObject(
      expect.objectContaining({
        errors: expect.arrayContaining([
          {
            value: "",
            msg: "name is required",
            param: "name",
            location: "body",
          },
        ]),
      })
    );
  });
});

describe("Testing About Route", () => {
  let userList;
  beforeEach(async () => {
    let mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {});
    userList = await initializeDatabase();
  });
  afterEach(async () => {
    await mongoose.disconnect();
  });
  it("Send about details on GET", async () => {
    const response = await request.get("/about");
    expect(response.body).toMatchObject({
      about: expect.objectContaining({
        name: "Test About Name",
        headline: "Test About Headline",
        about: "Test About",
      }),
    });
  });
  it("Creates new about info on POST", async () => {
    const response = await request.post("/about").send({
      user: userList[0],
      name: "Test Name",
      headline: "Test Headline",
      about: "Test About",
    });
    expect(response.body).toMatchObject({
      msg: "About Saved",
      about: expect.objectContaining({
        name: "Test Name",
        headline: "Test Headline",
        about: "Test About",
      }),
    });
  });
});
