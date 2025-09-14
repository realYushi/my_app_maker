# Security and Performance

*   **Security:** Focus on rate-limiting the API, enforcing a strict CORS policy, managing secrets correctly, and preventing XSS on the frontend.
*   **Performance:** The primary goal is the PRD's target of a median time-to-UI of under 10 seconds. This is dominated by the LLM API's response time. Frontend assets will be served via CDN for fast initial loads.
