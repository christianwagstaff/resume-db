const express = require("express");
const supertest = require("supertest");
const app = express();

// Set up Route
const usersRoute = require("../routes/users");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

require("dotenv").config();

// Set up global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", usersRoute);

const request = supertest(app);

describe("User Registration and Login", () => {
  beforeEach(async () => {
    let mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {});
  });
  afterEach(async () => {
    await mongoose.disconnect();
  });
  it("return a 401 status if the registration password is not sent", async () => {
    const response = await request.post("/register");
    expect(response.status).toBe(401);
  });
  it("return a 401 status if the registration password is wrong", async () => {
    const response = await request.post("/register").send({
      register_password: "wrong_pswd",
    });
    expect(response.status).toBe(401);
  });
  it("Allows users to sign up with correct info", async () => {
    const response = await request.post("/register").send({
      register_password: process.env.REGISTER_PASSWORD,
      username: "test@email.com",
      password: "123",
    });
    expect(response.status).toBe(200);
  });
  it("Encrypts The Users Password", async () => {
    const response = await request.post("/register").send({
      register_password: process.env.REGISTER_PASSWORD,
      username: "test@email.com",
      password: "123",
    });
    expect(response.body.user.password).not.toBe("123");
  });
  it("Doesn't allow the same email twice", async () => {
    const response = await request.post("/register").send({
      register_password: process.env.REGISTER_PASSWORD,
      username: "test@email.com",
      password: "123",
    });
    const secondResponse = await request.post("/register").send({
      register_password: process.env.REGISTER_PASSWORD,
      username: "test@email.com",
      password: "123",
    });
    expect(secondResponse.status).toBe(401);
  });
  it("allows users to log in with their correct info", async () => {
    const register = await request.post("/register").send({
      register_password: process.env.REGISTER_PASSWORD,
      username: "test@email.com",
      password: "123",
    });
    const correct = await request.post("/login").send({
      username: "test@email.com",
      password: "123",
    });
    const incorrectPassword = await request.post("/login").send({
      username: "test@email.com",
      password: "456",
    });
    const incorrectUsername = await request.post("/login").send({
      username: "testuser@email.com",
      password: "123",
    });
    expect(correct.body).toMatchObject({ success: true });
    expect(incorrectPassword.body).toMatchObject({ success: false });
    expect(incorrectPassword.status).toBe(401);
    expect(incorrectUsername.body).toMatchObject({ success: false });
    expect(incorrectUsername.status).toBe(401);
  });
});
