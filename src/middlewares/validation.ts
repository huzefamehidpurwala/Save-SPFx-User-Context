import { Request, Response, NextFunction } from "express";
import { SharePointContext } from "../models/types";
import { HttpError } from "./error";
import { logger } from "../utils/logger";

export const validateUserContext = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const context: SharePointContext = req.body;
  // Only require productName, userEmail, aadTenantId
  if (!context.productName) {
    logger.warn("Missing required field: productName", { body: req.body });
    res.status(400).json({ error: "productName is required" });
    return;
  }
  if (!context.userEmail) {
    logger.warn("Missing required field: userEmail", { body: req.body });
    res.status(400).json({ error: "userEmail is required" });
    return;
  }
  if (!context.aadTenantId) {
    logger.warn("Missing required field: aadTenantId", { body: req.body });
    res.status(400).json({ error: "aadTenantId is required" });
    return;
  }
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(context.userEmail)) {
    logger.warn("Invalid userEmail format", { userEmail: context.userEmail });
    res.status(400).json({ error: "Invalid userEmail format" });
    return;
  }
  // If portalUrl is present, validate it's a proper URL
  if (context.portalUrl) {
    try {
      new URL(context.portalUrl);
    } catch (error) {
      logger.warn("Invalid portalUrl format", { portalUrl: context.portalUrl });
      res.status(400).json({ error: "Invalid portalUrl format" });
      return;
    }
  }
  next();
};
