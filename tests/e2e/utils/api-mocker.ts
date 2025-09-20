import { Page, Route } from '@playwright/test';
import {
  mockApiResponses,
  createMockResponse,
  createErrorResponse,
} from '../fixtures/mock-responses';

/**
 * Utility class for mocking API responses in E2E tests
 */
export class ApiMocker {
  private routes: Route[] = [];

  constructor(private page: Page) {}

  /**
   * Set up API mocking for the generation endpoint
   */
  async setupGenerationMocks() {
    // Mock successful responses
    await this.page.route('**/api/generate', async route => {
      this.routes.push(route);

      const request = route.request();
      const requestBody = request.postDataJSON();

      // Determine response based on prompt content
      const prompt = requestBody?.prompt || '';

      console.log('API Mock intercepted prompt:', `${prompt.substring(0, 100)}...`);

      if (
        prompt.includes('bookstore') ||
        prompt.includes('e-commerce') ||
        prompt.includes('BookHaven')
      ) {
        await route.fulfill(createMockResponse(mockApiResponses.ecommerceSuccess));
      } else if (
        prompt.includes('user management') ||
        prompt.includes('CorpConnect') ||
        prompt.includes('employee')
      ) {
        await route.fulfill(createMockResponse(mockApiResponses.userManagementSuccess));
      } else if (
        prompt.includes('admin') ||
        prompt.includes('dashboard') ||
        prompt.includes('CloudMetrics')
      ) {
        await route.fulfill(createMockResponse(mockApiResponses.adminSuccess));
      } else if (prompt.includes('restaurant') || prompt.includes('Bistro Deluxe')) {
        await route.fulfill(createMockResponse(mockApiResponses.restaurantSuccess));
      } else if (prompt.length < 50) {
        // Simple prompts should fail
        await route.fulfill(createErrorResponse(mockApiResponses.aiServiceError, 400));
      } else {
        // Default fallback response
        console.log('Using fallback e-commerce response');
        await route.fulfill(createMockResponse(mockApiResponses.ecommerceSuccess));
      }
    });
  }

  /**
   * Mock API errors for testing error handling
   */
  async mockGenerationError(errorType: 'server' | 'timeout' | 'validation' | 'ai') {
    await this.page.route('**/api/generate', async route => {
      this.routes.push(route);

      switch (errorType) {
        case 'server':
          await route.fulfill(createErrorResponse(mockApiResponses.apiError, 500));
          break;
        case 'timeout':
          await route.fulfill(createErrorResponse(mockApiResponses.timeoutError, 408, 31000));
          break;
        case 'validation':
          await route.fulfill(createErrorResponse(mockApiResponses.validationError, 400));
          break;
        case 'ai':
          await route.fulfill(createErrorResponse(mockApiResponses.aiServiceError, 422));
          break;
      }
    });
  }

  /**
   * Mock specific response for a given prompt
   */
  async mockSpecificResponse(promptSubstring: string, response: any, status: number = 200) {
    await this.page.route('**/api/generate', async route => {
      this.routes.push(route);

      const request = route.request();
      const requestBody = request.postDataJSON();
      const prompt = requestBody?.prompt || '';

      if (prompt.includes(promptSubstring)) {
        if (status === 200) {
          await route.fulfill(createMockResponse(response));
        } else {
          await route.fulfill(createErrorResponse(response, status));
        }
      } else {
        // Continue with normal handling
        await route.continue();
      }
    });
  }

  /**
   * Mock slow response for performance testing
   */
  async mockSlowResponse(delay: number = 5000) {
    await this.page.route('**/api/generate', async route => {
      this.routes.push(route);
      await route.fulfill(createMockResponse(mockApiResponses.ecommerceSuccess, delay));
    });
  }

  /**
   * Remove all API mocks
   */
  async clearMocks() {
    await this.page.unrouteAll();
    this.routes = [];
  }

  /**
   * Get intercepted requests for verification
   */
  getInterceptedRequests() {
    return this.routes.map(route => route.request());
  }

  /**
   * Verify that API was called with expected data
   */
  async verifyApiCall(expectedPrompt: string): Promise<boolean> {
    const requests = this.getInterceptedRequests();
    return requests.some(request => {
      const body = request.postDataJSON();
      return body?.prompt?.includes(expectedPrompt);
    });
  }
}
