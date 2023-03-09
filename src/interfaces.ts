import mongoose from "mongoose";

import {
  CustomAPIError,
  UnauthorizedError,
  BadRequestError,
} from "../src/shared/errors";

export interface CustomAPIErrorInterface {
  CustomAPIError: () => CustomAPIError;
  UnauthorizedError: () => UnauthorizedError;
  BadRequestError: () => BadRequestError;
}

export const errors: CustomAPIErrorInterface = {
  CustomAPIError: () => new CustomAPIError("", ""),
  UnauthorizedError: () => new UnauthorizedError(""),
  BadRequestError: () => new BadRequestError(""),
};

export interface UserInterface extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

export interface CustomError {
  name?: string;
  message: string;
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, any>;
  errors?: Record<string, any>;
  value?: string;
}

export interface TokenUserIntrface {
  name: string;
  userId: string;
  role: string;
}
