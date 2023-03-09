import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { connect } from "../../db";
require("dotenv").config();

/* Connecting to the database before each test. */
beforeAll(async () => {
  await connect();
});

/* Closing database connection after each test. */
afterAll(async () => {
  await mongoose.connection.close();
});

// Test not Found middleware
describe("Test NotFound middleware", () => {
  it("It should response the GET method", async () => {
    try {
      const res = await request(app).get("/notExistsingRoute");
      expect(res.status).toBe(404);
      expect(res.text).toBe("Route does not exist");
    } catch (e) {
      console.log(e);
    }
  });
});
