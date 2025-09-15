import request from 'supertest';
import app from '../index';
import { GenerationResult } from '@mini-ai-app-builder/shared-types';
import { aiService, AIServiceError } from '../services/ai.service';

// Mock the AI service
jest.mock('../services/ai.service', () => ({
  aiService: {
    extractRequirements: jest.fn()
  },
  AIServiceError: jest.fn().mockImplementation((message, statusCode) => {
    const error = new Error(message);
    error.name = 'AIServiceError';
    (error as any).statusCode = statusCode;
    return error;
  })
}));

// Mock the database service to prevent actual connections during tests
jest.mock('../services/database.service', () => ({
  databaseService: {
    connect: jest.fn().mockResolvedValue(undefined),
    isConnectionReady: jest.fn().mockReturnValue(false)
  }
}));

const mockAIService = aiService as jest.Mocked<typeof aiService>;

describe('POST /api/generate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockGenerationResult: GenerationResult = {
    appName: 'Test App',
    entities: [
      { name: 'User', attributes: ['id', 'name', 'email'] }
    ],
    userRoles: [
      { name: 'Admin', description: 'System administrator' }
    ],
    features: [
      { name: 'User Management', description: 'Manage users' }
    ]
  };

  describe('Success scenarios', () => {
    it('should process text input and return GenerationResult', async () => {
      mockAIService.extractRequirements.mockResolvedValueOnce(mockGenerationResult);

      const response = await request(app)
        .post('/api/generate')
        .send({ text: 'I want to build a user management system' })
        .expect(200);

      expect(response.body).toEqual(mockGenerationResult);
      expect(mockAIService.extractRequirements).toHaveBeenCalledWith('I want to build a user management system');
    });

    it('should handle text with leading/trailing whitespace', async () => {
      mockAIService.extractRequirements.mockResolvedValueOnce(mockGenerationResult);

      const response = await request(app)
        .post('/api/generate')
        .send({ text: '  Build a task app  ' })
        .expect(200);

      expect(mockAIService.extractRequirements).toHaveBeenCalledWith('Build a task app');
    });
  });

  describe('Validation errors', () => {
    it('should return 400 for missing request body', async () => {
      const response = await request(app)
        .post('/api/generate')
        .expect(400);

      expect(response.body).toEqual({
        error: 'Bad Request',
        message: 'Request body must contain a "text" field with a string value'
      });
    });

    it('should return 400 for missing text field', async () => {
      const response = await request(app)
        .post('/api/generate')
        .send({ notText: 'some value' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Bad Request',
        message: 'Request body must contain a "text" field with a string value'
      });
    });

    it('should return 400 for non-string text field', async () => {
      const response = await request(app)
        .post('/api/generate')
        .send({ text: 123 })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Bad Request',
        message: 'Request body must contain a "text" field with a string value'
      });
    });

    it('should return 400 for empty text', async () => {
      const response = await request(app)
        .post('/api/generate')
        .send({ text: '' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Bad Request',
        message: 'Text input cannot be empty'
      });
    });

    it('should return 400 for whitespace-only text', async () => {
      const response = await request(app)
        .post('/api/generate')
        .send({ text: '   ' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Bad Request',
        message: 'Text input cannot be empty'
      });
    });

    it('should return 400 for text that is too long', async () => {
      const longText = 'a'.repeat(10001);

      const response = await request(app)
        .post('/api/generate')
        .send({ text: longText })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Bad Request',
        message: 'Text input is too long (maximum 10,000 characters)'
      });
    });
  });

  describe('AI service error handling', () => {
    it('should handle AI service validation errors (400)', async () => {
      const error = new AIServiceError('Invalid input', 400);
      mockAIService.extractRequirements.mockRejectedValueOnce(error);

      const response = await request(app)
        .post('/api/generate')
        .send({ text: 'Build an app' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Bad Request',
        message: 'Invalid input'
      });
    });

    it('should handle AI service server errors (500)', async () => {
      const error = new AIServiceError('LLM API failed', 500);
      mockAIService.extractRequirements.mockRejectedValueOnce(error);

      const response = await request(app)
        .post('/api/generate')
        .send({ text: 'Build an app' })
        .expect(500);

      expect(response.body).toEqual({
        error: 'Internal Server Error',
        message: 'Failed to process request'
      });
    });

    it('should handle AI service timeout errors (504)', async () => {
      const error = new AIServiceError('Request timeout', 504);
      mockAIService.extractRequirements.mockRejectedValueOnce(error);

      const response = await request(app)
        .post('/api/generate')
        .send({ text: 'Build an app' })
        .expect(504);

      expect(response.body).toEqual({
        error: 'Internal Server Error',
        message: 'Failed to process request'
      });
    });

    it('should handle unexpected errors', async () => {
      mockAIService.extractRequirements.mockRejectedValueOnce(new Error('Unexpected error'));

      const response = await request(app)
        .post('/api/generate')
        .send({ text: 'Build an app' })
        .expect(500);

      expect(response.body).toEqual({
        error: 'Internal Server Error',
        message: 'Failed to process request'
      });
    }, 10000);
  });

  describe('Response structure validation', () => {
    it('should return valid GenerationResult structure', async () => {
      mockAIService.extractRequirements.mockResolvedValueOnce(mockGenerationResult);

      const response = await request(app)
        .post('/api/generate')
        .send({ text: 'Build a user system' })
        .expect(200);

      const result: GenerationResult = response.body;

      // Verify structure
      expect(result).toHaveProperty('appName');
      expect(typeof result.appName).toBe('string');

      expect(result).toHaveProperty('entities');
      expect(Array.isArray(result.entities)).toBe(true);

      expect(result).toHaveProperty('userRoles');
      expect(Array.isArray(result.userRoles)).toBe(true);

      expect(result).toHaveProperty('features');
      expect(Array.isArray(result.features)).toBe(true);

      // Verify entity structure
      if (result.entities.length > 0) {
        expect(result.entities[0]).toHaveProperty('name');
        expect(result.entities[0]).toHaveProperty('attributes');
        expect(Array.isArray(result.entities[0].attributes)).toBe(true);
      }

      // Verify userRole structure
      if (result.userRoles.length > 0) {
        expect(result.userRoles[0]).toHaveProperty('name');
        expect(result.userRoles[0]).toHaveProperty('description');
      }

      // Verify feature structure
      if (result.features.length > 0) {
        expect(result.features[0]).toHaveProperty('name');
        expect(result.features[0]).toHaveProperty('description');
      }
    });
  });
});