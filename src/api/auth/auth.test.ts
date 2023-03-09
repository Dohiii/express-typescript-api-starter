import mongoose from "mongoose";
import request from "supertest";
import { User } from "../users/users.models";
import app from "../../app";
require("dotenv").config();

/* Connecting to the database before each test. */
beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/test");
  await mongoose.connection.dropDatabase();
});

/* Closing database connection after each test. */
afterAll(async () => {
  await mongoose.connection.close();
});

describe("User registration", () => {
  it("should register a new user admin one", async () => {
    const adminUserData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };

    await request(app)
      .post("/api/v1/auth/register")
      .send(adminUserData)
      .expect(201)
      .then(async (response) => {
        expect(response.body.user.userId).toBeTruthy();
        expect(response.body.user.name).toBe(adminUserData.name);
        expect(response.body.user.role).toBe("admin");
      });
  });

  it("second user suppose to be user not admin", async () => {
    const newUser = {
      name: "John Doe",
      email: "janess@example.com", // using existing email
      password: "password123",
    };

    await request(app)
      .post("/api/v1/auth/register")
      .send(newUser)
      .expect(201)
      .then(async (response) => {
        expect(response.body.user.userId).toBeTruthy();
        expect(response.body.user.name).toBe(newUser.name);
        expect(response.body.user.role).toBe("user");
      });
  });

  it("Raise an error on try to create new.user user with the same email!", async () => {
    const newUser = {
      name: "John Doe",
      email: "jane@example.com", // using existing email
      password: "password123",
    };

    const anotherUser = {
      name: "John Doe",
      email: "jane@example.com", // using existing email
      password: "password123",
    };

    await request(app).post("/api/v1/auth/register").send(newUser);

    await request(app)
      .post("/api/v1/auth/register")
      .send(anotherUser)
      .expect(400)
      .then(async (response) => {
        expect(response.body.message).toBe("Email already taken");
      });
  });

  it("Test cookies are in Register user", async () => {
    const allNewUser = {
      name: "Bob With Cookies",
      email: "cookies@example.com", // using existing email
      password: "password123c",
    };

    await request(app)
      .post("/api/v1/auth/register")
      .set("Cookie", [
        `session=${
          process.env.JWT_SECRET ||
          "JFhjd23sfasASF@$!@fdsafa@#!123dsaSAFF2"
        }`,
      ])
      .send(allNewUser)
      .expect(201)
      .then(async (response) => {
        expect(response.headers["set-cookie"]).toBeTruthy();
      });
  });
});
