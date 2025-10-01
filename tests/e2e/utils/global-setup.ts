import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('Setting up E2E test environment...');

  // Verify environment variables are set for AI service testing
  const aiServiceMockMode = process.env.AI_SERVICE_MOCK_MODE || 'true';
  console.log(`AI Service Mock Mode: ${aiServiceMockMode}`);

  // Set up any global test data or state here
  console.log('Global setup complete');
}

export default globalSetup;
