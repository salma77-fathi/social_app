import { NextFunction, Request, Response } from "express";

export interface IError extends Error {
  statusCode: number;
}

export class ApplicationException extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    cause?: unknown
  ) {
    super(message, { cause });
    this.name = this.constructor.name; //to change name of resource
    Error.captureStackTrace(this, this.constructor); //just for safety check
  }
}

export class BadRequestException extends ApplicationException {
  constructor(message: string, cause?: unknown) {
    super(message, 400, cause);
  }
}
export class ConflictException extends ApplicationException {
  constructor(message: string, cause?: unknown) {
    super(message, 409, cause);
  }
}
export class NotFoundException extends ApplicationException {
  constructor(message: string, cause?: unknown) {
    super(message, 404,cause);
  }
}
export const globalErrorHandling = (
  error: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(error.statusCode || 500).json({
    err_message: error.message || "something went wrong!",
    stack: process.env.MOOD === "development" ? error.stack : undefined,
    error,
  });
};
