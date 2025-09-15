# Technical Debt & E2E Testing Requirements

**Document Version**: 1.0
**Last Updated**: September 15, 2025
**Context**: Post Epic 1 completion preparation for Epic 2

## Technical Debt Summary

### 🚨 Critical Technical Debt

#### 1. Database Infrastructure (Intentionally Disabled)
**Location**: `apps/api/src/index.ts` lines 34-46
**Status**: Production-ready code exists but commented out
**Impact**: No data persistence for generated apps
**Epic 2 Action Required**:
```typescript
// Currently disabled:
// await databaseService.connect();

// Epic 2: Enable database connection
await databaseService.connect();
```

#### 2. CORS Configuration (Development Only)
**Location**: `apps/api/src/index.ts` lines 13-26
**Current State**: Allows all origins (`"*"`)
**Epic 2 Action Required**:
```typescript
// Replace development CORS with production config
res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
```

#### 3. Environment Configuration
**Missing**: Production environment variable validation
**Epic 2 Requirements**:
- Validate required environment variables on startup
- Create `.env.production` template
- Add environment-specific configurations

### ⚠️ Medium Priority Technical Debt

#### 4. Error Handling Granularity
**Location**: `apps/api/src/services/ai.service.ts`
**Issue**: Generic error messages for production security
**Impact**: Harder debugging in production
**Recommendation**: Implement structured error codes

#### 5. Type Safety Gaps
**Location**: Various API response handling
**Issue**: Some `any` types in error handling paths
**Impact**: Potential runtime type errors

#### 6. Frontend Service Layer
**Location**: `apps/web/src/services/generationService.ts`
**Issue**: Direct fetch calls without retry logic
**Impact**: Network instability handling

## E2E Testing Requirements (Playwright)

### 🎯 Core User Journey Tests

#### Primary Flow: Text-to-UI Generation
```gherkin
Scenario: User generates app from description
  Given user is on the homepage
  When user enters "todo app for students" in text area
  And user clicks "Generate App"
  Then user should see loading state
  And user should see generated app name "Student Task Manager"
  And user should see navigation with roles/features
  And user should see entity forms
  And all forms should be interactive
```

#### Error Handling Flows
```gherkin
Scenario: Empty input validation
  Given user is on the homepage
  When user clicks "Generate App" with empty text
  Then user should see validation error
  And form should not submit

Scenario: API error handling
  Given API service is unavailable
  When user submits valid text
  Then user should see error message
  And user should be able to retry
```

### 🔧 Playwright Setup Requirements

#### Installation & Configuration
```bash
# Epic 2 Setup Commands
npm install --save-dev @playwright/test
npx playwright install
```

#### Test Structure Needed
```
apps/web/
├── e2e/
│   ├── tests/
│   │   ├── generation-flow.spec.ts
│   │   ├── error-handling.spec.ts
│   │   ├── responsive-design.spec.ts
│   │   └── accessibility.spec.ts
│   ├── fixtures/
│   │   └── test-data.ts
│   └── support/
│       └── page-objects/
```

#### Configuration File Needed
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm run dev',
    port: 5173,
  },
});
```

### 🧪 Test Coverage Requirements

#### Must-Have Test Cases
1. **Complete User Journey**: Text input → API call → UI generation
2. **Form Interactions**: Generated forms should be functional
3. **Navigation**: Dynamic tabs/menus work correctly
4. **Responsive Design**: Mobile and desktop layouts
5. **Error Recovery**: Network failures and retry mechanisms
6. **Loading States**: All loading indicators function properly

#### Should-Have Test Cases
1. **Accessibility**: Screen reader compatibility
2. **Performance**: Page load times under 3 seconds
3. **Cross-Browser**: Chrome, Firefox, Safari compatibility
4. **Input Validation**: Various text input edge cases

## Render CI/CD Deployment Readiness

### 🚀 Deployment Configuration Needed

#### 1. Build Scripts Update
**Current**: Development-focused scripts
**Epic 2 Needed**:
```json
{
  "scripts": {
    "build:production": "turbo run build",
    "start:production": "node apps/api/dist/index.js",
    "deploy:render": "npm run build:production && npm run start:production"
  }
}
```

#### 2. Environment Variables for Render
```bash
# Required for production
NODE_ENV=production
GEMINI_API_KEY=<actual_api_key>
MONGODB_URI=<production_mongodb_connection>
FRONTEND_URL=<render_frontend_url>
PORT=<render_assigned_port>
```

#### 3. Render Service Configuration
**API Service**:
- Build Command: `npm install && npm run build`
- Start Command: `npm run start:production`
- Environment: Node.js 18+

**Web Service**:
- Build Command: `npm install && npm run build`
- Publish Directory: `apps/web/dist`
- Environment: Static Site

#### 4. Database Activation Checklist
```typescript
// Epic 2: Enable in apps/api/src/index.ts
async function initializeDatabase(): Promise<void> {
  try {
    await databaseService.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Fail fast in production
  }
}
```

### 🔒 Security Considerations for Production

#### CORS Update Required
```typescript
// Replace development CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://your-app.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

#### Environment Variable Validation
```typescript
// Add to config/index.ts
const requiredEnvVars = [
  'GEMINI_API_KEY',
  'MONGODB_URI',
  'FRONTEND_URL'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

## Epic 2 Implementation Priority

### Phase 1: Testing Infrastructure
1. ✅ Playwright setup and configuration
2. ✅ Core user journey E2E tests
3. ✅ CI/CD integration for test runs

### Phase 2: Production Readiness
1. ✅ Database connection activation
2. ✅ CORS and security configuration
3. ✅ Environment variable validation
4. ✅ Render deployment configuration

### Phase 3: Enhanced Error Handling
1. ✅ Structured error codes
2. ✅ Production-safe error messages
3. ✅ Monitoring and logging improvements

## Success Metrics

### Testing Goals
- **E2E Test Coverage**: 100% of primary user journeys
- **Cross-Browser Support**: Chrome, Firefox, Safari
- **Mobile Compatibility**: Responsive design validation
- **CI/CD Integration**: Automated test runs on deployment

### Deployment Goals
- **Zero-Downtime Deployment**: Render CI/CD pipeline
- **Database Persistence**: User-generated apps saved
- **Production Performance**: <3 second load times
- **Error Recovery**: Graceful handling of service failures

---

**Next Actions**: Ready for Epic 2 implementation with clear technical debt roadmap and comprehensive E2E testing strategy.