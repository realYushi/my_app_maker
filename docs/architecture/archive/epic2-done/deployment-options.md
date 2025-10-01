# Deployment Options

This guide provides deployment options for different use cases: simple evaluation deployment and full production portfolio deployment.

## Option 1: Simple Evaluation Deployment

**Purpose:** Quick deployment for intern evaluation and demonstration

**Time Required:** ~15 minutes
**Cost:** Free tier sufficient
**Complexity:** Minimal configuration

### Local Development Setup

```bash
# Clone and install dependencies
git clone <your-repo-url>
cd mini-ai-app-builder
npm install

# Start development servers
npm run dev

# Access points
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
# API Health: http://localhost:3001/api/health
```

### Quick Cloud Deployment (Render Free Tier)

**Prerequisites:**

- GitHub repository with your code
- Google AI API key (free tier available)
- Render account (free)

**Step 1: Backend Deployment**

1. **Create Web Service** on Render
2. **Connect GitHub repository**
3. **Configure build settings:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:production`
   - **Root Directory:** `apps/api`
4. **Set environment variables:**
   ```bash
   NODE_ENV=production
   PORT=10000
   GEMINI_API_KEY=your_actual_gemini_key
   GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
   GEMINI_MODEL=gemini-1.5-flash
   ```

**Step 2: Frontend Deployment**

1. **Create Static Site** on Render
2. **Connect GitHub repository**
3. **Configure build settings:**
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `apps/web/dist`
   - **Root Directory:** `apps/web`
4. **Set environment variables:**
   ```bash
   VITE_API_URL=https://your-backend-service.onrender.com
   VITE_NODE_ENV=production
   ```

**Step 3: Test Deployment**

1. **Visit your frontend URL**
2. **Test the generation flow:**
   - Enter: "I want a blog app with posts and comments"
   - Verify AI extraction works
   - Check that mock UI generates correctly

### Evaluation Checklist ✅

- [ ] **Frontend loads** without errors
- [ ] **API connectivity** established
- [ ] **AI integration** working (can generate requirements)
- [ ] **Mock UI generation** displays properly
- [ ] **Responsive design** works on mobile
- [ ] **Error handling** shows user-friendly messages

## Option 2: Production Portfolio Deployment

**Purpose:** Full-featured deployment for portfolio demonstration and CV showcase

**Features Include:**

- MongoDB Atlas integration for data persistence
- Comprehensive monitoring and health checks
- Advanced CORS and security configuration
- E2E testing pipeline integration
- Performance optimization
- Error tracking and logging

**Documentation:** See `docs/architecture/render-deployment-guide.md` for complete production setup

**Additional Components:**

- Database persistence layer
- User session management (Epic 2)
- Advanced UI generation features
- Performance monitoring
- Security hardening

## Deployment Comparison

| Feature        | Simple Evaluation  | Production Portfolio  |
| -------------- | ------------------ | --------------------- |
| **Setup Time** | 15 minutes         | 2-3 hours             |
| **Cost**       | Free               | Free tier + minimal   |
| **Database**   | None (evaluation)  | MongoDB Atlas         |
| **Monitoring** | Basic health check | Full monitoring suite |
| **Security**   | Basic CORS         | Production security   |
| **Features**   | Core functionality | All Epic 1 + Epic 2   |
| **Use Case**   | Intern evaluation  | CV/Portfolio demo     |

## Environment Variables Reference

### Required for Both Deployments

```bash
# Core Application
NODE_ENV=production
PORT=10000

# AI Integration (Required)
GEMINI_API_KEY=your_actual_gemini_key
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
GEMINI_MODEL=gemini-1.5-flash

# Frontend Integration
VITE_API_URL=https://your-backend-service.onrender.com
```

### Additional for Production Portfolio

```bash
# Database (Epic 2)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=mini_ai_app_builder

# Security
CORS_ALLOWED_ORIGINS=https://your-frontend-app.onrender.com

# Monitoring
HEALTH_CHECK_INTERVAL=30000
ERROR_REPORTING_ENABLED=true
```

## Troubleshooting Common Issues

### Build Failures

```bash
# Local debugging
npm run build:api
npm run build:web

# Check for missing dependencies
npm install
```

### CORS Errors

- Verify `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Check that frontend `VITE_API_URL` matches backend URL

### API Connection Issues

- Verify backend service is running
- Check environment variables are set correctly
- Test health endpoint: `https://your-api.onrender.com/api/health`

### AI Integration Failures

- Verify `GEMINI_API_KEY` is valid and active
- Check API quota/rate limits
- Test with curl: `curl -H "Authorization: Bearer $GEMINI_API_KEY" $GEMINI_BASE_URL/models`

## Success Metrics

### Evaluation Deployment Success

- [ ] **Page Load:** <3 seconds
- [ ] **AI Response:** <10 seconds
- [ ] **Mobile Compatible:** Responsive design
- [ ] **Error Free:** No console errors
- [ ] **Functional:** Complete user flow works

### Portfolio Deployment Success

- [ ] **Performance:** Lighthouse score >90
- [ ] **Uptime:** >99% availability
- [ ] **Scalability:** Handles concurrent users
- [ ] **Monitoring:** Health checks passing
- [ ] **Documentation:** Complete setup guide

---

**Recommendation:** Start with Simple Evaluation Deployment for immediate needs, then upgrade to Production Portfolio Deployment for CV enhancement.
