import { ErrorLoggingService } from '../services/error-logging.service';
import { databaseService } from '../services/database.service';

// Mock the AI service to prevent API key requirement
jest.mock('../services/ai.service', () => {
  class MockAIServiceError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.name = 'AIServiceError';
      this.statusCode = statusCode;
    }
  }
  return {
    AIServiceError: MockAIServiceError
  };
});

const { AIServiceError } = jest.requireMock('../services/ai.service');

// Mock the database service
jest.mock('../services/database.service', () => ({
  databaseService: {
    isConnectionReady: jest.fn()
  }
}));

// Mock the GenerationFailure model
jest.mock('../models/GenerationFailure', () => {
  const mockFind = jest.fn().mockReturnThis();
  const mockSort = jest.fn().mockReturnThis();
  const mockLimit = jest.fn().mockReturnThis();
  const mockLean = jest.fn().mockReturnThis();
  const mockExec = jest.fn();

  return {
    GenerationFailure: {
      create: jest.fn(),
      find: mockFind,
      sort: mockSort,
      limit: mockLimit,
      lean: mockLean,
      exec: mockExec
    },
    mockFind,
    mockSort,
    mockLimit,
    mockLean,
    mockExec
  };
});

describe('ErrorLoggingService', () => {
  let errorLoggingService: ErrorLoggingService;
  const mockDatabaseService = databaseService as jest.Mocked<typeof databaseService>;

  // Get mocked functions from the mock
  const { GenerationFailure, mockFind, mockSort, mockLimit, mockLean, mockExec } = jest.requireMock('../models/GenerationFailure');

  beforeEach(() => {
    jest.clearAllMocks();
    errorLoggingService = ErrorLoggingService.getInstance();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = ErrorLoggingService.getInstance();
      const instance2 = ErrorLoggingService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('logGenerationFailure', () => {
    const mockErrorData = {
      userInput: 'Test input for logging',
      error: new Error('Test error message'),
      llmResponseRaw: { test: 'response' }
    };

    it('should log failure when database is connected', async () => {
      mockDatabaseService.isConnectionReady.mockReturnValue(true);
      GenerationFailure.create.mockResolvedValueOnce({} as any);

      await errorLoggingService.logGenerationFailure(mockErrorData);

      expect(GenerationFailure.create).toHaveBeenCalledWith({
        timestamp: expect.any(Date),
        userInput: 'Test input for logging',
        errorSource: 'unknown',
        errorMessage: 'Test error message',
        llmResponseRaw: { test: 'response' }
      });
    });

    it('should skip logging when database is not connected', async () => {
      mockDatabaseService.isConnectionReady.mockReturnValue(false);
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await errorLoggingService.logGenerationFailure(mockErrorData);

      expect(GenerationFailure.create).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Database not connected, skipping error logging');

      consoleSpy.mockRestore();
    });

    it('should truncate long user input to max length', async () => {
      mockDatabaseService.isConnectionReady.mockReturnValue(true);
      GenerationFailure.create.mockResolvedValueOnce({} as any);

      const longInput = 'a'.repeat(15000);
      await errorLoggingService.logGenerationFailure({
        ...mockErrorData,
        userInput: longInput
      });

      expect(GenerationFailure.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userInput: 'a'.repeat(10000)
        })
      );
    });

    it('should truncate long error messages to max length', async () => {
      mockDatabaseService.isConnectionReady.mockReturnValue(true);
      GenerationFailure.create.mockResolvedValueOnce({} as any);

      const longMessage = 'b'.repeat(1500);
      await errorLoggingService.logGenerationFailure({
        ...mockErrorData,
        error: new Error(longMessage)
      });

      expect(GenerationFailure.create).toHaveBeenCalledWith(
        expect.objectContaining({
          errorMessage: 'b'.repeat(1000)
        })
      );
    });

    it('should handle database creation errors gracefully', async () => {
      mockDatabaseService.isConnectionReady.mockReturnValue(true);
      GenerationFailure.create.mockRejectedValueOnce(new Error('Database error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await errorLoggingService.logGenerationFailure(mockErrorData);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to log generation failure to database:',
        expect.objectContaining({
          originalError: 'Test error message',
          dbError: 'Database error',
          userInputLength: 'Test input for logging'.length
        })
      );

      consoleSpy.mockRestore();
    });

    describe('error source determination', () => {
      it('should identify validation errors', async () => {
        mockDatabaseService.isConnectionReady.mockReturnValue(true);
        GenerationFailure.create.mockResolvedValueOnce({} as any);

        const validationError = new AIServiceError('Invalid input', 400);
        await errorLoggingService.logGenerationFailure({
          userInput: 'test',
          error: validationError
        });

        expect(GenerationFailure.create).toHaveBeenCalledWith(
          expect.objectContaining({ errorSource: 'validation' })
        );
      });

      it('should identify timeout errors', async () => {
        mockDatabaseService.isConnectionReady.mockReturnValue(true);
        GenerationFailure.create.mockResolvedValueOnce({} as any);

        const timeoutError = new AIServiceError('Request timeout', 504);
        await errorLoggingService.logGenerationFailure({
          userInput: 'test',
          error: timeoutError
        });

        expect(GenerationFailure.create).toHaveBeenCalledWith(
          expect.objectContaining({ errorSource: 'timeout' })
        );
      });

      it('should identify parsing errors', async () => {
        mockDatabaseService.isConnectionReady.mockReturnValue(true);
        GenerationFailure.create.mockResolvedValueOnce({} as any);

        const parsingError = new AIServiceError('Invalid JSON response', 500);
        await errorLoggingService.logGenerationFailure({
          userInput: 'test',
          error: parsingError
        });

        expect(GenerationFailure.create).toHaveBeenCalledWith(
          expect.objectContaining({ errorSource: 'parsing' })
        );
      });

      it('should identify Gemini API errors', async () => {
        mockDatabaseService.isConnectionReady.mockReturnValue(true);
        GenerationFailure.create.mockResolvedValueOnce({} as any);

        const apiError = new AIServiceError('LLM API failed', 500);
        await errorLoggingService.logGenerationFailure({
          userInput: 'test',
          error: apiError
        });

        expect(GenerationFailure.create).toHaveBeenCalledWith(
          expect.objectContaining({ errorSource: 'gemini_api' })
        );
      });

      it('should identify network errors', async () => {
        mockDatabaseService.isConnectionReady.mockReturnValue(true);
        GenerationFailure.create.mockResolvedValueOnce({} as any);

        const networkError = new Error('network connection failed');
        await errorLoggingService.logGenerationFailure({
          userInput: 'test',
          error: networkError
        });

        expect(GenerationFailure.create).toHaveBeenCalledWith(
          expect.objectContaining({ errorSource: 'network' })
        );
      });

      it('should identify abort errors as timeout', async () => {
        mockDatabaseService.isConnectionReady.mockReturnValue(true);
        GenerationFailure.create.mockResolvedValueOnce({} as any);

        const abortError = Object.assign(new Error('Request aborted'), { name: 'AbortError' });
        await errorLoggingService.logGenerationFailure({
          userInput: 'test',
          error: abortError
        });

        expect(GenerationFailure.create).toHaveBeenCalledWith(
          expect.objectContaining({ errorSource: 'timeout' })
        );
      });

      it('should default to unknown for unrecognized errors', async () => {
        mockDatabaseService.isConnectionReady.mockReturnValue(true);
        GenerationFailure.create.mockResolvedValueOnce({} as any);

        const unknownError = new Error('Some random error');
        await errorLoggingService.logGenerationFailure({
          userInput: 'test',
          error: unknownError
        });

        expect(GenerationFailure.create).toHaveBeenCalledWith(
          expect.objectContaining({ errorSource: 'unknown' })
        );
      });
    });
  });

  describe('getRecentFailures', () => {
    it('should return recent failures when database is connected', async () => {
      mockDatabaseService.isConnectionReady.mockReturnValue(true);
      const mockFailures = [
        { timestamp: new Date(), userInput: 'test1', errorSource: 'validation' },
        { timestamp: new Date(), userInput: 'test2', errorSource: 'timeout' }
      ];
      mockExec.mockResolvedValueOnce(mockFailures);

      const result = await errorLoggingService.getRecentFailures(50);

      expect(result).toEqual(mockFailures);
      expect(mockFind).toHaveBeenCalledWith();
      expect(mockSort).toHaveBeenCalledWith({ timestamp: -1 });
      expect(mockLimit).toHaveBeenCalledWith(50);
    });

    it('should return empty array when database is not connected', async () => {
      mockDatabaseService.isConnectionReady.mockReturnValue(false);

      const result = await errorLoggingService.getRecentFailures();

      expect(result).toEqual([]);
      expect(mockFind).not.toHaveBeenCalled();
    });

    it('should handle database query errors gracefully', async () => {
      mockDatabaseService.isConnectionReady.mockReturnValue(true);
      mockExec.mockRejectedValueOnce(new Error('Query failed'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await errorLoggingService.getRecentFailures();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to retrieve generation failures:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('getFailuresBySource', () => {
    it('should return failures filtered by source', async () => {
      mockDatabaseService.isConnectionReady.mockReturnValue(true);
      const mockFailures = [
        { timestamp: new Date(), userInput: 'test1', errorSource: 'validation' }
      ];
      mockExec.mockResolvedValueOnce(mockFailures);

      const result = await errorLoggingService.getFailuresBySource('validation', 25);

      expect(result).toEqual(mockFailures);
      expect(mockFind).toHaveBeenCalledWith({ errorSource: 'validation' });
      expect(mockLimit).toHaveBeenCalledWith(25);
    });

    it('should return empty array when database is not connected', async () => {
      mockDatabaseService.isConnectionReady.mockReturnValue(false);

      const result = await errorLoggingService.getFailuresBySource('timeout');

      expect(result).toEqual([]);
      expect(mockFind).not.toHaveBeenCalled();
    });
  });
});