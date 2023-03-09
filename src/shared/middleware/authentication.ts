import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../errors";
import { Request, Response, NextFunction } from "express";
import { CustomAPIError } from "../errors";
import { isTikenValid } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new UnauthorizedError("Authentication is not valid");
  }
  try {
    const payload: string | JwtPayload = isTikenValid(token);

    // if we recieve string it will mean that our function return error
    if (typeof payload === "string") {
      throw new UnauthorizedError("Authentication is not valid");
    }
    req.user = {
      name: payload.name,
      userId: payload.userId,
      role: payload.role,
    };
    next();
  } catch (e) {
    throw new UnauthorizedError("Authentication is not valid");
  }
};

export const authorizePermissions = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw new NotFoundError("No user");
    }
    if (!roles.includes(user?.role)) {
      throw new ForbiddenError("Administrator access requered");
    }
    next();
  };
};
