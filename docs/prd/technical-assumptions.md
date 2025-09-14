# Technical Assumptions

*   **Repository Structure:** Monorepo. A single repository will contain both the frontend (React) and backend (Node.js) code.
*   **Service Architecture:** Monolith. A simple client-server architecture is sufficient for the MVP. The frontend will communicate with a single backend service, which will handle the AI integration.
*   **Testing Requirements:** Unit Only. For the MVP, the focus will be on unit tests to ensure individual components and functions work as expected.
*   **Additional Technical Assumptions and Requests:**
    *   **AI Integration:** The backend will integrate with a third-party Large Language Model (LLM) API (e.g., OpenAI, Anthropic, Google AI) for requirement extraction.
    *   **Hosting:** The application will be deployed to a cloud provider with a generous free tier (e.g., Vercel, Render, Heroku) to minimize initial costs.
    *   **Database:** MongoDB will be used, but for the MVP, it will likely not be heavily utilized as there is no data persistence.
