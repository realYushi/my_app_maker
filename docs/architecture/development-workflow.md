# Development Workflow

*   **Setup:** `git clone ... && cd ... && npm install`
*   **Run:** `npm run dev` (starts both frontend and backend)
*   **Environment:**
    *   `apps/api/.env` for backend secrets (`PORT`, `MONGODB_URI`, `LLM_API_KEY`).
    *   `apps/web/.env.local` for frontend configuration (`VITE_API_BASE_URL`).
