# Mini AI App Builder - Brownfield Architecture Document

## Introduction

This document captures the **CURRENT STATE** of the Mini AI App Builder codebase as of September 2025, including all improvements from Epic 1, Epic 2, and the Post-Epic 2 refactoring that achieved a 95/100 quality score. It serves as the definitive reference for AI agents working on future enhancements.

### Document Scope

Comprehensive documentation of the entire system, reflecting the actual production-ready architecture that has successfully passed 280 tests with outstanding quality validation.

### Change Log

| Date       | Version | Description                           | Author            |
| ---------- | ------- | ------------------------------------- | ----------------- |
| Sep 16 2025| 1.0     | Initial post-refactoring analysis     | Winston (Architect) |

## Quick Reference - Key Files and Entry Points

### Critical Files for Understanding the System

- **Frontend Entry**: `apps/web/src/main.tsx` (React 18 + Vite)
- **Backend Entry**: `apps/api/src/index.ts` (Express + TypeScript)
- **Configuration**: `apps/api/src/config/index.ts` (Centralized config service)
- **Core AI Pipeline**: `apps/api/src/services/ai.service.ts` (Google Gemini integration)
- **UI Generation**: `apps/web/src/services/componentFactory.tsx` (Dynamic component creation)
- **Context Detection**: `apps/web/src/services/contextDetectionService.ts` (Domain-aware UI selection)
- **Shared Types**: `packages/shared-types/` (Full type safety across stack)

### Key Algorithms & Complex Logic

- **Domain Detection**: `apps/api/src/routes/generate.ts` (lines 28-77) - Sophisticated text analysis for app domain classification
- **Component Factory**: `apps/web/src/services/componentFactory.tsx` - Dynamic React component generation
- **Context-Aware UI**: `apps/web/src/services/contextDetectionService.ts` - Intelligent component selection
- **Error Boundaries**: `apps/web/src/components/ErrorBoundary.tsx` - Production-grade error handling

## High Level Architecture

### Technical Summary

**Mini AI App Builder** is a sophisticated full-stack TypeScript application that transforms natural language descriptions into structured app requirements and generates context-aware mock UIs using Google Gemini AI. The system demonstrates production-grade architecture with 280 passing tests and professional development practices.

### Actual Tech Stack (Post-Refactoring)

| Category          | Technology           | Version  | Notes                                    |
| ----------------- | -------------------- | -------- | ---------------------------------------- |
| **Frontend**      | React                | 18.2.0   | With TypeScript + hooks patterns        |
| **Build Tool**    | Vite                 | 7.1.2    | Lightning-fast development server        |
| **Styling**       | Tailwind CSS         | 3.4.0    | + HeadlessUI for accessible components  |
| **Backend**       | Node.js + Express    | 4.18.0   | TypeScript throughout                    |
| **AI Integration**| Google Gemini        | 2.5-flash| Production-grade with error handling    |
| **Database**      | MongoDB              | 7.6.0    | Optional with graceful degradation      |
| **Testing**       | Jest + Vitest + Playwright | Various | 280 tests passing (exceptional coverage) |
| **Monorepo**      | Turbo + npm workspaces | 2.0.0  | Optimized build orchestration           |
| **Security**      | CORS + Rate Limiting | Latest   | Production-ready configurations         |

### Repository Structure Reality Check

- **Type**: Monorepo (Turbo + npm workspaces)
- **Package Manager**: npm (v10.0.0)
- **Node Requirement**: >=18.0.0
- **Notable**: Clean separation with shared types package ensuring type safety across boundaries

## Source Tree and Module Organization

### Project Structure (Actual)

