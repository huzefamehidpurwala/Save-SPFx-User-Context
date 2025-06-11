import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { readFileSync } from "fs";
import path from "path";
import { logger } from "../utils/logger";

// Load allowed admins list
const loadAllowedAdmins = (): string[] => {
  try {
    const adminsPath = path.join(__dirname, "../../config/allowedAdmins.json");
    const admins = JSON.parse(readFileSync(adminsPath, "utf8"));
    return admins.emails || [];
  } catch (error) {
    logger.error("Error loading allowed admins:", error);
    return [];
  }
};

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const allowedAdmins = loadAllowedAdmins();
    if (!allowedAdmins.includes(payload.email.toLowerCase())) {
      logger.warn(`Unauthorized access attempt from ${payload.email}`);
      res.status(403).json({ error: "Unauthorized access" });
      return;
    }

    // req.user = payload;
    next();
  } catch (error) {
    logger.error("JWT verification failed:", error);
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};
