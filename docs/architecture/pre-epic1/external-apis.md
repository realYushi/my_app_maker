# External APIs

The application depends on one critical external service.

## LLM Provider API

*   **Purpose:** To convert the user's text into the structured `GenerationResult` JSON object.
*   **Authentication:** An API key will be used, stored securely in a Render Environment Group and accessed only by the backend.
*   **Integration:** The integration will be wrapped in our own `ai.service.ts` to isolate provider-specific code and make it easier to switch providers in the future.
