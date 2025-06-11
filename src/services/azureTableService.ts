import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";
import { SharePointContext, UserContextEntity } from "../models/types";
import { logger } from "../utils/logger";
import {
  AZURE_TABLE_CONNECTION_STRING,
  AZURE_TABLE_NAME,
  AZURE_ACCOUNT_NAME,
  AZURE_ACCESS_KEY,
  isLocalEnv,
} from "../config/env";

export class AzureTableService {
  private client: TableClient;

  constructor() {
    if (AZURE_TABLE_CONNECTION_STRING) {
      this.client = TableClient.fromConnectionString(
        AZURE_TABLE_CONNECTION_STRING,
        AZURE_TABLE_NAME
      );
    } else {
      const url = isLocalEnv
        ? `http://127.0.0.1:10002/${AZURE_ACCOUNT_NAME}`
        : `https://${AZURE_ACCOUNT_NAME}.table.core.windows.net`;

      this.client = new TableClient(
        url,
        AZURE_TABLE_NAME,
        new AzureNamedKeyCredential(AZURE_ACCOUNT_NAME, AZURE_ACCESS_KEY),
        { allowInsecureConnection: true }
      );
    }
  }

  async upsertUserContext(context: SharePointContext): Promise<void> {
    const partitionKey = context.aadTenantId;
    const rowKey = context.userEmail?.toLowerCase();
    let entity: UserContextEntity | undefined;
    try {
      entity = await this.client.getEntity<UserContextEntity>(
        partitionKey!,
        rowKey!
      );
    } catch (err: any) {
      if (err.statusCode !== 404) {
        logger.error("Error fetching entity from Azure Table", err);
        throw err;
      }
    }
    const now = new Date();
    let installedDateTime = entity?.installedDateTime
      ? new Date(entity.installedDateTime)
      : now;
    let lastUsedDateTime = now;
    let placesInstalledCount = entity?.placesInstalledCount ?? 0;
    const upsertEntity: UserContextEntity = {
      partitionKey: partitionKey!,
      rowKey: rowKey!,
      productName: context.productName,
      portalUrl: context.portalUrl,
      tenantDisplayName: context.tenantDisplayName,
      aadTenantId: context.aadTenantId,
      aadUserId: context.aadUserId,
      userEmail: context.userEmail,
      userDisplayName: context.userDisplayName,
      userPrincipalName: context.userPrincipalName,
      installedDateTime,
      lastUsedDateTime,
      placesInstalledCount: ++placesInstalledCount,
    };
    await this.client.upsertEntity(upsertEntity, "Merge");
  }

  async getAllUserContexts(): Promise<UserContextEntity[]> {
    const entities: UserContextEntity[] = [];
    for await (const entity of this.client.listEntities<UserContextEntity>()) {
      entities.push(entity);
    }
    return entities;
  }

  async ensureTableExists(): Promise<void> {
    try {
      await this.client.createTable();
      logger.info("Azure Table Storage table created if not exist.");
    } catch (error: any) {
      // If the table already exists, ignore the error
      if (error.statusCode === 409) {
        logger.info("Azure Table Storage table already exists.");
      } else {
        logger.error("Error ensuring Azure Table Storage table:", error);
        throw error;
      }
    }
  }
}
