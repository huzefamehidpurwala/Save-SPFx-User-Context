import dotenv from "dotenv";
// import path from "path";
// dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config();

export const AZURE_TABLE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING || "";
export const AZURE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME || "";
export const AZURE_ACCESS_KEY = process.env.AZURE_STORAGE_ACCESS_KEY || "";
export const AZURE_TABLE_NAME = process.env.AZURE_STORAGE_TABLE_NAME || "";

export const AZURE_SQL_USER = process.env.AZURE_SQL_USER || "";
export const AZURE_SQL_PASSWORD = process.env.AZURE_SQL_PASSWORD || "";
export const AZURE_SQL_SERVER = process.env.AZURE_SQL_SERVER || "";
export const AZURE_SQL_DATABASE = process.env.AZURE_SQL_DATABASE || "";
export const AZURE_SQL_TABLENAME = process.env.AZURE_SQL_TABLENAME || "";
export const AZURE_SQL_PORT = process.env.AZURE_SQL_PORT
  ? parseInt(process.env.AZURE_SQL_PORT)
  : 1433;

export const JWT_SECRET = process.env.JWT_SECRET || "";
export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
export const NODE_ENV = process.env.NODE_ENV || "development"; // Default to local if NODE_ENV is not set
export const LOG_LEVEL = process.env.LOG_LEVEL || "info";
export const LOG_FILE_PATH = process.env.LOG_FILE_PATH || "logs/app.log";

export const isLocalEnv = NODE_ENV === "local" || NODE_ENV === "development";
