# Coding Standards

*   **Types:** Shared types **MUST** be defined in `packages/shared-types` and imported.
*   **Environment:** Environment variables **MUST** be accessed through a config service, not `process.env` directly.
*   **API Calls:** Frontend components **MUST NOT** call `fetch` directly; they must use the service layer.
*   **Error Handling:** Backend controllers **MUST** use the centralized error handling middleware.
*   **Naming:** Standard conventions for the ecosystem (`PascalCase` for components/types, `camelCase` for functions/variables) will be enforced.
