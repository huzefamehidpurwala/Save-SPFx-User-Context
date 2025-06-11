import {
  ConnectionPool,
  config as SqlConfig,
  NVarChar,
  DateTime,
  Int,
} from "mssql";
import {
  SharePointContext,
  UserContextEntity,
  UserContextQueryParams,
} from "../models/types";
import { logger } from "../utils/logger";
import {
  AZURE_SQL_USER,
  AZURE_SQL_PASSWORD,
  AZURE_SQL_SERVER,
  AZURE_SQL_DATABASE,
  AZURE_SQL_PORT,
} from "../config/env";

const sqlConfig: SqlConfig = {
  user: AZURE_SQL_USER,
  password: AZURE_SQL_PASSWORD,
  server: AZURE_SQL_SERVER,
  database: AZURE_SQL_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  port: AZURE_SQL_PORT,
};

// Only allow select, filter, orderby on allowed columns
const allowedCols = [
  "productId",
  "productName",
  "portalUrl",
  "absoluteUrl",
  "tenantDisplayName",
  "aadTenantId",
  "aadUserId",
  "userEmail",
  "userDisplayName",
  "userPrincipalName",
  "installedDateTime",
  "lastUsedDateTime",
];

export class AzureSqlService {
  private pool: ConnectionPool | null = null;

  private async getPool(): Promise<ConnectionPool> {
    if (!this.pool) {
      this.pool = await new ConnectionPool(sqlConfig).connect();
    }
    return this.pool;
  }

