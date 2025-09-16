# Render CI/CD Deployment Readiness Guide

**Document Version**: 1.0
**Last Updated**: September 15, 2025
**Status**: Ready for Epic 2 deployment preparation

## 🚀 Render Deployment Architecture

### Service Configuration Overview

The Mini AI App Builder will deploy as **two separate Render services**:

1. **Web Service** (Static Site): React frontend
2. **Web Service** (Node.js): Express API backend
3. **Database**: MongoDB Atlas (external)

### Deployment Topology
```
[Frontend Static Site] → [Backend API Service] → [MongoDB Atlas]
     (5173/443)              (3001/10000)         (External)
```

## 📋 Pre-Deployment Checklist

### ✅ Code Readiness Assessment

#### Epic 1 Status - Ready for Deployment
- [x] **Build System**: Turbo + npm workspaces configured
- [x] **TypeScript**: All packages compile successfully
- [x] **Test Suite**: 81 tests passing
- [x] **Environment Handling**: Configuration system in place
- [x] **Error Handling**: Comprehensive error boundaries

#### Epic 2 Requirements - Need Implementation
- [ ] **Database Connection**: Currently disabled (intentional)
- [ ] **CORS Configuration**: Development settings active
- [ ] **Environment Validation**: Production environment checks
- [ ] **E2E Testing**: Playwright setup needed

## 🔧 Render Service Configurations

### 1. Backend API Service Configuration

#### Render Service Settings
```yaml
Name: mini-ai-app-builder-api
Type: Web Service
Environment: Node
Region: Oregon (or closest to users)
Branch: main (or production)
```

#### Build Configuration
```bash
# Build Command
npm install && npm run build

# Start Command
npm run start:production

# Root Directory
apps/api
```

#### Environment Variables (Required)
```bash
# Core Application
NODE_ENV=production
PORT=10000

# AI Integration
GEMINI_API_KEY=<your_actual_gemini_key>
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
GEMINI_MODEL=gemini-1.5-flash

# Database (Epic 2)
MONGODB_URI=<mongodb_atlas_connection_string>
DB_NAME=mini_ai_app_builder

# Frontend Integration
FRONTEND_URL=https://your-frontend-app.onrender.com

# Security
CORS_ALLOWED_ORIGINS=https://your-frontend-app.onrender.com
```

### 2. Frontend Web Service Configuration

#### Render Service Settings
```yaml
Name: mini-ai-app-builder-web
Type: Static Site
Environment: Static
Region: Oregon (same as API)
Branch: main (or production)
```

#### Build Configuration
```bash
# Build Command
npm install && npm run build

# Publish Directory
apps/web/dist

# Root Directory
apps/web
```

#### Environment Variables (Build Time)
```bash
# API Integration
VITE_API_URL=https://your-api-service.onrender.com

# Environment
VITE_NODE_ENV=production
```

### 3. Database Setup (MongoDB Atlas)

#### Recommended Configuration
```yaml
Provider: MongoDB Atlas
Tier: M0 (Free) or M2 (Shared)
Region: Oregon (match Render services)
```

#### Connection Setup
1. Create MongoDB Atlas cluster
2. Configure network access (allow Render IPs)
3. Create database user with readWrite permissions
4. Get connection string for MONGODB_URI

## 📝 Required Code Changes for Production

### 1. Package.json Scripts Update

#### Root package.json
```json
{
  "scripts": {
    "build": "turbo run build",
    "build:api": "cd apps/api && npm run build",
    "build:web": "cd apps/web && npm run build",
    "start:production": "cd apps/api && npm run start",
    "deploy:api": "npm run build:api && npm run start:production",
    "deploy:web": "npm run build:web"
  }
}
```

#### apps/api/package.json
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "start:production": "NODE_ENV=production node dist/index.js"
  }
}
```

### 2. CORS Configuration Update

#### File: `apps/api/src/index.ts`
**Replace lines 13-26 with:**
```typescript
import cors from 'cors';

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || [
  process.env.FRONTEND_URL || 'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));
```

### 3. Database Connection Activation

#### File: `apps/api/src/index.ts`
**Replace lines 34-46 with:**
```typescript
async function initializeDatabase(): Promise<void> {
  try {
    await databaseService.connect();
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1); // Fail fast in production
    } else {
      console.warn("⚠️ Continuing without database in development");
    }
  }
}

