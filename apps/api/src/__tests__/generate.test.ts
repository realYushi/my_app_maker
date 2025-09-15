import request from 'supertest';
import app from '../index';
import { GenerationResult } from '@mini-ai-app-builder/shared-types';
import { aiService, AIServiceError } from '../services/ai.service';

// Mock the AI service
jest.mock('../services/ai.service', () => {
  class MockAIServiceError extends Error {
    public statusCode: number;
    public originalError?: Error;

    constructor(message: string, statusCode: number = 500, originalError?: Error) {
      super(message);
      this.name = 'AIServiceError';
      this.statusCode = statusCode;
      this.originalError = originalError;
    }
  }

  return {
    aiService: {
      extractRequirements: jest.fn()
    },
    AIServiceError: MockAIServiceError
  };
});

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
    jest.resetAllMocks();
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
        .send({ text: '  Build a comprehensive task management application with user authentication, project organization, task tracking, and team collaboration features  ' })
        .expect(200);

      expect(mockAIService.extractRequirements).toHaveBeenCalledWith('Build a comprehensive task management application with user authentication, project organization, task tracking, and team collaboration features');
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

    it('should return 400 for simple prompts with helpful guidance', async () => {
      const simplePrompts = [
        'i wanna design a pet shop',
        'make an online store',
        'create user management',
        'build admin panel'
      ];

      for (const prompt of simplePrompts) {
        const response = await request(app)
          .post('/api/generate')
          .send({ text: prompt })
          .expect(400);

        expect(response.body).toEqual({
          error: 'Insufficient Details',
          message: expect.stringContaining('Your description needs more specific details')
        });
      }
    });

    it('should accept detailed prompts', async () => {
      mockAIService.extractRequirements.mockResolvedValueOnce(mockGenerationResult);

      const response = await request(app)
        .post('/api/generate')
        .send({ text: 'Create a comprehensive pet shop management system with inventory tracking, customer appointment scheduling, pet profile management, online booking for grooming services, and integrated customer communication tools' })
        .expect(200);

      expect(response.body).toEqual(mockGenerationResult);
    });

    it('should provide context-specific error messages for restaurants', async () => {
      const response = await request(app)
        .post('/api/generate')
        .send({ text: 'help me make a restaurant app' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Insufficient Details',
        message: expect.stringContaining('restaurant features')
      });

      expect(response.body.message).toContain('menu management');
      expect(response.body.message).toContain('customers, waitstaff, kitchen staff');
      expect(response.body.message).toContain('restaurant management system');
    });

    it('should provide context-specific error messages for e-commerce', async () => {
      const response = await request(app)
        .post('/api/generate')
        .send({ text: 'make an online store' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Insufficient Details',
        message: expect.stringContaining('e-commerce features')
      });

      expect(response.body.message).toContain('product catalog');
      expect(response.body.message).toContain('customers, sellers, administrators');
      expect(response.body.message).toContain('e-commerce platform');
    });
  });

  describe('AI service error handling', () => {
    it('should handle AI service validation errors (400)', async () => {
      const error = new AIServiceError('Invalid input', 400);
      mockAIService.extractRequirements.mockRejectedValueOnce(error);

      const response = await request(app)
        .post('/api/generate')
        .send({ text: 'Create a comprehensive enterprise management system with advanced workflow automation and detailed user role permissions. The system should include integrated communication tools, extensive reporting capabilities, document management features, approval workflows, and multi-tenant architecture for large organizations with complex business requirements.' })
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
        .send({ text: 'Build a comprehensive enterprise application with advanced user management features, complex business workflows, automated task processing, integrated reporting systems, notification management, audit logging, and role-based access control for multiple departments and user roles.' })
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
        .send({ text: 'Build a comprehensive e-commerce platform with advanced inventory management features, customer relationship tools, payment processing integration, order tracking capabilities, product catalog management, customer support features, and analytics dashboard for business intelligence and reporting.' })
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
        .send({ text: 'Build a comprehensive user management system with role-based access control features, profile management capabilities, audit logging functionality, permission management tools, user onboarding workflows, password policies, and administrative oversight features for enterprise organizations.' })
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
        .send({ text: 'Build a comprehensive user management system with authentication features, role-based permissions management, user profile editing capabilities, administrative oversight tools, audit logging functionality, password policy enforcement, user onboarding workflows, and dashboard analytics for monitoring user activity and system usage.' })
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