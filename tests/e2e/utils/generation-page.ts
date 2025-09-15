import { Page, expect } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Page Object for the main application generation flow
 */
export class GenerationPage extends BasePage {
  // Selectors (using actual component selectors)
  private readonly promptTextarea = 'textarea[name="description"]';
  private readonly generateButton = 'button[type="submit"]';
  private readonly loadingSpinner = '.animate-spin';
  private readonly errorMessage = '.text-red-600, .text-red-500';
  private readonly generatedAppContainer = '.mt-6.bg-white.border';
  private readonly navigationContainer = '.navigation-area, nav';
  private readonly navigationLinks = 'nav a';

  constructor(page: Page) {
    super(page);
  }

  // Actions
  async enterPrompt(prompt: string) {
    await this.fillInput(this.promptTextarea, prompt);
  }

  async clickGenerate() {
    await this.clickElement(this.generateButton);
  }

  async generateApp(prompt: string) {
    await this.enterPrompt(prompt);
    await this.clickGenerate();
  }

  async waitForGeneration() {
    // Wait for loading to start
    await this.waitForElement(this.loadingSpinner);
    // Wait for loading to finish
    await this.page.waitForSelector(this.loadingSpinner, { state: 'hidden', timeout: 30000 });
  }

  async waitForGenerationResult() {
    await this.waitForGeneration();
    // Wait for either success or error with a longer timeout for debugging
    try {
      await Promise.race([
        this.page.waitForSelector('.mt-6.bg-white.border', { timeout: 15000 }),
        this.page.waitForSelector('.text-red-600, .text-red-500', { timeout: 15000 })
      ]);
    } catch (error) {
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'debug-generation-timeout.png' });
      console.log('Current page URL:', this.page.url());
      console.log('Page content:', await this.page.content());
      throw new Error('Generation did not complete within timeout');
    }
  }

  // Getters
  async getPromptText(): Promise<string> {
    return await this.page.inputValue(this.promptTextarea);
  }

  async isGenerateButtonEnabled(): Promise<boolean> {
    return await this.page.isEnabled(this.generateButton);
  }

  async isLoading(): Promise<boolean> {
    return await this.isElementVisible(this.loadingSpinner);
  }

  async hasError(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  async getErrorMessage(): Promise<string> {
    if (await this.hasError()) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  async hasGeneratedApp(): Promise<boolean> {
    return await this.isElementVisible(this.generatedAppContainer);
  }

  async getNavigationLinks(): Promise<string[]> {
    if (await this.isElementVisible(this.navigationContainer)) {
      const links = await this.page.locator(this.navigationLinks).allTextContents();
      return links;
    }
    return [];
  }

  // Component-specific getters (based on actual component structures)
  async hasProductCards(): Promise<boolean> {
    // ProductCard has distinctive "Add to Cart" button
    return await this.isElementVisible('button:has-text("Add to Cart")') ||
           await this.isElementVisible('.text-2xl.font-bold:has-text("$")');
  }

  async hasShoppingCart(): Promise<boolean> {
    // Look for shopping cart related elements
    return await this.isElementVisible('button:has-text("🛒")') ||
           await this.isElementVisible('.shopping-cart, [class*="cart"]');
  }

  async hasUserProfile(): Promise<boolean> {
    // UserProfile component would have user-related form fields
    return await this.isElementVisible('input[type="email"]') ||
           await this.isElementVisible('.user-profile, [class*="profile"]');
  }

  async hasUserManagementTable(): Promise<boolean> {
    // Look for table-like structures with user data
    return await this.isElementVisible('table') ||
           await this.isElementVisible('.grid .border-gray-200');
  }

  async hasAdminDashboard(): Promise<boolean> {
    // Admin dashboard would have charts, metrics, or administrative elements
    return await this.isElementVisible('.admin-dashboard, [class*="dashboard"]') ||
           await this.isElementVisible('h2:has-text("Dashboard")');
  }

  async hasEntityForm(): Promise<boolean> {
    // EntityForm fallback - look for generic form elements in entity grid
    return await this.isElementVisible('.grid') &&
           await this.isElementVisible('input, select, textarea');
  }

  async getVisibleComponents(): Promise<string[]> {
    const components: string[] = [];

    if (await this.hasProductCards()) components.push('ProductCard');
    if (await this.hasShoppingCart()) components.push('ShoppingCart');
    if (await this.hasUserProfile()) components.push('UserProfile');
    if (await this.hasUserManagementTable()) components.push('UserManagementTable');
    if (await this.hasAdminDashboard()) components.push('AdminDashboard');
    if (await this.hasEntityForm()) components.push('EntityForm');

    return components;
  }

  // Assertions
  async expectGenerationSuccess() {
    await expect(this.page.locator(this.generatedAppContainer)).toBeVisible();
    await expect(this.page.locator(this.errorMessage)).not.toBeVisible();
  }

  async expectGenerationError() {
    await expect(this.page.locator(this.errorMessage)).toBeVisible();
    await expect(this.page.locator(this.generatedAppContainer)).not.toBeVisible();
  }

  async expectNavigationToContain(expectedLinks: string[]) {
    const actualLinks = await this.getNavigationLinks();
    for (const expectedLink of expectedLinks) {
      expect(actualLinks).toContain(expectedLink);
    }
  }

  async expectComponentsToBeVisible(expectedComponents: string[]) {
    const visibleComponents = await this.getVisibleComponents();
    for (const component of expectedComponents) {
      expect(visibleComponents).toContain(component);
    }
  }
}