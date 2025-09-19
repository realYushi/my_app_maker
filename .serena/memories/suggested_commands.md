# Development Commands - Mini AI App Builder

## Project Setup
```bash
# Install dependencies
npm install

# Start development servers (frontend on :5173, API on :3001)
npm run dev

# Build all packages
npm run build
```

## Frontend Commands (apps/web)
```bash
# Start frontend development server
cd apps/web && npm run dev

# Build frontend for production
cd apps/web && npm run build

# Run frontend tests
cd apps/web && npm test

# Run frontend tests with UI
cd apps/web && npm run test:ui

# Run frontend tests with coverage
cd apps/web && npm run test:coverage

# Lint frontend code
cd apps/web && npm run lint

# Preview production build
cd apps/web && npm run preview
```

## Backend Commands (apps/api)
```bash
# Start API development server
cd apps/api && npm run dev

# Build API for production
cd apps/api && npm run build

# Start API in production
cd apps/api && npm start

# Run API tests
cd apps/api && npm test

# Run API tests in watch mode
cd apps/api && npm run test:watch
```

## E2E Testing
```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed
```

## Turbo Monorepo Commands
```bash
# Run command across all packages
npm run lint     # Lint all packages
npm run test     # Test all packages
npm run build    # Build all packages
```

## Git Commands
```bash
# Standard git operations
git status
git add .
git commit -m "commit message"
git push origin main

# Check recent commits
git log --oneline -10

# Create new branch
git checkout -b feature/new-feature
```

## File System Commands (Darwin/macOS)
```bash
# List files and directories
ls -la

# Find files by name
find . -name "*.ts" -type f

# Search within files
grep -r "search term" .

# Remove node_modules
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
```

## Docker Commands (if needed)
```bash
# Build and run with Docker Compose
docker-compose up --build

# Stop containers
docker-compose down

# View container logs
docker-compose logs -f
```