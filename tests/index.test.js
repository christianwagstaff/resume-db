const express = require("express");
const supertest = require("supertest");
const app = express();

// Set up Route
const indexRoute = require("../routes/index");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const initializeDatabase = require("./initializeDatabase");
const res = require("express/lib/response");
const req = require("express/lib/request");

// Set up global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", indexRoute);

const request = supertest(app);

describe("Gets All Info", () => {
  let userList, projectList, contactList, aboutList;
  beforeEach(async () => {
    let mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {});
    [userList, projectList, contactList, aboutList] =
      await initializeDatabase();
  });
  afterEach(async () => {
    await mongoose.disconnect();
  });
  it("Gets all info on index route", async () => {
    const response = await request.get("/");
    expect(response.body).toMatchObject({
      projects: expect.any(Array),
      contact: expect.any(Array),
      about: expect.any(Array),
    });
  });
});

describe("Testing Project Route", () => {
  let userList, projectList, contactList, aboutList;
  beforeEach(async () => {
    let mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {});
    [userList, projectList, contactList, aboutList] =
      await initializeDatabase();
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
  it("edits Project on PUT", async () => {
    const response = await request.put("/projects").send({
      projectId: projectList[0],
      name: "Test Edit Project",
      details: "Test Edit Details",
    });
    expect(response.body).toMatchObject({
      msg: "Project Updated",
      project: expect.objectContaining({
        name: "Test Edit Project",
        details: "Test Edit Details",
        img: "http://google.com",
      }),
    });
    expect(response.body.project._id).toEqual(projectList[0]._id.toString());
  });
  it("Deletes projects on DELETE", async () => {
    const response = await request.delete("/projects").send({
      projectId: projectList[0]._id,
    });
    expect(response.body).toMatchObject({
      msg: "Project Deleted",
      project: `${projectList[0]._id.toString()}`,
    });
  });
});

describe("Testing About Route", () => {
  let userList, projectList, contactList, aboutList;
  beforeEach(async () => {
    let mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {});
    [userList, projectList, contactList, aboutList] =
      await initializeDatabase();
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
  it("Edits Info on PUT", async () => {
    const response = await request.put("/about").send({
      aboutId: aboutList[0]._id,
      headline: "Test Edit Headline",
      name: aboutList[0].name,
      about: aboutList[0].about,
    });
    expect(response.body).toMatchObject({
      msg: "About Updated",
      about: expect.objectContaining({
        headline: "Test Edit Headline",
      }),
    });
  });
  it("Deletes about on DELETE", async () => {
    const response = await request.delete("/about").send({
      aboutId: aboutList[0]._id,
    });
    expect(response.body).toMatchObject({
      msg: "About Deleted",
      about: `${aboutList[0]._id.toString()}`,
    });
  });
});

describe("Testing Contact Route", () => {
  let userList, projectList, contactList, aboutList;
  beforeEach(async () => {
    let mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {});
    [userList, projectList, contactList, aboutList] =
      await initializeDatabase();
  });
  afterEach(async () => {
    await mongoose.disconnect();
  });
  it("Send contact details on GET", async () => {
    const response = await request.get("/contact");
    expect(response.body).toMatchObject({
      contact: expect.objectContaining({
        email: "test@email.com",
        links: [
          expect.objectContaining({ name: "LinkedIn", url: "linkedin.com" }),
        ],
      }),
    });
  });
  it("Creates new contact info on POST", async () => {
    const response = await request.post("/contact").send({
      user: userList[0],
      email: "testy@email.com",
      links: [{ name: "Test Name", url: "Test Url" }],
    });
    expect(response.body).toMatchObject(
      expect.objectContaining({
        contact: expect.objectContaining({
          email: "testy@email.com",
          links: [
            expect.objectContaining({ name: "Test Name", url: "Test Url" }),
          ],
        }),
        msg: "Contact Saved",
      })
    );
  });
  it("Edits Contact Details on PUT", async () => {
    const response = await request.put("/contact").send({
      contactId: contactList[0]._id,
      user: contactList[0].user,
      email: contactList[0].email,
      links: [...contactList[0].links, { name: "GitHub", url: "github.com" }],
    });
    expect(response.body).toMatchObject({
      msg: "Contact Updated",
      contact: expect.objectContaining({
        links: expect.arrayContaining([
          expect.objectContaining({ name: contactList[0].links[0].name }),
          expect.objectContaining({ name: "GitHub", url: "github.com" }),
        ]),
      }),
    });
  });
  it("Deletes Contact Details on DELETE", async () => {
    const response = await request.delete("/contact").send({
      contactId: contactList[0]._id,
    });
    expect(response.body).toMatchObject({
      msg: "Contact Deleted",
      contact: `${contactList[0]._id.toString()}`,
    });
  });
});
