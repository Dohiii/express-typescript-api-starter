import request from "supertest";
import app from "./app";
import mongoose from "mongoose";
import { connect } from "./db";
require("dotenv").config();

/* Connecting to the database before each test. */
beforeEach(async () => {
  await connect();
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe("Database connection", () => {
  it("should connect to MongoDB", async () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});

describe("it the default main app root", () => {
  test("It should response the GET method", async () => {
    try {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
      expect(res.text).toBe(
        "e-commers api, learn typescript and jest, bro!"
      );
    } catch (e) {
      console.log(e);
    }
  });
});

// Test middleware
