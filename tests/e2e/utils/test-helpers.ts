import { devices } from '@playwright/test';

/**
 * Test utilities and helpers for E2E tests
 */

// Viewport configurations for responsive testing
export const viewports = {
  mobile: devices['iPhone 12'].viewport!,
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
  widescreen: { width: 2560, height: 1440 }
};

// Test timeouts
export const timeouts = {
  short: 5000,
  medium: 10000,
  long: 30000,
  generation: 30000
};

// Test data validation helpers
export const validators = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isValidEntityName: (name: string): boolean => {
    return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(name);
  },

  hasMinimumFields: (entity: any, minFields: number): boolean => {
    return entity.fields && Array.isArray(entity.fields) && entity.fields.length >= minFields;
  }
};

// Performance measurement utilities
export const performance = {
  measureGenerationTime: async (page: any, action: () => Promise<void>): Promise<number> => {
    const startTime = Date.now();
    await action();
    return Date.now() - startTime;
  },

  waitForStablePerformance: async (page: any, stabilityDuration: number = 2000): Promise<void> => {
    await page.waitForFunction(
      (duration) => {
        return new Promise(resolve => {
          let stable = true;
          const checkStability = () => {
            const now = performance.now();
            if (stable) {
              setTimeout(() => resolve(true), duration);
            }
          };

          // Monitor for network activity
          if (navigator.onLine) {
            checkStability();
          }
        });
      },
      stabilityDuration
    );
  }
};

// Component detection utilities
export const components = {
  getComponentSelectors: () => ({
    productCard: '[data-testid="product-card"]',
    shoppingCart: '[data-testid="shopping-cart"]',
    userProfile: '[data-testid="user-profile"]',
    userManagementTable: '[data-testid="user-management-table"]',
    adminDashboard: '[data-testid="admin-dashboard"]',
    entityForm: '[data-testid="entity-form"]',
    navigation: '[data-testid="navigation"]',
    navigationLink: '[data-testid="nav-link"]'
  }),

  detectContext: async (page: any): Promise<'ecommerce' | 'user-management' | 'admin' | 'fallback'> => {
    const selectors = components.getComponentSelectors();

    if (await page.isVisible(selectors.productCard) || await page.isVisible(selectors.shoppingCart)) {
      return 'ecommerce';
    }

    if (await page.isVisible(selectors.userProfile) || await page.isVisible(selectors.userManagementTable)) {
      return 'user-management';
    }

    if (await page.isVisible(selectors.adminDashboard)) {
      return 'admin';
    }

    return 'fallback';
  }
};

// Test reporting utilities
export const reporting = {
  createTestSummary: (testName: string, startTime: number, endTime: number, status: 'passed' | 'failed', details?: any) => {
    return {
      testName,
      duration: endTime - startTime,
      status,
      timestamp: new Date().toISOString(),
      details: details || {}
    };
  },

  logPerformanceMetric: (metricName: string, value: number, unit: string = 'ms') => {
    console.log(`[PERFORMANCE] ${metricName}: ${value}${unit}`);
  },

  logComponentDetection: (components: string[], context: string) => {
    console.log(`[COMPONENTS] Context: ${context}, Detected: ${components.join(', ')}`);
  }
};

// Error handling utilities
export const errors = {
  capturePageState: async (page: any, testName: string) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${testName}-${timestamp}`;

    // Capture screenshot
    await page.screenshot({ path: `tests/e2e/reports/screenshots/${filename}.png` });

    // Capture console logs
    const logs: string[] = [];
    page.on('console', (msg: any) => logs.push(`${msg.type()}: ${msg.text()}`));

    // Capture network requests
    const requests: any[] = [];
    page.on('request', (request: any) => {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers()
      });
    });

    return {
      screenshot: `${filename}.png`,
      logs,
      requests,
      url: page.url(),
      timestamp: new Date().toISOString()
    };
  }
};

// Accessibility testing utilities
export const accessibility = {
  checkBasicA11y: async (page: any) => {
    // Check for basic accessibility requirements
    const issues: string[] = [];

    // Check for alt text on images
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    if (imagesWithoutAlt > 0) {
      issues.push(`${imagesWithoutAlt} images missing alt text`);
    }

    // Check for form labels
    const inputsWithoutLabels = await page.locator('input:not([aria-label]):not([aria-labelledby])').count();
    if (inputsWithoutLabels > 0) {
      issues.push(`${inputsWithoutLabels} inputs missing labels`);
    }

    // Check for heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
    if (headings === 0) {
      issues.push('No headings found');
    }

    return issues;
  }
};