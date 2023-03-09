import { StatusCodes } from "http-status-codes";

export class CustomAPIError extends Error {
  public readonly name: string;
  public readonly httpCode: number;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    message: string,
    httpCode = StatusCodes.INTERNAL_SERVER_ERROR,
    isOperational = true,
    description = "internal server error"
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
