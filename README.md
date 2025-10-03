# Mini AI App Builder

A full-stack TypeScript application that transforms natural language descriptions into structured app requirements and generates mock UIs using AI.

## Features

- **AI-Powered Generation**: Convert natural language descriptions into structured app requirements
- **Dynamic UI Generation**: Automatically create responsive mock interfaces based on extracted requirements
- **Context-Aware Components**: Intelligent component selection for e-commerce, admin dashboards, and user management
- **Modern Tech Stack**: React 18, Node.js, TypeScript, Tailwind CSS
- **Comprehensive Testing**: 357 tests with full coverage
- **Production Ready**: Deployed with custom domain support

## Quick Start

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Frontend: http://localhost:5173
# API: http://localhost:3001
```

## Demo

Enter a description like: _"I want an app to manage student courses and grades. Teachers add courses, students enroll, and admins manage reports."_

**Generated Output:**
- **App Name**: Course Manager
- **Entities**: Student, Course, Grade
- **Roles**: Teacher, Student, Admin
- **Features**: Add course, Enroll students, View reports
- **Mock UI**: Dynamic forms and navigation based on extracted data

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **AI Integration**: Google Gemini API
- **Testing**: Jest (API) + Vitest (Web)
- **Build**: Turbo monorepo + npm workspaces

## Project Status

✅ **All Epics Completed**
- Epic 1: Core AI-to-UI generation
- Epic 2: Context-aware components and advanced features
- Epic 3: UI/UX enhancement and responsive design

📊 **357 tests passing** (45 API + 312 web)

🚀 **Live Demo**: https://my-app-maker.yushi91.com/

## Documentation

- `docs/requirement.md` - Original requirements
- `docs/architecture/` - Technical documentation
- `docs/stories/` - Development stories

## License

MIT