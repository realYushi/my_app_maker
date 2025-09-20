# Architecture Overview - Mini AI App Builder

## Monorepo Structure

```
my_app_maker/
├── apps/
│   ├── web/          # React frontend
│   └── api/          # Node.js Express API
├── packages/
│   └── shared-types/ # TypeScript types shared across apps
├── docs/             # Documentation
├── e2e-tests/        # End-to-end tests
└── turbo.json        # Turborepo configuration
```

## Frontend Architecture (apps/web)

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite for fast development and building
- **Routing:** Client-side routing within components
- **State Management:** React hooks and context for local state
- **Styling:** Tailwind CSS with Headless UI components
- **Testing:** Vitest + React Testing Library (312 tests passing)
- **Component System:** Plugin architecture with domain-specific components

### Key Frontend Components

- `features/generation/` - Core AI generation functionality
- `components/` - Reusable UI components with error boundaries
- `contexts/` - React contexts for state management
- `services/` - API client services with caching
- `config/` - Domain-specific component configurations
- `types/` - Frontend-specific type definitions

## Backend Architecture (apps/api)

- **Framework:** Express.js with TypeScript
- **Build Tool:** TypeScript compiler (tsc)
- **Database:** MongoDB with Mongoose ODM
- **AI Integration:** OpenAI SDK with x-ai/grok-4-fast:free via OpenRouter
- **Testing:** Jest with comprehensive API testing (45 tests passing)
- **Security:** Rate limiting, CORS, proper error handling
- **Configuration:** Environment-based config service

### Key Backend Modules

- `src/services/` - Business logic and AI services
- `src/routes/` - API route definitions
- `src/middleware/` - Express middleware with error handling
- `src/models/` - MongoDB/Mongoose models
- `src/config/` - Configuration service for environment variables
- `src/__tests__/` - Comprehensive API tests

## Shared Architecture

- **Package:** shared-types ensures type safety across apps
- **Build System:** Turborepo for efficient monorepo builds
- **Package Manager:** npm workspaces for dependency management
- **Error Handling:** Centralized error logging and boundary system
- **Code Quality:** ESLint + Prettier with pre-commit hooks

## Data Flow

1. User enters app description in frontend
2. Frontend sends request to API /api/generate endpoint
3. API processes with AI service using structured prompts
4. AI service returns typed responses with error handling
5. Frontend generates dynamic UI using plugin architecture
6. Component factory selects appropriate domain components
7. UI renders with performance optimizations and error boundaries

## AI Integration Architecture

- **Service Layer:** AIService handles OpenAI SDK communication
- **Prompt Engineering:** Structured prompts for consistent output
- **Response Parsing:** Type-safe parsing of AI responses
- **Error Handling:** Graceful fallbacks and retry logic
- **Model Configuration:** Flexible model selection via environment

## Testing Architecture

- **Unit Tests:** Component and function-level tests (357 total)
- **Integration Tests:** API endpoint and service tests
- **E2E Tests:** Full user journey tests with Playwright
- **Test Coverage:** Comprehensive coverage across all layers
- **Mock Strategy:** AI service mocking for reliable testing

## Plugin Architecture

- **Domain Components:** Modular component registration system
- **Configuration Files:** Separate configs for each domain
- **Component Factory:** Intelligent component selection
- **Extensibility:** Easy addition of new domains and components

## Performance Optimizations

- **React.memo:** Strategic memoization in GeneratedApp
- **Component Caching:** Cached component selection
- **Virtual Scrolling:** For large entity lists
- **Loading States:** Better perceived performance
- **Context Optimization:** Efficient context detection

## Deployment Architecture

- **Frontend:** Static build deployment ready
- **Backend:** Node.js service deployment ready
- **Database:** MongoDB Atlas integration
- **Environment:** Development and production configurations
- **CI/CD:** Ready for automated deployment pipelines
