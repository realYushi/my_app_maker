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
- **Testing:** Vitest + React Testing Library

### Key Frontend Components
- `features/generation/` - Core AI generation functionality
- `components/` - Reusable UI components
- `contexts/` - React contexts for state management
- `services/` - API client services
- `types/` - Frontend-specific type definitions

## Backend Architecture (apps/api)
- **Framework:** Express.js with TypeScript
- **Build Tool:** TypeScript compiler (tsc)
- **Database:** MongoDB with Mongoose ODM
- **AI Integration:** OpenAI SDK (transitioning from Google Gemini)
- **Testing:** Jest with Supertest for API testing
- **Security:** Rate limiting, CORS, proper error handling

### Key Backend Modules
- `src/services/` - Business logic and AI services
- `src/routes/` - API route definitions
- `src/middleware/` - Express middleware
- `src/models/` - MongoDB/Mongoose models
- `src/__tests__/` - API tests

## Shared Architecture
- **Package:** shared-types ensures type safety across apps
- **Build System:** Turborepo for efficient monorepo builds
- **Package Manager:** npm workspaces for dependency management

## Data Flow
1. User enters app description in frontend
2. Frontend sends request to API /api/generate endpoint
3. API processes with AI service to extract requirements
4. API returns structured app requirements
5. Frontend generates dynamic UI based on requirements

## AI Integration Architecture
- **Service Layer:** AIService handles AI API communication
- **Prompt Engineering:** Structured prompts for consistent output
- **Response Parsing:** Type-safe parsing of AI responses
- **Error Handling:** Graceful fallbacks for AI failures

## Testing Architecture
- **Unit Tests:** Component and function-level tests
- **Integration Tests:** API endpoint and service tests
- **E2E Tests:** Full user journey tests with Playwright
- **Test Coverage:** Comprehensive coverage reporting

## Deployment Architecture
- **Frontend:** Static build deployment (Vercel, Netlify, etc.)
- **Backend:** Node.js service deployment (Render, Heroku, etc.)
- **Database:** MongoDB Atlas for cloud database
- **CI/CD:** GitHub Actions or similar for automated deployment