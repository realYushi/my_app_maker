import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import { generateRouter } from "./routes/generate";
import { config } from "./config";
import { databaseService } from "./services/database.service";

const app = express();

// Middleware
app.use(express.json());

// CORS middleware for development
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.use("/api", generateRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

// Database initialization - DISABLED FOR TESTING
// async function initializeDatabase(): Promise<void> {
//   try {
//     await databaseService.connect();
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.warn(
//       "Failed to connect to MongoDB:",
//       error instanceof Error ? error.message : "Unknown error"
//     );
//     console.warn("Application will continue without database logging");
//   }
// }

// Only start server if this file is run directly, not when imported for testing
if (require.main === module) {
  // Skip database initialization for now
  console.log("Starting server without database connection...");
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

export default app;
