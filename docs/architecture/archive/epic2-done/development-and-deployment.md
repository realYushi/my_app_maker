# Development and Deployment

## Local Development Setup

**Prerequisites**:
- Node.js >=18.0.0
- npm 10.0.0+

**Setup Steps**:
1. `npm install` (installs all workspace dependencies)
2. Create `.env` files in `apps/api/` (optional for mock mode)
3. `npm run dev` (starts both API and web servers)

**Development Commands**:
```bash
npm run dev         # Start both API and web dev servers
npm run build       # Build all packages for production
npm run test        # Run all tests (81 tests currently passing)
npm run lint        # Run ESLint across all packages
```

## Build and Deployment Process

**Current State**: Development-ready, **not yet production-deployed**

**Build Configuration**:
- **API**: TypeScript compilation to `dist/` folder
- **Web**: Vite production build with optimizations
- **Shared Types**: TypeScript compilation with watch mode

**Known Deployment Requirements**:
- Environment variables for Gemini API key
- CORS configuration update for production origins
- Port configuration for hosting platform
