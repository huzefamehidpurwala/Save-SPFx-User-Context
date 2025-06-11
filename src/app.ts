import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import routes from "./routes";
import { PORT } from "./config/env";
import { errorHandler } from "./middlewares/error";
import { logger } from "./utils/logger";
import { requestLogger } from "./middlewares/requestLogger";
import { initializeApp } from "./config/init";

const app = express();
const port = PORT;

// Initialize the application
initializeApp().catch((error) => {
  logger.error("Failed to initialize application:", error);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use("/api", routes);

// Error handling middleware must be the last middleware to catch all errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
