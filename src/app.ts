import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
require("express-async-errors");

// Routers imports
import authRouter from "./api/auth/auth.routes";
import usersRouter from "./api/users/users.routes";

//middleaware imports
import { notFoundMiddleware } from "./shared/middleware/not-found";
// rest of the packages
import morgan from "morgan";
import { errorHandler } from "./shared/middleware/errorHandler";
import cookieParser from "cookie-parser";

const app: Application = express();
dotenv.config();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);

//middleware
app.get("/", (req: Request, res: Response) => {
  // throw new BadRequestError("Oh no it is not good")
  console.log(req.signedCookies);
  res.send("e-commers api, learn typescript and jest, bro!");
});

app.use(notFoundMiddleware);
app.use(errorHandler);
// app.use(errorHandlerMiddleware);

export default app;
