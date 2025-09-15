# Source Tree and Module Organization

## Project Structure (Actual)

```text
mini-ai-app-builder/
├── apps/
│   ├── api/                    # Backend Express server
│   │   ├── src/
│   │   │   ├── __tests__/      # Jest unit tests (3 test files)
│   │   │   ├── config/         # Environment configuration
│   │   │   ├── middleware/     # Express middleware (CORS, error handling)
│   │   │   ├── models/         # Database models (DISABLED - MongoDB ready)
│   │   │   ├── routes/         # API route handlers (/api/generate)
│   │   │   ├── services/       # Business logic (AI, database, error logging)
│   │   │   └── index.ts        # Server entry point
│   │   └── package.json
│   └── web/                    # React frontend
│       ├── src/
│       │   ├── contexts/       # React Context for state management
│       │   ├── features/       # Feature-based component organization
│       │   │   └── generation/ # Core generation UI components
│       │   ├── services/       # Frontend service layer
│       │   ├── types/          # Frontend-specific types
│       │   └── main.tsx        # React app entry point
│       └── package.json
├── packages/
│   └── shared-types/           # Shared TypeScript interfaces
│       ├── src/index.ts        # Common data models
│       └── package.json
├── docs/                       # Comprehensive documentation
│   ├── architecture/           # Original architecture documents (pre-Epic 1)
│   ├── prd/                    # Product requirements
│   ├── stories/                # Epic and story documentation
│   └── PROJECT_STATUS.md       # Current status and achievements
├── package.json                # Root workspace configuration
└── turbo.json                  # Build orchestration config
```

## Key Modules and Their Purpose

- **AI Service** (`apps/api/src/services/ai.service.ts`):
  - Google Gemini integration with robust error handling
  - Mock mode for development/testing when API key not configured
  - Custom prompt engineering for structured JSON extraction

- **Generation Route** (`apps/api/src/routes/generate.ts`):
  - Single endpoint: `POST /api/generate`
  - Input validation (max 10k characters)
  - Error handling with appropriate HTTP status codes

- **Frontend Generation Feature** (`apps/web/src/features/generation/`):
  - `GenerationForm.tsx`: User input interface
  - `GenerationResult.tsx`: Orchestrates UI generation
  - `GeneratedApp.tsx`: Dynamic mock app rendering
  - `EntityForm.tsx`: Auto-generated forms for each entity
  - `Navigation.tsx`: Dynamic navigation based on roles/features