```text
mini-ai-app-builder/
├── apps/
│   ├── web/                     # React frontend (Vite + TypeScript)
│   │   ├── src/
│   │   │   ├── components/      # React Error Boundaries + reusable UI
│   │   │   ├── features/        # Domain-specific UI generation
│   │   │   │   └── generation/  # Main app generation workflow
│   │   │   ├── services/        # Frontend business logic
│   │   │   │   ├── componentFactory.tsx      # Dynamic React component creation
│   │   │   │   ├── contextDetectionService.ts # Intelligent domain detection
│   │   │   │   └── generationService.ts       # API communication layer
│   │   │   ├── contexts/        # React Context for state management
│   │   │   └── types/           # Frontend-specific types
│   │   └── package.json         # Frontend dependencies
│   └── api/                     # Express backend (TypeScript)
│       ├── src/
│       │   ├── config/          # Environment-aware configuration
│       │   ├── middleware/      # Error handling + CORS
│       │   ├── routes/          # API endpoints with rate limiting
│       │   │   └── generate.ts  # Main AI generation endpoint
│       │   ├── services/        # Backend business logic
│       │   │   └── ai.service.ts # Google Gemini integration
│       │   └── index.ts         # Express app entry point
│       └── package.json         # Backend dependencies
├── packages/
│   └── shared-types/            # Shared TypeScript definitions
├── docs/                        # Comprehensive documentation
│   ├── architecture/            # Technical architecture docs
│   ├── prd/                     # Product requirements & epics
│   ├── qa/                      # Quality assurance reports
│   └── stories/                 # Development stories
├── e2e-tests/                   # Playwright end-to-end tests
├── tests/                       # Additional test utilities
├── turbo.json                   # Monorepo build configuration
└── package.json                 # Root workspace configuration
```

### Key Modules and Their Purpose

#### Frontend Core (`apps/web/src/`)

- **ComponentFactory** (`services/componentFactory.tsx`) - **CRITICAL**: Dynamic React component generation engine that creates domain-specific UIs based on AI extraction results
- **Context Detection** (`services/contextDetectionService.ts`) - Intelligent domain classification for context-aware component selection
- **Generation Service** (`services/generationService.ts`) - Frontend API client with error handling and response formatting
- **Error Boundaries** (`components/ErrorBoundary.tsx`) - Production-grade error isolation with graceful fallbacks and retry mechanisms

#### Backend Core (`apps/api/src/`)

- **AI Service** (`services/ai.service.ts`) - **CRITICAL**: Google Gemini integration with structured prompt engineering and robust error handling
- **Generate Route** (`routes/generate.ts`) - Main API endpoint with sophisticated domain detection, simple prompt filtering, and rate limiting
- **Configuration Service** (`config/index.ts`) - Environment-aware configuration management following coding standards
- **Error Handler** (`middleware/errorHandler.ts`) - Centralized error processing with appropriate logging

#### Shared Infrastructure

- **Shared Types** (`packages/shared-types/`) - TypeScript interfaces ensuring type safety across frontend/backend boundaries
- **Testing Infrastructure** - 280 comprehensive tests across Jest (API), Vitest (frontend), and Playwright (E2E)

## Data Models and APIs

### Data Models

**Core AI Generation Types** - See `packages/shared-types/src/generation.ts`:
- `GenerationResult` - Main AI output structure with app metadata, entities, and features
- `AppEntity` - Structured data about business entities (users, products, etc.)
- `AppFeature` - Functional requirements with CRUD operations and role permissions

**Component Generation Types** - See `apps/web/src/types/`:
- Component metadata for dynamic UI generation
- Context-specific styling and layout configurations
- Error boundary state management types

### API Specifications

#### Core Generation Endpoint

**POST `/api/generate`**
- **Rate Limited**: 10 req/min (production), 100 req/min (development)
- **Input**: `{ text: string }` (max 10,000 characters)
- **Output**: `GenerationResult` with structured app requirements
- **Validation**: Sophisticated simple prompt detection with context-specific guidance
- **Domain Detection**: 9 specialized domains (restaurant, ecommerce, healthcare, etc.)

#### Error Responses

Standardized error format with contextual guidance:
```typescript
{
  error: string;    // Error type
  message: string;  // User-friendly message with domain-specific suggestions
}
```

## Technical Debt and Known Issues

### Post-Refactoring Status: EXCELLENT

The September 2025 refactoring achieved **95/100 quality score** and addressed all critical technical debt:

#### ✅ **RESOLVED ISSUES**
1. **CORS Configuration** - Now environment-aware with proper production settings
2. **Rate Limiting** - Production-grade implementation with environment-specific limits
3. **MongoDB Infrastructure** - Cleaned up with graceful degradation approach
4. **Component Performance** - React optimization with memo, useMemo, useCallback
5. **Error Handling** - Comprehensive error boundaries with graceful fallbacks

#### 🔮 **FUTURE ENHANCEMENT OPPORTUNITIES**
1. **Virtual Scrolling** - Consider for large dataset components (identified by QA)
2. **Performance Monitoring** - Dashboard implementation for production metrics
3. **Advanced AI Features** - Enhanced context detection or multi-model support

### Current Architecture Strengths

