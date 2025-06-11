import winston from "winston";
import { isLocalEnv } from "../config/env";

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
});

if (isLocalEnv) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf((info) => {
          // Pretty-print objects and errors
          let msg = info.message;
          if (typeof msg === "object") {
            msg = JSON.stringify(msg, null, 2);
          }
          if (info instanceof Error || info.stack) {
            return `${info.timestamp} [${info.level}]: ${msg}\n${info.stack || ""}`;
          }
          // Print meta/objects as pretty JSON
          const { level, message, timestamp, ...rest } = info;
          let meta = Object.keys(rest).length
            ? `\n${JSON.stringify(rest, null, 2)}`
            : "";
          return `${info.timestamp} [${info.level}]: ${msg}${meta}`;
        })
      ),
    })
  );
}
