import { StatusCodes } from "http-status-codes";

export class ForbiddenError extends Error {
  public readonly name: string;
  public readonly httpCode: StatusCodes;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    name: string = "AccessForbidden",
    httpCode: StatusCodes = StatusCodes.FORBIDDEN,
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
