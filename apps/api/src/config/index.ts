/**
 * Configuration service for accessing environment variables
 * Implements coding standards requirement to not access process.env directly
 */
export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    baseUrl: process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
    timeout: parseInt(process.env.GEMINI_TIMEOUT || '30000', 10),
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-ai-app-builder',
  },
} as const;