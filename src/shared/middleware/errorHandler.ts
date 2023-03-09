import { Request, Response, NextFunction } from "express";
import { BaseError } from "../errors/baseError";

export const errorHandler = (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.httpCode || 500;
  const message = err.message || "Internal server error";
  const isOperational = err.isOperational || false;
  const name = err.name || "Server Error";

  res.status(statusCode).json({
    status: "error",
    name,
    statusCode,
    message,
    isOperational,
  });
};
