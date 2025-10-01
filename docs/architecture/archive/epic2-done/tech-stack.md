# High Level Architecture

## Technical Summary

The Mini AI App Builder is a **full-stack TypeScript monorepo** that transforms user text descriptions into structured app requirements and generates mock UIs. Built for rapid prototyping and AI-assisted development.

## Actual Tech Stack (from package.json analysis)

| Category               | Technology     | Version   | Notes                                   |
| ---------------------- | -------------- | --------- | --------------------------------------- |
| **Runtime**            | Node.js        | >=18.0.0  | Required for both API and build tools   |
| **Package Manager**    | npm            | 10.0.0    | Workspace-enabled monorepo              |
| **Build Orchestrator** | Turbo          | ^2.0.0    | Handles monorepo builds and dev servers |
| **Backend Framework**  | Express        | ~4.18.0   | REST API with TypeScript                |
| **Frontend Framework** | React          | ^18.2.0   | With TypeScript and modern hooks        |
| **Build Tool**         | Vite           | ^7.1.2    | Fast development and production builds  |
| **Styling**            | Tailwind CSS   | ^3.4.0    | Utility-first CSS with Headless UI      |
| **AI Integration**     | Google Gemini  | REST API  | Direct HTTP calls, no SDK               |
| **Testing**            | Jest + Vitest  | Latest    | Jest for API, Vitest for frontend       |
| **E2E Testing**        | Playwright MCP | Available | Browser automation via MCP integration  |
| **Database**           | **DISABLED**   | N/A       | MongoDB ready but not active in Epic 1  |

## Repository Structure Reality Check

- **Type**: Monorepo with npm workspaces
- **Package Manager**: npm with workspace configuration
- **Architecture**: Clean separation of concerns with shared types
