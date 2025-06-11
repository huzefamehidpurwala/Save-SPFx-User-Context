import { Request, Response } from "express";
import { SharePointContext, UserContextQueryParams } from "../models/types";
import { logger } from "../utils/logger";
import { AzureSqlService } from "../services/azureSqlService";

const sqlService = new AzureSqlService();

export class UserContextController {
  static async createOrUpdate(req: Request, res: Response): Promise<void> {
    // Respond immediately as per PRD
    res.status(200).json({}); // message: "Request accepted for processing"

    const context: SharePointContext = req.body;

    // Process asynchronously
    setImmediate(async () => {
      try {
        await sqlService.upsertUserContext({ ...context });
      } catch (error) {
        logger.error("Error processing user context:", error);
        logger.error("User context:", context);
      }
    });
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      // Parse query params for REST API
      const { select, top, filter, orderBy, search } = req.query;
      const queryParams: UserContextQueryParams = {};
      if (typeof select === "string") queryParams.select = select;
      if (typeof top === "string" && !isNaN(Number(top)))
        queryParams.top = Number(top);
      if (typeof filter === "string") queryParams.filter = filter;
      if (typeof orderBy === "string") queryParams.orderBy = orderBy;
      if (typeof search === "string") queryParams.search = search;

      const contexts = await sqlService.getAllUserContexts(
        Object.keys(queryParams).length ? queryParams : undefined
      );

      res.status(200).json(contexts);
    } catch (error) {
      logger.error("Error retrieving user contexts:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
}
