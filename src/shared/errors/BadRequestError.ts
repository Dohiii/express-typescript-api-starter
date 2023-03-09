import { StatusCodes } from "http-status-codes";

export class BadRequestError extends Error {
  public readonly name: string;
  public readonly httpCode: number;
  public readonly isOperational: boolean;

  constructor(
    name = "Bad Request",
    message = "Oooop something go wrong!",
    httpCode = StatusCodes.BAD_REQUEST,
    isOperational = true,
    description = "bad request error"
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.message = message;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
