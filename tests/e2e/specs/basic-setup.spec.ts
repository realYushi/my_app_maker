import { test, expect } from '@playwright/test';

test.describe('Basic E2E Setup Test', () => {
  test('should load the application homepage', async ({ page }) => {
    await page.goto('/');

    // Check if the page loads
    await expect(page).toHaveTitle(/Mini AI App Builder/);

    // Check if the main form is present
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show placeholder text in textarea', async ({ page }) => {
    await page.goto('/');

    const textarea = page.locator('textarea[name="description"]');
    await expect(textarea).toHaveAttribute('placeholder', /Tell us about your app idea/);
  });

  test('should disable generate button when textarea is empty', async ({ page }) => {
    await page.goto('/');

    const generateButton = page.locator('button[type="submit"]');
    await expect(generateButton).toBeDisabled();
  });

  test('should enable generate button when textarea has content', async ({ page }) => {
    await page.goto('/');

    const textarea = page.locator('textarea[name="description"]');
    const generateButton = page.locator('button[type="submit"]');

    await textarea.fill('Test app description');
    await expect(generateButton).toBeEnabled();
  });
});
