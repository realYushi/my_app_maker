import { AIService, AIServiceError } from '../services/ai.service';
import { GenerationResult } from '@mini-ai-app-builder/shared-types';

// Mock fetch globally
global.fetch = jest.fn();

// Mock the config to use a valid API key for testing
jest.mock('../config', () => ({
  config: {
    gemini: {
      apiKey: 'valid_test_api_key_not_mock_mode',
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
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
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
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOpenRouterResponse)
      } as Response);

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

      expect(mockFetch).toHaveBeenCalledWith(
        'https://openrouter.ai/api/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-api-key'
          }
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
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: () => Promise.resolve('Invalid API key')
      } as Response);

      await expect(aiService.extractRequirements(validUserText)).rejects.toThrow(
        new AIServiceError('OpenRouter API error: 401 Unauthorized', 401)
      );
    });

    it('should handle timeout errors', async () => {
      // Mock AbortController for timeout simulation
      const originalAbortController = global.AbortController;
      global.AbortController = jest.fn().mockImplementation(() => ({
        abort: jest.fn(),
        signal: {}
      }));

      mockFetch.mockRejectedValueOnce(
        Object.assign(new Error('Request timeout'), { name: 'AbortError' })
      );

      await expect(aiService.extractRequirements(validUserText)).rejects.toThrow(
        new AIServiceError('OpenRouter API request timeout', 504)
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidJsonResponse)
      } as Response);

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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(incompleteResponse)
      } as Response);

      await expect(aiService.extractRequirements(validUserText)).rejects.toThrow(
        new AIServiceError('Missing required field: entities', 500)
      );
    });

    it('should handle empty response from OpenRouter', async () => {
      const emptyResponse = {
        choices: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(emptyResponse)
      } as Response);

      await expect(aiService.extractRequirements(validUserText)).rejects.toThrow(
        new AIServiceError('No response from OpenRouter API', 500)
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network connection failed'));

      await expect(aiService.extractRequirements(validUserText)).rejects.toThrow(
        new AIServiceError('OpenRouter API request failed: Network connection failed', 500)
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidStructureResponse)
      } as Response);

      await expect(aiService.extractRequirements(validUserText)).rejects.toThrow(
        new AIServiceError('Invalid appName in OpenRouter response', 500)
      );
    });
  });
});