# Quick Reference - Key Files and Entry Points

## Critical Files for Understanding the System

- **Main Entry Points**:
  - Backend: `apps/api/src/index.ts` (Express server setup)
  - Frontend: `apps/web/src/main.tsx` (React app entry)
- **Configuration**:
  - Backend: `apps/api/src/config/index.ts`
  - Frontend: `apps/web/vite.config.ts`
- **Core Business Logic**:
  - AI Service: `apps/api/src/services/ai.service.ts`
  - Generation Service: `apps/web/src/services/generationService.ts`
- **API Definitions**: `apps/api/src/routes/generate.ts`
- **Data Models**: `packages/shared-types/src/index.ts`
- **Key Algorithms**: AI requirement extraction and mock UI generation

## Epic 1 Achievement Areas

**✅ Completed Features:**

- User input system with text area interface
- Gemini AI integration for requirement extraction
- Dynamic mock UI generation based on AI output
- Comprehensive test suite (81 tests passing)
- Type-safe monorepo architecture
