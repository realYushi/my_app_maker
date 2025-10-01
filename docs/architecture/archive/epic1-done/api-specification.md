# API Specification

The API consists of a single endpoint for the MVP.

## REST API Specification (OpenAPI 3.0)

```yaml
openapi: 3.0.1
info:
  title: 'Mini AI App Builder API'
  version: '1.0.0'
  description: 'API for generating mock application UIs from text descriptions.'
servers:
  - url: '/api'
paths:
  /generate:
    post:
      summary: 'Generates a mock UI specification from a text prompt'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                prompt:
                  type: string
                  example: 'An app for tracking book reading habits.'
              required:
                - prompt
      responses:
        '200':
          description: 'Successfully generated the application specification.'
          content:
            application/json:
              schema:
                # Corresponds to the GenerationResult data model
                type: object
        '429':
          description: 'Rate limit exceeded.'
        '500':
          description: 'An error occurred during generation.'
```
