/**
 * Configuration service for accessing environment variables
 * Implements coding standards requirement to not access process.env directly
 */
export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    model: process.env.OPENAI_MODEL || 'gpt-4',
    timeout: parseInt(process.env.OPENAI_TIMEOUT || '30000', 10),
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-ai-app-builder',
  },
} as const;