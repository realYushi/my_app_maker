#!/bin/bash

# E2E Test Runner Script
# Runs different suites of E2E tests based on arguments

set -e

echo "🚀 Starting E2E Test Suite"

# Default to running basic tests if no argument provided
SUITE=${1:-basic}

case $SUITE in
  "basic")
    echo "📋 Running Basic E2E Tests..."
    npx playwright test tests/e2e/specs/basic-setup.spec.ts --project=chromium
    ;;
  "core")
    echo "📋 Running Core Generation Flow Tests..."
    npx playwright test tests/e2e/specs/core-generation-flow.spec.ts --project=chromium --workers=1
    ;;
  "context")
    echo "📋 Running Context Detection Tests..."
    npx playwright test tests/e2e/specs/context-detection.spec.ts --project=chromium --workers=1
    ;;
  "responsive")
    echo "📋 Running Responsive Design Tests..."
    npx playwright test tests/e2e/specs/responsive-design.spec.ts
    ;;
  "fallback")
    echo "📋 Running Fallback Behavior Tests..."
    npx playwright test tests/e2e/specs/fallback-behavior.spec.ts --project=chromium --workers=1
    ;;
  "performance")
    echo "📋 Running Performance & Regression Tests..."
    npx playwright test tests/e2e/specs/performance-regression.spec.ts --project=chromium --workers=1
    ;;
  "all")
    echo "📋 Running All E2E Tests..."
    npx playwright test --workers=2
    ;;
  "smoke")
    echo "📋 Running Smoke Tests..."
    npx playwright test --grep "should load|should generate|should detect" --project=chromium --workers=1
    ;;
  *)
    echo "❌ Unknown test suite: $SUITE"
    echo "Available suites: basic, core, context, responsive, fallback, performance, all, smoke"
    exit 1
    ;;
esac

echo "✅ E2E Tests Complete"