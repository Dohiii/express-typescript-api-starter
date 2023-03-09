import { StatusCodes } from "http-status-codes";

export class NotFoundError extends Error {
  public readonly name: string;
  public readonly httpCode: StatusCodes;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    name: string = "NotFoundError",
    httpCode: StatusCodes = StatusCodes.NOT_FOUND,
    isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
