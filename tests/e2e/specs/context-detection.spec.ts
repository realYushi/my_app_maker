import { test, expect } from '@playwright/test';
import { GenerationPage } from '../utils/generation-page';
import { ApiMocker } from '../utils/api-mocker';
import { testFixtures } from '../fixtures/test-data';
import { components } from '../utils/test-helpers';

test.describe('Context Detection E2E Tests', () => {
  let generationPage: GenerationPage;
  let apiMocker: ApiMocker;

  test.beforeEach(async ({ page }) => {
    generationPage = new GenerationPage(page);
    apiMocker = new ApiMocker(page);
    await generationPage.goto();
    await apiMocker.setupGenerationMocks();
  });

  test.afterEach(async () => {
    await apiMocker.clearMocks();
  });

  test.describe('E-commerce Context Detection', () => {
    test('should detect e-commerce context and render product cards', async ({ page }) => {
      await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);
      await generationPage.waitForGenerationResult();
      await generationPage.expectGenerationSuccess();

      // Verify e-commerce context detection
      const detectedContext = await components.detectContext(page);
      expect(detectedContext).toBe('ecommerce');

      // Verify product cards are rendered
      expect(await generationPage.hasProductCards()).toBe(true);

      // Verify context-specific UI elements
      const contextBadge = page.locator('.bg-blue-100.text-blue-800');
      await expect(contextBadge).toBeVisible();
      await expect(contextBadge).toContainText('ECOMMERCE');

      // Verify e-commerce specific navigation
      const navLinks = await generationPage.getNavigationLinks();
      expect(navLinks.length).toBeGreaterThan(0);

      // Verify shopping cart presence
      const addToCartButtons = page.locator('button:has-text("Add to Cart")');
      expect(await addToCartButtons.count()).toBeGreaterThan(0);
    });

    test('should render e-commerce themed header and styling', async ({ page }) => {
      await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);
      await generationPage.waitForGenerationResult();

      // Verify e-commerce themed header
      const header = page.locator('.bg-gradient-to-r.from-blue-600.to-blue-700');
      await expect(header).toBeVisible();

      // Verify e-commerce icon
      const icon = page.locator('span:has-text("🛍️")');
      await expect(icon).toBeVisible();

      // Verify description
      const description = page.locator('text=E-commerce platform');
      await expect(description).toBeVisible();
    });

    test('should route e-commerce entities to product card components', async ({ page }) => {
      await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);
      await generationPage.waitForGenerationResult();

      // Verify entity component routing
      const productElements = page.locator('.aspect-square.bg-gray-100'); // Product image containers
      expect(await productElements.count()).toBeGreaterThan(0);

      // Verify pricing displays
      const priceElements = page.locator('.text-2xl.font-bold:has-text("$")');
      expect(await priceElements.count()).toBeGreaterThan(0);

      // Verify rating systems
      const ratingElements = page.locator('.text-yellow-400:has-text("★")');
      expect(await ratingElements.count()).toBeGreaterThan(0);
    });
  });

  test.describe('User Management Context Detection', () => {
    test('should detect user management context and render user components', async ({ page }) => {
      await generationPage.generateApp(testFixtures.userManagement.detailedPrompt);
      await generationPage.waitForGenerationResult();
      await generationPage.expectGenerationSuccess();

      // Verify user management context detection
      const contextBadge = page.locator('.bg-blue-100.text-blue-800');
      await expect(contextBadge).toBeVisible();
      await expect(contextBadge).toContainText('USER_MANAGEMENT');

      // Verify user management themed header
      const header = page.locator('.bg-gradient-to-r.from-indigo-600.to-indigo-700');
      await expect(header).toBeVisible();

      // Verify user management icon
      const icon = page.locator('span:has-text("👥")');
      await expect(icon).toBeVisible();

      // Verify description
      const description = page.locator('text=User management system');
      await expect(description).toBeVisible();
    });

    test('should route user entities to user management components', async ({ page }) => {
      await generationPage.generateApp(testFixtures.userManagement.detailedPrompt);
      await generationPage.waitForGenerationResult();

      // Verify user management specific elements would be present
      const entityGrid = page.locator('.grid.gap-4');
      await expect(entityGrid).toBeVisible();

      // Check for user-related form fields or components
      const formElements = page.locator('input, select, textarea');
      expect(await formElements.count()).toBeGreaterThan(0);
    });

    test('should display user management navigation items', async ({ page }) => {
      await generationPage.generateApp(testFixtures.userManagement.detailedPrompt);
      await generationPage.waitForGenerationResult();

      const navLinks = await generationPage.getNavigationLinks();
      expect(navLinks.length).toBeGreaterThan(0);

      // User management should have some navigation structure
      expect(
        navLinks.some(
          link =>
            link.toLowerCase().includes('employee') ||
            link.toLowerCase().includes('department') ||
            link.toLowerCase().includes('user'),
        ),
      ).toBe(true);
    });
  });

  test.describe('Admin Dashboard Context Detection', () => {
    test('should detect admin context and render dashboard components', async ({ page }) => {
      await generationPage.generateApp(testFixtures.admin.detailedPrompt);
      await generationPage.waitForGenerationResult();
      await generationPage.expectGenerationSuccess();

      // Verify admin context detection
      const contextBadge = page.locator('.bg-blue-100.text-blue-800');
      await expect(contextBadge).toBeVisible();
      await expect(contextBadge).toContainText('ADMIN');

      // Verify admin themed header
      const header = page.locator('.bg-gradient-to-r.from-red-600.to-red-700');
      await expect(header).toBeVisible();

      // Verify admin icon
      const icon = page.locator('span:has-text("⚙️")');
      await expect(icon).toBeVisible();

      // Verify description
      const description = page.locator('text=Administrative dashboard');
      await expect(description).toBeVisible();
    });

    test('should display admin-specific navigation and features', async ({ page }) => {
      await generationPage.generateApp(testFixtures.admin.detailedPrompt);
      await generationPage.waitForGenerationResult();

      const navLinks = await generationPage.getNavigationLinks();
      expect(navLinks.length).toBeGreaterThan(0);

      // Admin should have dashboard-related navigation
      expect(
        navLinks.some(
          link =>
            link.toLowerCase().includes('dashboard') ||
            link.toLowerCase().includes('analytics') ||
            link.toLowerCase().includes('admin'),
        ),
      ).toBe(true);
    });
  });

  test.describe('Component Factory Routing Logic', () => {
    test('should route different entity types to appropriate domain components', async ({
      page,
    }) => {
      const testCases = [
        {
          prompt: testFixtures.ecommerce.detailedPrompt,
          expectedContext: 'ecommerce',
          expectedElements: ['button:has-text("Add to Cart")', '.text-2xl.font-bold:has-text("$")'],
        },
        {
          prompt: testFixtures.userManagement.detailedPrompt,
          expectedContext: 'user-management',
          expectedElements: ['.grid.gap-4'],
        },
        {
          prompt: testFixtures.admin.detailedPrompt,
          expectedContext: 'admin',
          expectedElements: ['.grid.gap-4'],
        },
      ];

      for (const testCase of testCases) {
        await generationPage.goto(); // Reset page
        await generationPage.generateApp(testCase.prompt);
        await generationPage.waitForGenerationResult();
        await generationPage.expectGenerationSuccess();

        // Verify appropriate components are rendered
        for (const selector of testCase.expectedElements) {
          const element = page.locator(selector);
          await expect(element).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test('should display context-specific entity counts', async ({ page }) => {
      await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);
      await generationPage.waitForGenerationResult();

      // Verify entity count display
      const overview = page.locator('text=/\\d+ entities/');
      await expect(overview).toBeVisible();

      // Verify matched entities count for context
      const matchedEntities = page.locator('text=/\\(\\d+ matched entities\\)/');
      await expect(matchedEntities).toBeVisible();
    });

    test('should maintain consistent routing across multiple generations', async ({ page }) => {
      // Test multiple e-commerce generations
      for (let i = 0; i < 2; i++) {
        await generationPage.goto();
        await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);
        await generationPage.waitForGenerationResult();

        // Should consistently detect e-commerce and show product cards
        const contextBadge = page.locator('text=ECOMMERCE');
        await expect(contextBadge).toBeVisible();

        const productCards = page.locator('button:has-text("Add to Cart")');
        expect(await productCards.count()).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Mixed Context Scenarios', () => {
    test('should handle entities that could match multiple contexts', async ({ page }) => {
      // Create a prompt that could match multiple contexts
      const mixedPrompt = `Create a comprehensive business management platform called "BusinessHub".

      Features needed:
      - User management for employees and customers
      - Product catalog for inventory
      - Administrative dashboard for metrics
      - Order processing and customer management

      User roles:
      - Customer: Browse products, place orders
      - Employee: Manage orders, customer service
      - Manager: View reports, manage employees
      - Admin: Full system access

      The platform should handle both B2B and B2C scenarios.`;

      await generationPage.generateApp(mixedPrompt);
      await generationPage.waitForGenerationResult();
      await generationPage.expectGenerationSuccess();

      // Should detect the primary context and show appropriate components
      const contextBadge = page.locator('.bg-blue-100.text-blue-800');
      await expect(contextBadge).toBeVisible();

      // Should show matched entities count
      const matchedEntities = page.locator('text=/\\(\\d+ matched entities\\)/');
      await expect(matchedEntities).toBeVisible();

      // Should render appropriate components based on detected context
      const entityGrid = page.locator('.grid.gap-4');
      await expect(entityGrid).toBeVisible();
    });
  });

  test.describe('Context Detection Performance', () => {
    test('should detect context quickly without affecting generation speed', async ({ page }) => {
      const startTime = Date.now();

      await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);
      await generationPage.waitForGenerationResult();

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Context detection should not significantly impact performance
      expect(duration).toBeLessThan(30000); // 30 second timeout

      // Context should be properly detected and displayed
      const contextBadge = page.locator('.bg-blue-100.text-blue-800');
      await expect(contextBadge).toBeVisible();

      console.log(`Context detection and generation completed in ${duration}ms`);
    });
  });
});
