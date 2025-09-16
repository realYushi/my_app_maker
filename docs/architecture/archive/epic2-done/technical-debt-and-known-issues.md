# Technical Debt and Known Issues

## Current Technical Debt

1. **Database Infrastructure**:
   - MongoDB connection code exists but is **DISABLED** (lines 34-46 in `apps/api/src/index.ts`)
   - All database-related functionality commented out for Epic 1
   - Models exist but unused: `apps/api/src/models/`

2. **CORS Configuration**:
   - Hardcoded development CORS setup (allows all origins)
   - Located in `apps/api/src/index.ts` lines 13-26
   - **NEEDS UPDATE** for production deployment

3. **AI Service Mock Mode**:
   - Falls back to mock responses when Gemini API key not configured
   - Good for development but could mask integration issues

## Workarounds and Gotchas

- **Environment Variables**: API runs without database connection (by design)
- **Port Configuration**:
  - API defaults to port 3001
  - Web dev server on port 5173 (Vite default)
- **TypeScript**: Strict mode enabled, all type definitions centralized

## Known Limitations

- **No Data Persistence**: Generated apps are not saved (database disabled)
- **No User Authentication**: No login system implemented
- **No Export Functionality**: Cannot export generated UI code
- **Single AI Provider**: Only Google Gemini integration
