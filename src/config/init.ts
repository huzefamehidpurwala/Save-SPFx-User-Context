import { AzureSqlService } from "../services/azureSqlService";
import { logger } from "../utils/logger";
import { delayFunc } from "../utils/helper";

export async function initializeApp() {
  try {
    const sqlService = new AzureSqlService();
    await sqlService.ensureTableExists().catch((er) => {
      logger.warn("Retrying table check in next 5 seconds.");
      // retry after 5 seconds if table check fails
      delayFunc(5000).then(() => sqlService.ensureTableExists());
    });
    logger.info("Application initialized successfully");
  } catch (error) {
    // logger.error("Failed to initialize application:", error);
    throw error;
  }
}