- **280 tests passing** with exceptional coverage
- **Clean separation of concerns** across all layers
- **Production-ready security** implementations
- **Professional-grade error handling**
- **Optimized React performance** patterns

## Integration Points and External Dependencies

### External Services

| Service        | Purpose            | Integration Type | Key Files                          |
| -------------- | ------------------ | ---------------- | ---------------------------------- |
| Google Gemini  | AI text processing | REST API         | `apps/api/src/services/ai.service.ts` |
| Environment Config | Configuration   | Environment vars | `apps/api/src/config/index.ts`    |

### Internal Integration Points

- **Frontend ↔ Backend**: RESTful API on port 3001 with CORS and rate limiting
- **Type Safety**: Shared types package ensures compile-time validation across boundaries
- **State Management**: React Context for frontend state with proper typing
- **Error Propagation**: Structured error handling from AI service through to UI

### Build Integration

- **Turbo Monorepo**: Optimized build orchestration with dependency management
- **TypeScript**: Full type safety with strict mode across all packages
- **Testing Pipeline**: Integrated Jest + Vitest + Playwright with comprehensive coverage

## Development and Deployment

### Local Development Setup

**Working Setup (Post-Refactoring):**
```bash
# Prerequisites: Node.js >=18.0.0, npm >=10.0.0
npm install                    # Install all workspace dependencies
npm run dev                    # Start both frontend and backend
# Frontend: http://localhost:5173
# Backend: http://localhost:3001
```

**Environment Variables Required:**
```bash
# Backend (.env in apps/api/)
GEMINI_API_KEY=your_gemini_key        # Required for AI functionality
NODE_ENV=development|production       # Environment-aware configurations
PORT=3001                            # API server port
FRONTEND_URL=https://your-domain.com  # Production CORS origin
```

### Build and Deployment Process

**Build Commands:**
```bash
npm run build                  # Build all packages (Turbo orchestrated)
npm run test                   # Run complete test suite (280 tests)
npm run lint                   # ESLint validation
```

**Deployment Options:**
- **Simple**: Local development server (above)
- **Production**: See `docs/architecture/render-deployment-guide.md` for cloud deployment
- **Advanced**: Full production setup in `docs/architecture/deployment-options.md`

## Testing Reality

### Current Test Coverage (Exceptional)

**280 Tests Passing** (522% above minimum targets):
- **Frontend Tests**: 265 tests (Vitest + React Testing Library)
- **Backend Tests**: 15 tests (Jest + Supertest)
- **E2E Tests**: Playwright integration
- **Quality Score**: 95/100 from QA validation

### Test Categories

1. **Unit Tests**: Component logic, service functions, utility methods
2. **Integration Tests**: API endpoint testing, error boundary behavior
3. **Performance Tests**: Response time validation, memory leak detection
4. **E2E Tests**: Complete user workflows, AI generation pipeline

### Running Tests

```bash
# Complete test suite
npm test                       # All 280 tests across workspaces

# Specific test categories
npm run test --workspace apps/web      # Frontend tests (265)
npm run test --workspace apps/api      # Backend tests (15)
npm run test:e2e                      # Playwright E2E tests

# Development testing
npm run test:watch --workspace apps/web  # Watch mode for frontend
npm run test:coverage                    # Coverage reports
```

## AI Pipeline Architecture

### Core AI Workflow

**Input Processing:**
1. **Domain Detection** - Sophisticated text analysis classifying user input into 9 specialized domains
2. **Simple Prompt Filtering** - Intelligent detection of insufficient detail with context-specific guidance
3. **Validation** - Input sanitization, length limits, and format validation

**AI Processing:**
1. **Structured Prompting** - Google Gemini integration with carefully engineered prompts
2. **Error Handling** - Robust retry logic, timeout management, and graceful degradation
3. **Response Parsing** - Type-safe conversion to `GenerationResult` format

**UI Generation:**
1. **Context Detection** - Frontend service determines optimal UI patterns
2. **Component Factory** - Dynamic React component generation based on domain and entities
3. **Error Boundaries** - Isolated error handling for each generated component

### Domain-Specific Intelligence

The system provides specialized handling for:
- **Restaurant/Food Service** - Menu management, ordering, kitchen operations
- **E-commerce** - Product catalogs, shopping carts, payment processing
- **Healthcare** - Appointments, patient records, prescriptions
- **Education** - Course management, assignments, grading
- **+ 5 additional domains** with context-specific UI patterns

