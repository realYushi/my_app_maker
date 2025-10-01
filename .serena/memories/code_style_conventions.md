# Code Style and Conventions - Mini AI App Builder

## TypeScript Conventions

- **Strict Mode:** Full TypeScript strict mode enabled
- **Type Definitions:** Comprehensive type definitions in shared-types package
- **Import Aliases:**
  - `@/` for current package src directory (apps/web/src)
  - `@mini-ai-app-builder/shared-types` for shared types

## React Conventions

- **Functional Components:** Prefer functional components with hooks
- **TypeScript Props:** Strongly typed component props
- **Error Boundaries:** Used for component error handling
- **Component Organization:** Feature-based organization in apps/web/src/features/

## Naming Conventions

- **Files:** PascalCase for components (GenerationForm.tsx), camelCase for utilities
- **Variables:** camelCase
- **Constants:** UPPER_SNAKE_CASE
- **Interfaces:** PascalCase, prefix with I (e.g., IEntity)
- **Types:** PascalCase

## ESLint Configuration

- **Base Config:** TypeScript ESLint recommended
- **React Hooks:** Enforce React Hooks rules
- **React Refresh:** For Vite HMR
- **File Extensions:** Enforce .ts/.tsx extensions

## Styling Conventions

- **CSS Framework:** Tailwind CSS utility-first approach
- **Component Classes:** Consistent use of Tailwind classes
- **Responsive Design:** Mobile-first responsive breakpoints
- **Headless UI:** Accessible component library for interactive elements

## Testing Conventions

- **Frontend Testing:** Vitest + React Testing Library
- **Backend Testing:** Jest + Supertest
- **E2E Testing:** Playwright
- **Test Organization:** Feature-based test structure
- **Coverage:** >90% test coverage maintained

## API Conventions

- **RESTful Design:** REST API endpoints
- **Express Middleware:** TypeScript middleware integration
- **Rate Limiting:** API rate limiting configured
- **CORS:** Proper CORS configuration

## Import Organization

- **Order:**
  1. React imports
  2. Third-party libraries
  3. Shared types
  4. Local imports (relative and aliased)
- **Named Exports:** Prefer named exports over default exports
- **Type Imports:** Separate type imports with `type` keyword

## Error Handling

- **Error Boundaries:** React error boundaries for UI errors
- **API Errors:** Structured error responses with status codes
- **Async Operations:** Proper async/await error handling

## Git Conventions

- **Commit Messages:** Conventional commit messages
- **Branch Naming:** feature/branch-name, fix/branch-name
- **PR Process:** Pull requests for all changes
