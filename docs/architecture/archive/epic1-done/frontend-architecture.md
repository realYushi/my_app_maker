# Frontend Architecture

*   **Component Organization:** A feature-based folder structure will be used (e.g., `src/features/generation`).
*   **State Management:** React's built-in Context API will be used to manage the minimal global state (`idle`, `loading`, `success`, `error`).
*   **Routing:** No routing library is needed for the MVP. The root `App.tsx` component will conditionally render views based on the application state.
*   **Services Layer:** A dedicated service layer (`src/services`) will abstract all `fetch` calls to the backend.
