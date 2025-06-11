import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { ErrorType } from "../models/types";

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public type: ErrorType = ErrorType.INTERNAL_ERROR
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Error occurred:", {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
      type: error instanceof HttpError ? error.type : ErrorType.INTERNAL_ERROR,
    },
    path: req.path,
    method: req.method,
    body: req.body,
  });

  if (error instanceof HttpError) {
    return /* res.status(error.statusCode).json({
            error: error.message
        }) */;
  }

  return /* res.status(500).json({
        error: 'Internal server error'
    }) */;
};
