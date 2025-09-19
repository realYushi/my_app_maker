# Task Completion Checklist - Mini AI App Builder

## After Completing Any Task

### 1. Code Quality Checks
```bash
# Run linting across all packages
npm run lint

# Run all tests
npm run test

# Run E2E tests if relevant
npm run test:e2e
```

### 2. TypeScript Type Checking
- Ensure no TypeScript errors in any package
- Check that all new code has proper type definitions
- Verify shared types are properly imported and used

### 3. Testing Requirements
- **Unit Tests:** Add/update unit tests for new functionality
- **Integration Tests:** Test API endpoints and component interactions
- **E2E Tests:** Add E2E tests for new user workflows
- **Coverage:** Maintain >90% test coverage

### 4. Documentation Updates
- Update relevant documentation in docs/
- Add/update stories in docs/stories/ if new features added
- Update architecture docs if structural changes made
- Update PRDs if requirements changed

### 5. Code Review Checklist
- [ ] Code follows project conventions
- [ ] TypeScript types are correct and comprehensive
- [ ] Error handling is implemented
- [ ] Tests are passing and comprehensive
- [ ] No ESLint or TypeScript errors
- [ ] Dependencies are properly managed
- [ ] Security considerations addressed

### 6. Build Verification
```bash
# Build all packages to ensure no build errors
npm run build
```

### 7. Local Development Testing
```bash
# Start development servers and test manually
npm run dev
# Test on http://localhost:5173 (frontend)
# Test API on http://localhost:3001
```

## Before Committing
1. **Run full test suite:** `npm test` and `npm run test:e2e`
2. **Check linting:** `npm run lint`
3. **Verify build:** `npm run build`
4. **Stage only relevant changes:** `git add [specific-files]`
5. **Create descriptive commit message** following conventional commits
6. **Push changes:** `git push origin [branch-name]`

## Special Considerations
- **AI Integration Changes:** Test AI prompts and responses thoroughly
- **UI Changes:** Test across different screen sizes
- **API Changes:** Verify backward compatibility or update version
- **Database Changes:** Run migrations and test data integrity
- **Shared Types:** Update all dependent packages when changing shared types