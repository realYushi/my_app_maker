# Appendix - Useful Commands and Scripts

## Frequently Used Commands

```bash
# Development
npm run dev                    # Start all development servers
turbo run dev                  # Alternative using Turbo directly

# Building
npm run build                  # Build all packages
turbo run build               # Alternative using Turbo directly

# Testing
npm test                      # Run all tests
npm run test:coverage         # Web test coverage report

# Individual package development
cd apps/api && npm run dev    # API server only
cd apps/web && npm run dev    # Web dev server only
```

## Debugging and Troubleshooting

- **API Logs**: Console output in terminal running `npm run dev`
- **Network Issues**: Check CORS configuration in `apps/api/src/index.ts`
- **AI Service Issues**: Verify Gemini API key or confirm mock mode is working
- **Build Issues**: Clear `node_modules` and `turbo` cache: `rm -rf node_modules .turbo && npm install`

## Project Status Summary

**✅ Epic 1 Completed**: Full MVP functionality delivered

- User input → AI processing → Mock UI generation
- 81 comprehensive tests passing
- Production-ready codebase structure
- Documentation complete

**🔄 Next Steps for Epic 2**:

- Implement E2E test scenarios using Playwright MCP
- Enable database persistence
- Prepare Render CI/CD deployment
- Enhance UI generation capabilities

---

**Status**: Epic 1 foundation established. Ready for Epic 2 enhancement development.
