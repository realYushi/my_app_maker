import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { generateRouter } from './routes/generate';
import { config } from './config';
import { databaseService } from './services/database.service';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', generateRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

// Database initialization
async function initializeDatabase(): Promise<void> {
  try {
    await databaseService.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.warn('Failed to connect to MongoDB:', error instanceof Error ? error.message : 'Unknown error');
    console.warn('Application will continue without database logging');
  }
}

// Only start server if this file is run directly, not when imported for testing
if (require.main === module) {
  initializeDatabase().then(() => {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  });
}

export default app;