// Initialize database before starting server
if (require.main === module) {
  initializeDatabase().then(() => {
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });
  });
}
```

### 4. Environment Configuration Updates

#### File: `apps/api/src/config/index.ts`
**Add production validation:**
```typescript
// Validate required environment variables in production
if (process.env.NODE_ENV === 'production') {
  const requiredVars = [
    'GEMINI_API_KEY',
    'MONGODB_URI',
    'FRONTEND_URL'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    process.exit(1);
  }
}

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mini_ai_app_builder',
    name: process.env.DB_NAME || 'mini_ai_app_builder'
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || 'test_key',
    baseUrl: process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    timeout: parseInt(process.env.GEMINI_TIMEOUT || '30000')
  }
};
```

### 5. Frontend Environment Configuration

#### File: `apps/web/src/config/index.ts` (Create this file)
```typescript
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  environment: import.meta.env.VITE_NODE_ENV || 'development'
};
```

#### Update: `apps/web/src/services/generationService.ts`
```typescript
import { config } from '../config';

// Replace hardcoded URL with config
const API_BASE_URL = config.apiUrl;
```

## 🔄 Deployment Process

### Step-by-Step Deployment

#### Phase 1: Database Setup
1. Create MongoDB Atlas cluster
2. Configure network access
3. Create database and user
4. Test connection string

#### Phase 2: API Service Deployment
1. Create Render Web Service for API
2. Connect GitHub repository
3. Configure build settings
4. Set environment variables
5. Deploy and test endpoint

#### Phase 3: Frontend Deployment
1. Create Render Static Site
2. Configure build settings with API URL
3. Set build environment variables
4. Deploy and test full application

#### Phase 4: Integration Testing
1. Test complete user flow
2. Verify API connectivity
3. Check database persistence
4. Monitor error logs

### Monitoring and Health Checks

#### API Health Check Endpoint
**Add to `apps/api/src/routes/`:**
```typescript
// health.ts
import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: 'connected' // Check actual DB connection
  });
});
```

#### Render Service Monitoring
- **Custom Health Check**: `/api/health`
- **Auto-Deploy**: Enable for main branch
- **Notifications**: Configure for deployment failures

## 🔍 Post-Deployment Verification

### Checklist for Go-Live
- [ ] **Frontend Loading**: React app loads correctly
- [ ] **API Connectivity**: Frontend can reach backend
- [ ] **Database Operations**: Data persists correctly
- [ ] **AI Integration**: Gemini API calls succeed
- [ ] **Error Handling**: Graceful error responses
- [ ] **CORS Policy**: No browser console errors
- [ ] **Mobile Responsive**: Mobile interface works
- [ ] **Performance**: Page load under 3 seconds

### Performance Monitoring
```bash
# API Response Times
curl -w "@curl-format.txt" -o /dev/null -s "https://your-api.onrender.com/api/health"

# Frontend Load Times
# Use Lighthouse for performance auditing
```

## 🚨 Troubleshooting Common Issues

### Common Deployment Problems

#### 1. Build Failures
**Symptom**: Build fails on Render
**Solution**: Check build logs, verify dependencies
```bash
# Debug locally
npm run build:api
npm run build:web
```

#### 2. CORS Errors
**Symptom**: Frontend can't reach API
**Solution**: Verify CORS_ALLOWED_ORIGINS includes frontend URL

#### 3. Database Connection Failures
**Symptom**: API starts but database operations fail
**Solution**: Check MongoDB Atlas network access and connection string

#### 4. Environment Variable Issues
**Symptom**: Configuration errors at runtime
**Solution**: Verify all required environment variables are set

### Rollback Strategy

#### Quick Rollback Process
1. **Render Dashboard**: Revert to previous deployment
2. **Environment Check**: Verify previous environment variables
3. **Database State**: Check if database changes need reverting
4. **Monitor**: Watch error logs for stability

## 📊 Success Metrics

### Deployment KPIs
- **Deployment Time**: <10 minutes for both services
- **Uptime**: >99.9% after stabilization
- **Response Time**: API <500ms, Frontend <3s load
- **Error Rate**: <1% of requests

### Business Metrics
- **User Journey Completion**: >95% successful generations
- **Mobile Usage**: Responsive design working
- **AI Success Rate**: >98% valid JSON responses

---

**Status**: Configuration ready for Epic 2 deployment. All infrastructure pieces identified and documented.