## Performance and Optimization

### Current Performance Profile

**Bundle Size (Optimized):**
- **Production Build**: 279.94 kB (gzipped: 77.88 kB)
- **React Optimizations**: memo, useMemo, useCallback implemented
- **Bundle Analysis**: Available via `npm run build -- --analyze`

**API Performance:**
- **Target Response Time**: <2s for AI generation
- **Rate Limiting**: Production-grade with environment-aware settings
- **Monitoring**: Response time logging and performance metrics

**Frontend Optimizations:**
- **Component Memoization**: Prevents unnecessary re-renders
- **Lazy Loading**: Ready for implementation with component factory
- **Error Isolation**: Error boundaries prevent cascade failures

## Security Implementation

### Production-Ready Security Features

**CORS Configuration:**
- Environment-aware origin settings
- Production: Specific frontend URL only
- Development: Multiple localhost ports supported
- Credentials and preflight handling properly configured

**Rate Limiting:**
- Production: 10 requests/minute per IP
- Development: 100 requests/minute per IP
- Standardized error responses with appropriate headers

**Input Validation:**
- Request body sanitization and type checking
- Maximum input length enforcement (10,000 characters)
- SQL injection and XSS prevention through type safety

**Error Handling:**
- No sensitive information exposure in error responses
- Centralized error processing with appropriate logging
- Graceful degradation for external service failures

## Future Enhancement Preparation

### Recommended Next Steps

Based on the QA report and current architecture:

1. **Performance Monitoring Dashboard** - Build on existing response time logging
2. **Virtual Scrolling Implementation** - Enhance component factory for large datasets
3. **Advanced AI Features** - Multi-model support or enhanced context detection
4. **Enhanced Error Analytics** - Build on comprehensive error boundary system

### Architecture Extensibility

**Well-Positioned For:**
- **New AI Models** - Clean service abstraction allows easy provider switching
- **Additional Domains** - Pattern established for new domain-specific UI generation
- **Enhanced UI Components** - Component factory designed for extensibility
- **Performance Scaling** - Solid foundation with monitoring and optimization patterns

### Integration Ready

- **Database Integration** - MongoDB gracefully degraded, can be re-enabled
- **Authentication** - User management domain patterns available
- **Payment Processing** - E-commerce domain provides foundation
- **Real-time Features** - Architecture supports WebSocket integration

## Appendix - Useful Commands and Scripts

### Frequently Used Commands

```bash
# Development
npm run dev                    # Start development servers (Turbo)
npm run build                  # Production build all packages
npm test                       # Run complete test suite (280 tests)

# Maintenance
npm run lint                   # ESLint validation
npm run test:coverage          # Test coverage reports
npm run test:e2e               # End-to-end testing

# Analysis
npm run build -- --analyze    # Bundle size analysis (frontend)
npm run test:watch             # Development testing with watch mode
```

### Debugging and Troubleshooting

**Environment Issues:**
- Verify Node.js >=18.0.0 and npm >=10.0.0
- Check `GEMINI_API_KEY` configuration for AI functionality
- Ensure proper CORS configuration for cross-origin requests

**Common Development Tasks:**
- **Adding new domains**: Update domain detection in `apps/api/src/routes/generate.ts`
- **New UI components**: Extend component factory in `apps/web/src/services/componentFactory.tsx`
- **API changes**: Update shared types in `packages/shared-types/`

**Testing:**
- All 280 tests must pass before any deployment
- Use watch mode for rapid development feedback
- E2E tests validate complete user workflows

---

## Summary

This Mini AI App Builder represents a **production-ready, professionally architected system** that has successfully completed Epic 1, Epic 2, and comprehensive refactoring with a 95/100 quality score. The codebase demonstrates advanced full-stack development practices, comprehensive testing strategies, and sophisticated AI integration patterns.

**Key Strengths:**
- ✅ **280 tests passing** with exceptional quality validation
- ✅ **Production-ready security** with CORS and rate limiting
- ✅ **Advanced React patterns** with performance optimization
- ✅ **Sophisticated AI pipeline** with domain-aware processing
- ✅ **Professional architecture** with clean separation of concerns

**Ready For:** Next epic development, production deployment, portfolio demonstration, and continuous enhancement.

**Architecture Quality:** This system provides an excellent foundation for AI-powered application development and demonstrates professional-grade software engineering practices throughout.