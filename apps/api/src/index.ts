import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import { generateRouter } from "./routes/generate";
import { config } from "./config";

const app = express();

// Middleware
app.use(express.json());
app.use(cors(config.cors));

// Routes
app.use("/api", generateRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

// Only start server if this file is run directly, not when imported for testing
if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });
}

export default app;
