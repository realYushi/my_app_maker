import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Configuration service for accessing environment variables
 * Implements coding standards requirement to not access process.env directly
 */
export const config = {
  port: process.env['PORT'] || 3001,
  nodeEnv: process.env['NODE_ENV'] || 'development',
  cors: {
    origin:
      process.env['NODE_ENV'] === 'production'
        ? process.env['FRONTEND_URL']
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200,
  },
  gemini: {
    apiKey: process.env['GEMINI_API_KEY'],
    baseUrl: process.env['GEMINI_BASE_URL'] || 'https://generativelanguage.googleapis.com/v1beta',
    model: process.env['GEMINI_MODEL'] || 'gemini-2.5-flash-lite',
    timeout: parseInt(process.env['GEMINI_TIMEOUT'] || '30000', 10),
  },
} as const;
