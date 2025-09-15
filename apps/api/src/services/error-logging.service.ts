import { GenerationFailure, IGenerationFailure } from '../models/GenerationFailure';
import { AIServiceError } from './ai.service';
import { databaseService } from './database.service';

export interface ErrorLogData {
  userInput: string;
  error: Error | AIServiceError;
  llmResponseRaw?: any;
}

export class ErrorLoggingService {
  private static instance: ErrorLoggingService;

  private constructor() {}

  static getInstance(): ErrorLoggingService {
    if (!ErrorLoggingService.instance) {
      ErrorLoggingService.instance = new ErrorLoggingService();
    }
    return ErrorLoggingService.instance;
  }

  async logGenerationFailure(data: ErrorLogData): Promise<void> {
    try {
      // Only log if database is connected
      if (!databaseService.isConnectionReady()) {
        console.warn('Database not connected, skipping error logging');
        return;
      }

      const errorSource = this.determineErrorSource(data.error);

      const failureRecord: Partial<IGenerationFailure> = {
        timestamp: new Date(),
        userInput: data.userInput.substring(0, 10000), // Ensure max length
        errorSource,
        errorMessage: data.error.message.substring(0, 1000), // Ensure max length
        llmResponseRaw: data.llmResponseRaw || null
      };

      await GenerationFailure.create(failureRecord);

    } catch (dbError) {
      // Log to console if database logging fails
      console.error('Failed to log generation failure to database:', {
        originalError: data.error.message,
        dbError: dbError instanceof Error ? dbError.message : 'Unknown database error',
        userInputLength: data.userInput.length
      });
    }
  }

  private determineErrorSource(error: Error | AIServiceError): string {
    if (error instanceof AIServiceError) {
      if (error.statusCode === 400) {
        return 'validation';
      }
      if (error.statusCode === 504) {
        return 'timeout';
      }
      if (error.message.includes('JSON')) {
        return 'parsing';
      }
      if (error.message.includes('API')) {
        return 'gemini_api';
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        return 'network';
      }
    }

    if (error.name === 'AbortError') {
      return 'timeout';
    }

    if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
      return 'network';
    }

    return 'unknown';
  }

  async getRecentFailures(limit: number = 100): Promise<IGenerationFailure[]> {
    try {
      if (!databaseService.isConnectionReady()) {
        return [];
      }

      return await GenerationFailure
        .find()
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean()
        .exec();

    } catch (error) {
      console.error('Failed to retrieve generation failures:', error);
      return [];
    }
  }

  async getFailuresBySource(errorSource: string, limit: number = 50): Promise<IGenerationFailure[]> {
    try {
      if (!databaseService.isConnectionReady()) {
        return [];
      }

      return await GenerationFailure
        .find({ errorSource })
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean()
        .exec();

    } catch (error) {
      console.error('Failed to retrieve failures by source:', error);
      return [];
    }
  }
}

export const errorLoggingService = ErrorLoggingService.getInstance();