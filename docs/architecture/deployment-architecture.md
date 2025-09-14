# Deployment Architecture

*   **Platform:** Render, configured with a `render.yaml` file.
*   **Frontend (`web`):** Deployed as a **Render Static Site**.
*   **Backend (`api`):** Deployed as a **Render Web Service**.
*   **CI/CD:** Continuous deployment will be handled by Render's native Git integration, triggering on pushes to the `main` branch.
