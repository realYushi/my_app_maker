# Mini AI App Builder - Project Overview

## Project Purpose
A full-stack TypeScript application that transforms natural language descriptions into structured app requirements and generates mock UIs using AI. This project serves dual purposes:
- Intern Evaluation Submission: Demonstrates core technical skills in React, Node.js, and AI integration
- Portfolio Showcase: Advanced architecture and development practices for CV enhancement

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + Headless UI
- **Backend:** Node.js + Express + TypeScript
- **AI Integration:** Google Gemini API (now transitioning to OpenAI SDK with z-ai/glm-4.5-air:free model)
- **Testing:** Jest + Vitest + Playwright (81 tests passing with >90% coverage)
- **Build:** Turbo monorepo + npm workspaces
- **Database:** MongoDB (configured, ready for Epic 2)

## Project Structure
- **Monorepo Architecture:** Clean separation using Turbo with workspaces
- **apps/web:** React frontend application
- **apps/api:** Node.js backend API
- **packages/shared-types:** Shared TypeScript types between frontend and backend
- **docs:** Comprehensive documentation including PRDs, architecture docs, and stories

## Key Features
- AI-powered requirement extraction from natural language
- Dynamic mock UI generation based on extracted requirements
- Context-aware UI generation with intelligent component selection
- Domain-specific mockups (e-commerce, admin dashboards, user management)
- Enhanced component libraries with realistic data and styling
- Advanced routing and navigation patterns
- Comprehensive E2E testing coverage

## Project Status
- Epic 1: ✅ COMPLETED (Sep 15) - All intern evaluation requirements exceeded
- Epic 2: ✅ COMPLETED (Sep 16) - Portfolio enhancement features fully implemented
- Tests: Full test coverage passing ✅
- Deployment: Production-ready for both evaluation and portfolio showcase
- Overall Status: 🎉 PROJECT COMPLETE - Ready for submission and portfolio use