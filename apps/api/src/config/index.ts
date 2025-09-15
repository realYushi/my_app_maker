/**
 * Configuration service for accessing environment variables
 * Implements coding standards requirement to not access process.env directly
 */
export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
} as const;