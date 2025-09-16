# Tech Stack

This table is the definitive source of truth for all technologies used in the project.

| Category               | Technology              | Version         | Purpose                                          | Rationale                                                                                                  |
| :--------------------- | :---------------------- | :-------------- | :----------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| **Frontend Language**    | TypeScript              | `~5.x`          | Language for frontend development                | Provides type safety and aligns with modern React standards.                                               |
| **Frontend Framework**   | React                   | `~18.x`         | Core UI library for building the SPA             | Required by the PRD (NFR5).                                                                                |
| **UI Component Library** | Tailwind CSS + Headless UI | `~3.x` / `~2.x` | Styling and accessible unstyled components       | Required by `front-end-spec.md`. Provides accessible blocks without imposing a visual style.                |
| **State Management**     | React Context API       | `~18.x`         | Managing simple global UI state                  | Sufficient for the MVP's limited state needs without adding external library overhead.                     |
| **Backend Language**     | TypeScript              | `~5.x`          | Language for backend development                 | Enables code and type sharing with the frontend.                                                           |
| **Backend Framework**    | Express.js              | `~4.x`          | Web server framework for the Node.js API         | Minimal, unopinionated, and widely used.                                                                   |
| **API Style**            | REST                    | `N/A`           | Defines frontend-backend communication           | Simple and sufficient for the single endpoint required by the MVP.                                         |
| **Database**             | MongoDB                 | `~7.x`          | Primary data store                               | Required by the PRD (NFR5).                                                                                |
| **Authentication**       | `N/A`                   | `N/A`           | User authentication and authorization            | Explicitly out of scope for the MVP (PRD, NFR4).                                                           |
| **Frontend Testing**     | Vitest                  | `~1.x`          | Unit and component testing for the frontend      | Native to the Vite ecosystem, offering high speed.                                                         |
| **Backend Testing**      | Jest                    | `~29.x`         | Unit and integration testing for the backend API | A mature and widely adopted testing framework for Node.js.                                                 |
| **E2E Testing**          | `N/A`                   | `N/A`           | End-to-end testing of user flows                 | Deferred for post-MVP.                                                                                     |
| **Build Tool**           | Vite                    | `~5.x`          | Bundler and dev server for the React frontend    | Provides an extremely fast development experience.                                                         |
| **Monorepo Tool**        | Turborepo               | `~2.x`          | Monorepo task runner and build orchestrator      | Provides high-performance task running and caching.                                                        |
| **CI/CD**                | Render                  | `N/A`           | Automated builds and deployments                 | Render's native Git integration will be used.                                                              |
| **Monitoring**           | Render                  | `N/A`           | Application health and performance monitoring    | Render provides sufficient built-in metrics and logging for the MVP.                                       |
