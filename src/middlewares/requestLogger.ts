import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  // Log the incoming request
  logger.info("Incoming request", {
    method: req.method,
    path: req.path,
    // query: req.query,
    // headers: { 'user-agent': req.get('user-agent'), 'content-type': req.get('content-type'), authorization: req.get('authorization') ? '[REDACTED]' : undefined }
  });

  // Log response details after the request is completed
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("Request completed", {
      method: req.method,
      // path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
