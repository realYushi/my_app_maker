import { AIService, AIServiceError } from '../services/ai.service';
import { GenerationResult } from '@mini-ai-app-builder/shared-types';
import OpenAI from 'openai';

// Mock OpenAI module
jest.mock('openai');
const MockedOpenAI = OpenAI as jest.MockedClass<typeof OpenAI>;

// Mock the config to use a valid API key for testing
jest.mock('../config', () => ({
  config: {
    gemini: {
      apiKey: 'test-api-key',
      baseUrl: process.env.GEMINI_BASE_URL || 'https://openrouter.ai/api/v1/chat/completions',
      model: process.env.GEMINI_MODEL || 'deepseek/deepseek-chat-v3.1:free',
      timeout: 30000
    }
  }
}));

// Mock error logging service
jest.mock('../services/error-logging.service', () => ({
  errorLoggingService: {
    logGenerationFailure: jest.fn().mockResolvedValue(undefined)
  }
}));

describe('AIService', () => {
  let aiService: AIService;
  let mockChatCompletions: jest.Mocked<any>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup OpenAI mock
    mockChatCompletions = {
      create: jest.fn()
    };

    MockedOpenAI.mockImplementation(() => ({
      chat: {
        completions: mockChatCompletions
      }
    } as any));

    aiService = new AIService();
  });

  describe('Mock Mode', () => {
  });

  describe('constructor', () => {
    it('should initialize with mocked config', () => {
      expect(() => new AIService()).not.toThrow();
    });
  });

  describe('extractRequirements', () => {
    const validUserText = 'I want to build a task management app for teams';
    const mockOpenRouterResponse = {
      choices: [{
        message: {
          content: JSON.stringify({
            appName: 'Team Task Manager',
            entities: [
              { name: 'Task', attributes: ['id', 'title', 'description'] }
            ],
            userRoles: [
              { name: 'Manager', description: 'Manages team tasks' }
            ],
            features: [
              { name: 'Task Creation', description: 'Create new tasks' }
            ]
          })
        }
      }]
    };

    it('should successfully extract requirements from valid input', async () => {
      mockChatCompletions.create.mockResolvedValueOnce(mockOpenRouterResponse);

      const result = await aiService.extractRequirements(validUserText);

      expect(result).toEqual({
        appName: 'Team Task Manager',
        entities: [
          { name: 'Task', attributes: ['id', 'title', 'description'] }
        ],
        userRoles: [
          { name: 'Manager', description: 'Manages team tasks' }
        ],
        features: [
          { name: 'Task Creation', description: 'Create new tasks' }
        ]
      });

      expect(mockChatCompletions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'deepseek/deepseek-chat-v3.1:free',
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'system' }),
            expect.objectContaining({
              role: 'user',
              content: validUserText.trim()
            })
          ]),
          temperature: 0.3,
          max_tokens: 2000,
        })
      );
    });

    it('should throw error for empty input', async () => {
      await expect(aiService.extractRequirements('')).rejects.toThrow(
        new AIServiceError('User text input is required', 400)
      );

      await expect(aiService.extractRequirements('   ')).rejects.toThrow(
        new AIServiceError('User text input is required', 400)
      );
    });

    it('should handle LLM API error responses', async () => {
      const apiError = new Error('Invalid API key');
      apiError.name = 'APIError';
      (apiError as any).status = 401;
      mockChatCompletions.create.mockRejectedValueOnce(apiError);

      await expect(aiService.extractRequirements(validUserText)).rejects.toThrow(
        new AIServiceError('OpenRouter API request failed: Invalid API key', 500)
      );
    });

    it('should handle timeout errors', async () => {
      // Mock AbortController for timeout simulation
      const originalAbortController = global.AbortController;
      global.AbortController = jest.fn().mockImplementation(() => ({
        abort: jest.fn(),
        signal: {}
      }));

      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'AbortError';
      mockChatCompletions.create.mockRejectedValueOnce(timeoutError);

      await expect(aiService.extractRequirements(validUserText)).rejects.toThrow(
        new AIServiceError('OpenRouter API request failed: Request timeout', 504)
      );

      global.AbortController = originalAbortController;
    });

    it('should handle invalid JSON responses', async () => {
      const invalidJsonResponse = {
        choices: [{
          message: {
            content: 'Invalid JSON response from OpenRouter'
          }
        }]
      };

      mockChatCompletions.create.mockResolvedValueOnce(invalidJsonResponse);

      await expect(aiService.extractRequirements(validUserText)).rejects.toThrow(
        new AIServiceError('Invalid JSON response from OpenRouter API', 500)
      );
    });

    it('should handle missing required fields in response', async () => {
      const incompleteResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              appName: 'Test App'
              // Missing entities, userRoles, features
            })
          }
        }]
      };

      mockChatCompletions.create.mockResolvedValueOnce(incompleteResponse);

      await expect(aiService.extractRequirements(validUserText)).rejects.toThrow(
        new AIServiceError('Missing required field: entities', 500)
      );
    });

    it('should handle empty response from OpenRouter', async () => {
      const emptyResponse = {
        choices: []
      };

      mockChatCompletions.create.mockResolvedValueOnce(emptyResponse);

      await expect(aiService.extractRequirements(validUserText)).rejects.toThrow(
        new AIServiceError('Empty response from OpenRouter API', 500)
      );
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network connection failed');
      mockChatCompletions.create.mockRejectedValueOnce(networkError);

      await expect(aiService.extractRequirements(validUserText)).rejects.toThrow(
        new AIServiceError(`OpenRouter API request failed: ${networkError.message}`, 500)
      );
    });

    it('should validate response structure thoroughly', async () => {
      const invalidStructureResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              appName: '',
              entities: [],
              userRoles: [],
              features: []
            })
          }
        }]
      };

      mockChatCompletions.create.mockResolvedValueOnce(invalidStructureResponse);

      await expect(aiService.extractRequirements(validUserText)).rejects.toThrow(
        new AIServiceError('Invalid appName in OpenRouter response', 500)
      );
    });
  });
});