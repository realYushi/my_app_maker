import { test, expect } from '@playwright/test';
import { GenerationPage } from '../utils/generation-page';
import { ApiMocker } from '../utils/api-mocker';
import { mockApiResponses } from '../fixtures/mock-responses';

test.describe('Fallback Behavior E2E Tests', () => {
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

  test.describe('EntityForm.tsx Fallback for Unrecognized Entity Types', () => {
    test('should fallback to EntityForm for generic entity types', async ({ page }) => {
      // Mock response with generic/unrecognized entity types
      const genericResponse = {
        entities: [
          {
            name: 'widget',
            fields: ['id', 'name', 'description', 'value'],
            type: 'generic'
          },
          {
            name: 'item',
            fields: ['uuid', 'label', 'category'],
            type: 'unknown'
          }
        ],
        roles: ['user', 'manager'],
        features: ['basic_crud', 'search'],
        navigation: [
          { name: 'Widgets', path: '/widgets' },
          { name: 'Items', path: '/items' }
        ]
      };

      await apiMocker.mockSpecificResponse('generic entity test', genericResponse);

      await generationPage.generateApp('Create a generic entity test system with widgets and items');
      await generationPage.waitForGenerationResult();
      await generationPage.expectGenerationSuccess();

      // Should not detect any specific context
      const contextBadge = page.locator('.bg-blue-100.text-blue-800');

      // Either no context detected (GENERIC) or fallback behavior
      const badgeText = await contextBadge.textContent().catch(() => '');
      if (badgeText) {
        expect(badgeText).toContain('GENERIC');
      }

      // Should show generic fallback components (EntityForm)
      expect(await generationPage.hasEntityForm()).toBe(true);

      // Should display entities in grid layout
      const entityGrid = page.locator('.grid.gap-4');
      await expect(entityGrid).toBeVisible();

      // Should have basic form elements for generic entities
      const formElements = page.locator('input, select, textarea');
      expect(await formElements.count()).toBeGreaterThan(0);
    });

    test('should handle entities with no specific domain context', async ({ page }) => {
      const noDomainResponse = {
        entities: [
          {
            name: 'record',
            fields: ['id', 'timestamp', 'data', 'status'],
            type: 'data'
          },
          {
            name: 'entry',
            fields: ['uuid', 'content', 'metadata'],
            type: 'content'
          }
        ],
        roles: ['operator', 'viewer'],
        features: ['data_entry', 'reporting'],
        navigation: [
          { name: 'Records', path: '/records' },
          { name: 'Entries', path: '/entries' }
        ]
      };

      await apiMocker.mockSpecificResponse('data management system', noDomainResponse);

      await generationPage.generateApp('Build a data management system for records and entries');
      await generationPage.waitForGenerationResult();
      await generationPage.expectGenerationSuccess();

      // Should fallback to generic entity forms
      expect(await generationPage.hasEntityForm()).toBe(true);

      // Should not show specialized components
      expect(await generationPage.hasProductCards()).toBe(false);
      expect(await generationPage.hasUserProfile()).toBe(false);
      expect(await generationPage.hasAdminDashboard()).toBe(false);

      // Should display basic entity management interface
      const entitySections = page.locator('h2:has-text("Data Management")');
      await expect(entitySections).toBeVisible();
    });

    test('should maintain functionality when no context is detected', async ({ page }) => {
      const fallbackResponse = {
        entities: [
          {
            name: 'object',
            fields: ['property1', 'property2', 'property3'],
            type: 'abstract'
          }
        ],
        roles: ['user'],
        features: ['basic_operations'],
        navigation: [
          { name: 'Objects', path: '/objects' }
        ]
      };

      await apiMocker.mockSpecificResponse('abstract system', fallbackResponse);

      await generationPage.generateApp('Create an abstract system with objects');
      await generationPage.waitForGenerationResult();
      await generationPage.expectGenerationSuccess();

      // Should show app overview
      const overview = page.locator('h2:has-text("App Overview")');
      await expect(overview).toBeVisible();

      // Should show entity management section
      const dataManagement = page.locator('h2:has-text("Data Management")');
      await expect(dataManagement).toBeVisible();

      // Should show features section
      const features = page.locator('h2:has-text("Available Features")');
      await expect(features).toBeVisible();

      // Should have working navigation
      const navLinks = await generationPage.getNavigationLinks();
      expect(navLinks.length).toBeGreaterThan(0);
    });
  });

  test.describe('Backward Compatibility with Existing Generation Logic', () => {
    test('should work with legacy entity structures', async ({ page }) => {
      // Test with older entity format that might not have type field
      const legacyResponse = {
        entities: [
          {
            name: 'customer',
            fields: ['name', 'email', 'phone']
            // No type field - legacy format
          },
          {
            name: 'order',
            fields: ['id', 'total', 'date']
            // No type field - legacy format
          }
        ],
        roles: ['user', 'admin'],
        features: ['customer_management', 'order_tracking']
      };

      await apiMocker.mockSpecificResponse('legacy system', legacyResponse);

      await generationPage.generateApp('Create a legacy system for customers and orders');
      await generationPage.waitForGenerationResult();
      await generationPage.expectGenerationSuccess();

      // Should handle legacy format gracefully
      const entityGrid = page.locator('.grid.gap-4');
      await expect(entityGrid).toBeVisible();

      // Should show entities even without type information
      const entities = entityGrid.locator('> div');
      expect(await entities.count()).toBeGreaterThan(0);

      // Should maintain basic functionality
      expect(await generationPage.hasEntityForm()).toBe(true);
    });

    test('should handle partial context matches gracefully', async ({ page }) => {
      // Entities that partially match multiple contexts
      const partialMatchResponse = {
        entities: [
          {
            name: 'item', // Could be product or generic item
            fields: ['name', 'description', 'category'],
            type: 'item'
          },
          {
            name: 'person', // Could be user or customer
            fields: ['firstName', 'lastName', 'email'],
            type: 'person'
          }
        ],
        roles: ['member', 'moderator'],
        features: ['item_management', 'person_tracking']
      };

      await apiMocker.mockSpecificResponse('hybrid system', partialMatchResponse);

      await generationPage.generateApp('Build a hybrid system for items and people');
      await generationPage.waitForGenerationResult();
      await generationPage.expectGenerationSuccess();

      // Should make a reasonable context decision or fallback
      const contextBadge = page.locator('.bg-blue-100.text-blue-800');

      // Either detect a context or show generic
      if (await contextBadge.isVisible()) {
        const contextText = await contextBadge.textContent();
        expect(contextText).toBeTruthy();
      }

      // Should render appropriate components based on decision
      const entityGrid = page.locator('.grid.gap-4');
      await expect(entityGrid).toBeVisible();
    });
  });

  test.describe('Progressive Enhancement from Detection to Fallback', () => {
    test('should gracefully degrade when specialized components fail', async ({ page }) => {
      // Create a scenario where context is detected but specialized rendering might fail
      const problematicResponse = {
        entities: [
          {
            name: 'product',
            fields: ['name'], // Minimal fields that might cause issues
            type: 'product'
          }
        ],
        roles: ['customer'],
        features: ['shopping']
      };

      await apiMocker.mockSpecificResponse('minimal product', problematicResponse);

      await generationPage.generateApp('Create a minimal product system');
      await generationPage.waitForGenerationResult();
      await generationPage.expectGenerationSuccess();

      // Should either show specialized component or fallback gracefully
      const hasSpecialized = await generationPage.hasProductCards();
      const hasFallback = await generationPage.hasEntityForm();

      expect(hasSpecialized || hasFallback).toBe(true);

      // Should not crash or show errors
      expect(await generationPage.hasError()).toBe(false);
    });

    test('should maintain service layer abstraction consistency', async ({ page }) => {
      const testResponse = {
        entities: [
          {
            name: 'entity',
            fields: ['field1', 'field2'],
            type: 'test'
          }
        ],
        roles: ['tester'],
        features: ['testing']
      };

      await apiMocker.mockSpecificResponse('service test', testResponse);

      await generationPage.generateApp('Create a service test system');
      await generationPage.waitForGenerationResult();
      await generationPage.expectGenerationSuccess();

      // Verify API call was made through service layer
      expect(await apiMocker.verifyApiCall('service test')).toBe(true);

      // Should maintain consistent interface regardless of fallback
      const appContainer = page.locator('.mt-6.bg-white.border');
      await expect(appContainer).toBeVisible();

      // Should show consistent header structure
      const header = page.locator('.bg-gradient-to-r');
      await expect(header).toBeVisible();
    });

    test('should handle missing or malformed response data', async ({ page }) => {
      // Test with incomplete response
      const incompleteResponse = {
        entities: [
          {
            name: 'incomplete'
            // Missing fields and type
          }
        ]
        // Missing roles and features
      };

      await apiMocker.mockSpecificResponse('incomplete data', incompleteResponse);

      await generationPage.generateApp('Test incomplete data handling');
      await generationPage.waitForGenerationResult();

      // Should either succeed with fallback or show appropriate error
      const hasApp = await generationPage.hasGeneratedApp();
      const hasError = await generationPage.hasError();

      expect(hasApp || hasError).toBe(true);

      if (hasApp) {
        // If successful, should show fallback interface
        const entityGrid = page.locator('.grid');
        await expect(entityGrid).toBeVisible();
      }
    });
  });

  test.describe('Edge Cases and Error Recovery', () => {
    test('should handle empty entity arrays', async ({ page }) => {
      const emptyResponse = {
        entities: [],
        roles: ['user'],
        features: ['basic'],
        appName: 'Empty Test App'
      };

      await apiMocker.mockSpecificResponse('empty entities', emptyResponse);

      await generationPage.generateApp('Create an app with empty entities');
      await generationPage.waitForGenerationResult();
      await generationPage.expectGenerationSuccess();

      // Should show app overview even with no entities
      const overview = page.locator('h2:has-text("App Overview")');
      await expect(overview).toBeVisible();

      // Should show features if available
      const features = page.locator('h2:has-text("Available Features")');
      await expect(features).toBeVisible();

      // Should not show data management section with no entities
      const dataManagement = page.locator('h2:has-text("Data Management")');
      await expect(dataManagement).not.toBeVisible();
    });

    test('should recover from component rendering errors', async ({ page }) => {
      // Monitor console for errors during rendering
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await apiMocker.setupGenerationMocks();

      await generationPage.generateApp('Test error recovery with standard e-commerce prompt');
      await generationPage.waitForGenerationResult();

      // Should complete generation even if some components have issues
      await generationPage.expectGenerationSuccess();

      // Should minimize console errors
      const relevantErrors = errors.filter(error =>
        !error.includes('Warning') &&
        !error.includes('Development')
      );

      expect(relevantErrors.length).toBeLessThan(3); // Allow for minor warnings
    });

    test('should maintain accessibility in fallback scenarios', async ({ page }) => {
      const accessibilityResponse = {
        entities: [
          {
            name: 'accessible_entity',
            fields: ['title', 'description'],
            type: 'accessible'
          }
        ],
        roles: ['user'],
        features: ['accessibility_test']
      };

      await apiMocker.mockSpecificResponse('accessibility test', accessibilityResponse);

      await generationPage.generateApp('Create an accessibility test system');
      await generationPage.waitForGenerationResult();
      await generationPage.expectGenerationSuccess();

      // Check basic accessibility requirements
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      expect(await headings.count()).toBeGreaterThan(0);

      // Form elements should have proper labels
      const inputs = page.locator('input, select, textarea');
      const inputCount = await inputs.count();

      if (inputCount > 0) {
        // At least some inputs should have associated labels
        const labeledInputs = page.locator('input[aria-label], input[aria-labelledby], label input');
        expect(await labeledInputs.count()).toBeGreaterThan(0);
      }
    });
  });
});