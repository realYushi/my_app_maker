# Integration Points and External Dependencies

## External Services

| Service       | Purpose              | Integration Type | Key Files                          |
| ------------- | -------------------- | ---------------- | ---------------------------------- |
| Google Gemini | AI requirement extraction | REST API    | `apps/api/src/services/ai.service.ts` |

## Internal Integration Points

- **Frontend-Backend Communication**:
  - REST API on port 3001
  - CORS enabled for all origins (development setup)
  - JSON request/response format

- **Shared Type System**:
  - `@mini-ai-app-builder/shared-types` package
  - Ensures type safety across frontend and backend

- **Monorepo Build System**:
  - Turbo for build orchestration
  - npm workspaces for dependency management
