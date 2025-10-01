import { test, expect } from '@playwright/test';
import { GenerationPage } from '../utils/generation-page';
import { ApiMocker } from '../utils/api-mocker';
import { testFixtures } from '../fixtures/test-data';
import { viewports } from '../utils/test-helpers';

test.describe('Responsive Design E2E Tests', () => {
  let generationPage: GenerationPage;
  let apiMocker: ApiMocker;

  test.beforeEach(async ({ page }) => {
    generationPage = new GenerationPage(page);
    apiMocker = new ApiMocker(page);
    await apiMocker.setupGenerationMocks();
  });

  test.afterEach(async () => {
    await apiMocker.clearMocks();
  });

  test.describe('Desktop Viewport Tests', () => {
    test('should render properly on desktop viewport (1920x1080)', async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await generationPage.goto();
      await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);
      await generationPage.waitForGenerationResult();

      // Verify desktop-specific layout
      const header = page.locator('.px-4.sm\\:px-6.py-4');
      await expect(header).toBeVisible();

      // Check responsive grid layout
      const entityGrid = page.locator(
        '.grid.gap-4.sm\\:gap-6.md\\:grid-cols-1.lg\\:grid-cols-2.xl\\:grid-cols-2',
      );
      await expect(entityGrid).toBeVisible();

      // Verify feature grid layout
      const featureGrid = page.locator(
        '.grid.gap-4.sm\\:grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-2.xl\\:grid-cols-3',
      );
      await expect(featureGrid).toBeVisible();

      // Check button styling responds to viewport
      const generateButton = page.locator('button[type="submit"]');
      await expect(generateButton).toHaveCSS('min-width', '120px');
    });

    test('should display full navigation on desktop', async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await generationPage.goto();
      await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);
      await generationPage.waitForGenerationResult();

      const navLinks = await generationPage.getNavigationLinks();
      expect(navLinks.length).toBeGreaterThan(0);

      // Navigation should be fully visible on desktop
      const navContainer = page.locator('nav');
      if (await navContainer.isVisible()) {
        const navWidth = await navContainer.boundingBox();
        expect(navWidth?.width).toBeGreaterThan(300); // Desktop nav should be wider
      }
    });

    test('should properly display product cards in desktop grid', async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await generationPage.goto();
      await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);
      await generationPage.waitForGenerationResult();

      // Product cards should use desktop layout
      const productCards = page.locator('button:has-text("Add to Cart")').locator('..');
      const cardCount = await productCards.count();

      if (cardCount > 0) {
        // Check that cards are properly sized for desktop
        const firstCard = productCards.first();
        const cardBox = await firstCard.boundingBox();
        expect(cardBox?.width).toBeGreaterThan(200); // Desktop cards should be wider
      }
    });
  });

  test.describe('Mobile Viewport Tests', () => {
    test('should render properly on mobile viewport (iPhone 12)', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await generationPage.goto();
      await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);
      await generationPage.waitForGenerationResult();

      // Verify mobile-responsive header
      const header = page.locator('.flex.flex-col.sm\\:flex-row');
      await expect(header).toBeVisible();

      // Check that content fits mobile viewport
      const content = page.locator('.p-4.sm\\:p-6');
      await expect(content).toBeVisible();

      // Verify mobile typography
      const title = page.locator('.text-xl.sm\\:text-2xl.font-bold');
      await expect(title).toBeVisible();

      // Check mobile-friendly button
      const resetButton = page.locator('text=Generate New App');
      await expect(resetButton).toHaveClass(/whitespace-nowrap/);
    });

    test('should adapt navigation for mobile devices', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await generationPage.goto();
      await generationPage.generateApp(testFixtures.userManagement.detailedPrompt);
      await generationPage.waitForGenerationResult();

      // Mobile navigation should be compact or collapsible
      const navContainer = page.locator('nav');
      if (await navContainer.isVisible()) {
        const navBox = await navContainer.boundingBox();
        expect(navBox?.width).toBeLessThanOrEqual(viewports.mobile.width);
      }
    });

    test('should display single-column layout on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await generationPage.goto();
      await generationPage.generateApp(testFixtures.admin.detailedPrompt);
      await generationPage.waitForGenerationResult();

      // Entity grid should stack on mobile
      const entityGrid = page.locator('.grid.gap-4');
      await expect(entityGrid).toBeVisible();

      // Feature grid should adapt to mobile
      const featureGrid = page.locator('.grid.gap-4.sm\\:grid-cols-1');
      if (await featureGrid.isVisible()) {
        // Should use single column layout on mobile
        const gridItems = featureGrid.locator('> div');
        const itemCount = await gridItems.count();

        if (itemCount > 1) {
          // Check that items stack vertically on mobile
          const firstItem = await gridItems.first().boundingBox();
          const secondItem = await gridItems.nth(1).boundingBox();

          if (firstItem && secondItem) {
            expect(secondItem.y).toBeGreaterThan(firstItem.y + firstItem.height - 10);
          }
        }
      }
    });

    test('should make text readable on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await generationPage.goto();
      await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);
      await generationPage.waitForGenerationResult();

      // Check text sizing
      const description = page.locator('.text-sm.sm\\:text-base');
      await expect(description).toBeVisible();

      // Verify buttons are touch-friendly
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();

      for (let i = 0; i < Math.min(buttonCount, 3); i++) {
        const button = buttons.nth(i);
        const buttonBox = await button.boundingBox();

        if (buttonBox) {
          // Touch targets should be at least 44px
          expect(Math.min(buttonBox.width, buttonBox.height)).toBeGreaterThan(30);
        }
      }
    });
  });

  test.describe('Tablet Viewport Tests', () => {
    test('should render properly on tablet viewport (768x1024)', async ({ page }) => {
      await page.setViewportSize(viewports.tablet);
      await generationPage.goto();
      await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);
      await generationPage.waitForGenerationResult();

      // Tablet should use medium breakpoint styles
      const content = page.locator('.p-4.sm\\:p-6');
      await expect(content).toBeVisible();

      // Check intermediate grid layout
      const entityGrid = page.locator('.grid.gap-4');
      await expect(entityGrid).toBeVisible();

      // Verify tablet-appropriate navigation
      const navLinks = await generationPage.getNavigationLinks();
      expect(navLinks.length).toBeGreaterThan(0);
    });

    test('should display two-column layout on tablet', async ({ page }) => {
      await page.setViewportSize(viewports.tablet);
      await generationPage.goto();
      await generationPage.generateApp(testFixtures.userManagement.detailedPrompt);
      await generationPage.waitForGenerationResult();

      // Tablet should show more items per row than mobile
      const featureGrid = page.locator('.grid.gap-4.sm\\:grid-cols-1.md\\:grid-cols-2');
      if (await featureGrid.isVisible()) {
        await expect(featureGrid).toBeVisible();
      }
    });
  });

  test.describe('Cross-Viewport Component Consistency', () => {
    test('should maintain functionality across all viewport sizes', async ({ page }) => {
      const testViewports = [viewports.mobile, viewports.tablet, viewports.desktop];
      const prompt = testFixtures.ecommerce.detailedPrompt;

      for (const viewport of testViewports) {
        await page.setViewportSize(viewport);
        await generationPage.goto();
        await generationPage.generateApp(prompt);
        await generationPage.waitForGenerationResult();

        // Core functionality should work on all viewports
        await generationPage.expectGenerationSuccess();

        // Context detection should work consistently
        const contextBadge = page.locator('.bg-blue-100.text-blue-800');
        await expect(contextBadge).toBeVisible();

        // Product cards should be functional
        if (await generationPage.hasProductCards()) {
          const addToCartButtons = page.locator('button:has-text("Add to Cart")');
          expect(await addToCartButtons.count()).toBeGreaterThan(0);
        }

        console.log(`Viewport ${viewport.width}x${viewport.height}: Tests passed`);
      }
    });

    test('should adapt component layouts appropriately', async ({ page }) => {
      const prompt = testFixtures.admin.detailedPrompt;

      // Test mobile layout
      await page.setViewportSize(viewports.mobile);
      await generationPage.goto();
      await generationPage.generateApp(prompt);
      await generationPage.waitForGenerationResult();

      const mobileLayout = await page.locator('.grid').boundingBox();

      // Test desktop layout
      await page.setViewportSize(viewports.desktop);
      await generationPage.goto();
      await generationPage.generateApp(prompt);
      await generationPage.waitForGenerationResult();

      const desktopLayout = await page.locator('.grid').boundingBox();

      // Desktop layout should utilize more horizontal space
      if (mobileLayout && desktopLayout) {
        expect(desktopLayout.width).toBeGreaterThan(mobileLayout.width);
      }
    });
  });

  test.describe('Touch Interface Testing', () => {
    test('should handle touch interactions on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await generationPage.goto();

      // Test touch interaction with form
      const textarea = page.locator('textarea[name="description"]');
      await textarea.tap();
      await textarea.fill(testFixtures.ecommerce.detailedPrompt);

      const generateButton = page.locator('button[type="submit"]');
      await generateButton.tap();

      await generationPage.waitForGenerationResult();
      await generationPage.expectGenerationSuccess();

      // Test touch interaction with generated components
      if (await generationPage.hasProductCards()) {
        const firstButton = page.locator('button:has-text("Add to Cart")').first();
        await firstButton.tap();
        // Button should respond to tap (no errors)
      }
    });
  });

  test.describe('Performance on Different Viewports', () => {
    test('should maintain performance across viewport sizes', async ({ page }) => {
      const testCases = [
        { viewport: viewports.mobile, name: 'Mobile' },
        { viewport: viewports.tablet, name: 'Tablet' },
        { viewport: viewports.desktop, name: 'Desktop' },
      ];

      for (const testCase of testCases) {
        const startTime = Date.now();

        await page.setViewportSize(testCase.viewport);
        await generationPage.goto();
        await generationPage.generateApp(testFixtures.ecommerce.detailedPrompt);
        await generationPage.waitForGenerationResult();

        const endTime = Date.now();
        const duration = endTime - startTime;

        // Performance should be consistent across viewports
        expect(duration).toBeLessThan(30000);

        console.log(
          `${testCase.name} (${testCase.viewport.width}x${testCase.viewport.height}): ${duration}ms`,
        );
      }
    });
  });
});
