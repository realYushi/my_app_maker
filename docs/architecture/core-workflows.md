# Core Workflows

This sequence diagram illustrates the application's main user flow.

```mermaid
sequenceDiagram
    participant User
    participant Browser (React SPA)
    participant API Service (Node.js)
    participant LLM API (External)

    User->>+Browser: 1. Enters app description and clicks "Generate"
    Browser->>Browser: 2. Enters loading state
    Browser->>+API Service: 3. POST /api/generate with { prompt: "..." }

    API Service->>+LLM API: 4. Sends structured prompt to LLM
    LLM API-->>-API Service: 5. Returns structured JSON output

    alt Successful Generation
        API Service-->>-Browser: 6a. Responds with 200 OK and GenerationResult JSON
        Browser->>+User: 8a. Renders dynamic UI based on GenerationResult
    else LLM API Fails
        API Service-->>-Browser: 6b. Responds with 500 Server Error
        Browser->>+User: 8b. Displays a user-friendly error message
    end
```