  async ensureTableExists(): Promise<void> {
    const pool = await this.getPool();
    const createTableQuery = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserContext' and xtype='U')
      CREATE TABLE UserContext (
        productId NVARCHAR(128) NOT NULL,
        productName NVARCHAR(128),
        portalUrl NVARCHAR(512),
        absoluteUrl NVARCHAR(512),
        tenantDisplayName NVARCHAR(256),
        aadTenantId NVARCHAR(128),
        aadUserId NVARCHAR(128),
        userEmail NVARCHAR(256) NOT NULL,
        userDisplayName NVARCHAR(256),
        userPrincipalName NVARCHAR(256),
        installedDateTime DATETIME2,
        lastUsedDateTime DATETIME2,
        PRIMARY KEY (userEmail, productId)
      )`;
    try {
      await pool.request().query(createTableQuery);
      logger.info("Azure SQL table ensured.");
    } catch (error) {
      logger.error("Error ensuring Azure SQL table:", error);
      throw error;
    }
  }

  async upsertUserContext(context: SharePointContext): Promise<void> {
    const pool = await this.getPool();
    const {
      productId,
      productName,
      portalUrl,
      absoluteUrl,
      tenantDisplayName,
      aadTenantId,
      aadUserId,
      userEmail,
      userDisplayName,
      userPrincipalName,
    } = context;
    try {
      // Check for existing entry
      const checkQuery = `SELECT * FROM UserContext WHERE userEmail = @userEmail AND productId = @productId`;
      const checkResult = await pool
        .request()
        .input("userEmail", NVarChar(256), userEmail)
        .input("productId", NVarChar(128), productId || productName)
        .query(checkQuery);
      const now = new Date();
      let installedDateTime = now;
      let lastUsedDateTime = now;
      if (checkResult.recordset.length > 0) {
        const recordset = checkResult.recordset[0];

        installedDateTime = recordset.installedDateTime || now;
        lastUsedDateTime = now;

        // Update
        const updateQuery = `UPDATE UserContext SET
          productName = @productName,
          portalUrl = @portalUrl,
          absoluteUrl = @absoluteUrl,
          tenantDisplayName = @tenantDisplayName,
          aadUserId = @aadUserId,
          aadTenantId = @aadTenantId,
          userDisplayName = @userDisplayName,
          userPrincipalName = @userPrincipalName,
          lastUsedDateTime = @lastUsedDateTime
          WHERE userEmail = @userEmail AND productId = @productId`;
        await pool
          .request()
          .input("productId", NVarChar(128), productId || productName)
          .input("productName", NVarChar(128), productName || "")
          .input("portalUrl", NVarChar(512), portalUrl || "")
          .input("absoluteUrl", NVarChar(512), absoluteUrl || "")
          .input("tenantDisplayName", NVarChar(256), tenantDisplayName || "")
          .input("aadUserId", NVarChar(128), aadUserId || "")
          .input("userDisplayName", NVarChar(256), userDisplayName || "")
          .input("userPrincipalName", NVarChar(256), userPrincipalName || "")
          .input("lastUsedDateTime", DateTime, lastUsedDateTime || "")
          .input("userEmail", NVarChar(256), userEmail)
          .input("aadTenantId", NVarChar(128), aadTenantId || "")
          .query(updateQuery);
        logger.info(`Azure SQL: Updated user context for ${userEmail}`);
      } else {
        // Insert
        const insertQuery = `INSERT INTO UserContext (
          productId, productName, portalUrl, absoluteUrl, tenantDisplayName, aadTenantId, aadUserId, userEmail, userDisplayName, userPrincipalName, installedDateTime, lastUsedDateTime
        ) VALUES (
          @productId, @productName, @portalUrl, @absoluteUrl, @tenantDisplayName, @aadTenantId, @aadUserId, @userEmail, @userDisplayName, @userPrincipalName, @installedDateTime, @lastUsedDateTime
        )`;
        await pool
          .request()
          .input("productId", NVarChar(128), productId || productName)
          .input("productName", NVarChar(128), productName || "")
          .input("portalUrl", NVarChar(512), portalUrl || "")
          .input("absoluteUrl", NVarChar(512), absoluteUrl || "")
          .input("tenantDisplayName", NVarChar(256), tenantDisplayName || "")
          .input("aadTenantId", NVarChar(128), aadTenantId || "")
          .input("aadUserId", NVarChar(128), aadUserId || "")
          .input("userEmail", NVarChar(256), userEmail)
          .input("userDisplayName", NVarChar(256), userDisplayName || "")
          .input("userPrincipalName", NVarChar(256), userPrincipalName || "")
          .input("installedDateTime", DateTime, installedDateTime || "")
          .input("lastUsedDateTime", DateTime, lastUsedDateTime || "")
          .query(insertQuery);
        logger.info(`Azure SQL: Inserted user context for ${userEmail}`);
      }
    } catch (error) {
      logger.error("Error upserting user context in Azure SQL:", error);
      throw error;
    }
  }

  async getAllUserContexts(
    queryParams?: UserContextQueryParams
  ): Promise<UserContextEntity[]> {
    const pool = await this.getPool();
    try {
      // Build dynamic SQL query
      let select = "*";
      if (queryParams?.select) {
        const cols = queryParams.select
          .split(",")
          .map((s) => s.trim())
          .filter((c) => allowedCols.includes(c));
        if (cols.length > 0) select = cols.join(", ");
      }
      let sql = `SELECT ${select} FROM UserContext`;
      const where: string[] = [];
      // Search (simple LIKE on userEmail, userDisplayName, userPrincipalName)
      if (queryParams?.search) {
        const s = queryParams.search.replace(/'/g, "''");
        where.push(
          `(userEmail LIKE '%${s}%' OR userDisplayName LIKE '%${s}%' OR userPrincipalName LIKE '%${s}%')`
        );
      }
      // Filter (raw SQL, but only allow safe columns)
      if (queryParams?.filter) {
        // Very basic filter parser: e.g. "aadTenantId = 'abc' AND "
        // Only allow if all columns in filter are allowed
        const filterSafe = queryParams.filter
          .split(/\s+(AND|OR)\s+/i)
          .every((part) => {
            const match = part.match(/([a-zA-Z0-9_]+)/);
            return !match || allowedCols.includes(match[1]);
          });
        if (filterSafe) {
          where.push(queryParams.filter);
        }
      }
      if (where.length > 0) {
        sql += " WHERE " + where.join(" AND ");
      }
      // Order By
      let hasOrderBy = false;
      if (queryParams?.orderBy) {
        // Support direction (asc/desc)
        const order = queryParams.orderBy
          .split(",")
          .map((s) => s.trim())
          .map((part) => {
            const match = part.match(/^(\w+)(\s+(asc|desc))?$/i);
            if (!match) return null;
            const col = match[1];
            const dir = match[3] ? match[3].toUpperCase() : "ASC";
            if (allowedCols.includes(col)) {
              return `[${col}] ${dir}`;
            }
            return null;
          })
          .filter((v): v is string => Boolean(v));
        if (order.length > 0) {
          sql += " ORDER BY " + order.join(", ");
          hasOrderBy = true;
        }
      }
      // Top
      if (
        queryParams?.top &&
        Number.isInteger(queryParams.top) &&
        queryParams.top > 0
      ) {
        if (!hasOrderBy) {
          sql += " ORDER BY (SELECT NULL)";
        }
        sql += ` OFFSET 0 ROWS FETCH NEXT ${queryParams.top} ROWS ONLY`;
      }

      const result = await pool.request().query(sql);
      return result.recordset as UserContextEntity[];
    } catch (error) {
      logger.error("Error retrieving all user contexts from Azure SQL:", error);
      throw error;
    }
  }
}
