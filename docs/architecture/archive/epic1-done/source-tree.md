# Unified Project Structure

```plaintext
mini-ai-app-builder/
├── .github/
├── apps/
│   ├── web/      # Frontend React (Vite) application
│   └── api/      # Backend Node.js (Express) application
├── packages/
│   ├── shared-types/
│   ├── eslint-config/
│   └── tsconfig/
├── docs/
├── package.json      # Root package.json with workspaces
└── turbo.json        # Turborepo configuration
```
