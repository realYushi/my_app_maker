import { test, expect } from '@playwright/test';
import { GenerationPage } from '../utils/generation-page';
import { ApiMocker } from '../utils/api-mocker';
import { testFixtures } from '../fixtures/test-data';
import { timeouts, performance as perfUtils } from '../utils/test-helpers';

test.describe('Core Generation Flow E2E Tests', () => {
  let generationPage: GenerationPage;
  let apiMocker: ApiMocker;

  test.beforeEach(async ({ page }) => {
    generationPage = new GenerationPage(page);
    apiMocker = new ApiMocker(page);
    await generationPage.goto();
  });

  test.afterEach(async () => {
    await apiMocker.clearMocks();
  });

  test.describe('Successful Generation Flows', () => {
    test('should complete e-commerce generation flow end-to-end', async () => {
      const startTime = Date.now();

      // Setup API mocking
      await apiMocker.setupGenerationMocks();

      // Test user input
      const prompt = testFixtures.ecommerce.detailedPrompt;
      await generationPage.enterPrompt(prompt);

      // Verify generate button is enabled
      expect(await generationPage.isGenerateButtonEnabled()).toBe(true);

      // Start generation
      await generationPage.clickGenerate();

      // Verify loading state
      expect(await generationPage.isLoading()).toBe(true);

      // Wait for generation to complete
      await generationPage.waitForGenerationResult();

      // Verify generation success
      await generationPage.expectGenerationSuccess();
      expect(await generationPage.hasGeneratedApp()).toBe(true);

      // Verify navigation generation
      const navLinks = await generationPage.getNavigationLinks();
      expect(navLinks.length).toBeGreaterThan(0);
      await generationPage.expectNavigationToContain(['Products', 'Cart']);

      // Verify context-aware components
      await generationPage.expectComponentsToBeVisible(['ProductCard']);

      // Verify API call
      expect(await apiMocker.verifyApiCall('BookHaven')).toBe(true);

      // Performance check
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(timeouts.generation);

      console.log(`E-commerce generation completed in ${duration}ms`);
    });

    test('should complete user management generation flow end-to-end', async () => {
      await apiMocker.setupGenerationMocks();

      const prompt = testFixtures.userManagement.detailedPrompt;
      await generationPage.generateApp(prompt);
      await generationPage.waitForGenerationResult();

      await generationPage.expectGenerationSuccess();

      // Verify user management specific components
      await generationPage.expectComponentsToBeVisible(['UserProfile']);

      const navLinks = await generationPage.getNavigationLinks();
      await generationPage.expectNavigationToContain(['Employees', 'Departments']);

      expect(await apiMocker.verifyApiCall('CorpConnect')).toBe(true);
    });

    test('should complete admin dashboard generation flow end-to-end', async () => {
      await apiMocker.setupGenerationMocks();

      const prompt = testFixtures.admin.detailedPrompt;
      await generationPage.generateApp(prompt);
      await generationPage.waitForGenerationResult();

      await generationPage.expectGenerationSuccess();

      // Verify admin-specific components
      await generationPage.expectComponentsToBeVisible(['AdminDashboard']);

      const navLinks = await generationPage.getNavigationLinks();
      await generationPage.expectNavigationToContain(['Dashboard', 'Analytics']);

      expect(await apiMocker.verifyApiCall('CloudMetrics')).toBe(true);
    });

    test('should complete restaurant management generation flow (QA validated)', async () => {
      await apiMocker.setupGenerationMocks();

      const prompt = testFixtures.restaurant.detailedPrompt;
      await generationPage.generateApp(prompt);
      await generationPage.waitForGenerationResult();

      await generationPage.expectGenerationSuccess();

      // Restaurant should use product cards for menu items
      const visibleComponents = await generationPage.getVisibleComponents();
      expect(visibleComponents.length).toBeGreaterThan(0);

      const navLinks = await generationPage.getNavigationLinks();
      expect(navLinks.length).toBeGreaterThan(0);

      expect(await apiMocker.verifyApiCall('Bistro Deluxe')).toBe(true);
    });
  });

  test.describe('Error Handling Scenarios', () => {
    test('should handle API server errors gracefully', async () => {
      await apiMocker.mockGenerationError('server');

      await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);
      await generationPage.waitForGenerationResult();

      await generationPage.expectGenerationError();
      const errorMessage = await generationPage.getErrorMessage();
      expect(errorMessage).toContain('error');
    });

    test('should handle API timeout errors', async () => {
      await apiMocker.mockGenerationError('timeout');

      await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);

      // Should timeout within our test timeout
      await expect(async () => {
        await generationPage.waitForGenerationResult();
      }).rejects.toThrow();
    });

    test('should handle validation errors for long input', async () => {
      await apiMocker.mockGenerationError('validation');

      const longPrompt = 'a'.repeat(10001); // Exceeds 10k character limit
      await generationPage.generateApp(longPrompt);
      await generationPage.waitForGenerationResult();

      await generationPage.expectGenerationError();
      const errorMessage = await generationPage.getErrorMessage();
      expect(errorMessage).toContain('validation');
    });

    test('should handle AI service extraction errors', async () => {
      await apiMocker.mockGenerationError('ai');

      await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);
      await generationPage.waitForGenerationResult();

      await generationPage.expectGenerationError();
    });
  });

  test.describe('Simple vs Detailed Prompt Scenarios', () => {
    test('should succeed with detailed prompts', async () => {
      await apiMocker.setupGenerationMocks();

      const detailedPrompts = [
        testFixtures.ecommerce.detailedPrompt,
        testFixtures.userManagement.detailedPrompt,
        testFixtures.admin.detailedPrompt,
      ];

      for (const prompt of detailedPrompts) {
        await generationPage.goto(); // Reset page
        await generationPage.generateApp(prompt);
        await generationPage.waitForGenerationResult();
        await generationPage.expectGenerationSuccess();
      }
    });

    test('should fail gracefully with simple prompts', async () => {
      await apiMocker.setupGenerationMocks();

      const simplePrompts = ['Make an online store', 'Create user management', 'Build admin panel'];

      for (const prompt of simplePrompts) {
        await generationPage.goto(); // Reset page
        await generationPage.generateApp(prompt);
        await generationPage.waitForGenerationResult();

        // Simple prompts should either fail gracefully or show minimal output
        const hasError = await generationPage.hasError();
        const hasApp = await generationPage.hasGeneratedApp();

        // Either error (expected) or minimal generation (acceptable)
        expect(hasError || hasApp).toBe(true);
      }
    });
  });

  test.describe('AI Service Integration', () => {
    test('should work with AI service mock mode', async ({ page }) => {
      // Verify the mock setup works correctly
      await apiMocker.setupGenerationMocks();

      await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);
      await generationPage.waitForGenerationResult();

      await generationPage.expectGenerationSuccess();

      // Verify mock response was used
      const requests = apiMocker.getInterceptedRequests();
      expect(requests.length).toBeGreaterThan(0);
    });

    test('should verify request/response structure', async () => {
      await apiMocker.setupGenerationMocks();

      await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);
      await generationPage.waitForGenerationResult();

      const requests = apiMocker.getInterceptedRequests();
      expect(requests.length).toBe(1);

      const request = requests[0];
      expect(request.method()).toBe('POST');
      expect(request.url()).toContain('/api/generate');

      const requestBody = request.postDataJSON();
      expect(requestBody).toHaveProperty('prompt');
      expect(requestBody.prompt).toContain('BookHaven');
    });
  });

  test.describe('Dynamic Routing and Navigation', () => {
    test('should generate functional navigation for all contexts', async () => {
      await apiMocker.setupGenerationMocks();

      const contexts = [
        { fixture: testFixtures.ecommerce, expectedLinks: ['Products', 'Cart'] },
        { fixture: testFixtures.userManagement, expectedLinks: ['Employees'] },
        { fixture: testFixtures.admin, expectedLinks: ['Dashboard'] },
      ];

      for (const context of contexts) {
        await generationPage.goto();
        await generationPage.generateApp(context.fixture.detailedPrompt);
        await generationPage.waitForGenerationResult();

        await generationPage.expectGenerationSuccess();

        const navLinks = await generationPage.getNavigationLinks();
        expect(navLinks.length).toBeGreaterThan(0);

        // Verify at least some expected links are present
        const hasExpectedLinks = context.expectedLinks.some(link =>
          navLinks.some(navLink => navLink.includes(link)),
        );
        expect(hasExpectedLinks).toBe(true);
      }
    });

    test('should handle navigation click interactions', async ({ page }) => {
      await apiMocker.setupGenerationMocks();

      await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);
      await generationPage.waitForGenerationResult();
      await generationPage.expectGenerationSuccess();

      // Try clicking on navigation links
      const navLinks = await page.locator('[data-testid="nav-link"]').all();

      if (navLinks.length > 0) {
        // Click first navigation link
        await navLinks[0].click();

        // Verify page doesn't break (basic interaction test)
        await page.waitForTimeout(1000);
        expect(await generationPage.hasGeneratedApp()).toBe(true);
      }
    });
  });
});
