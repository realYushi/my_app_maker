# Data Models and APIs

## Data Models

**Shared Types** (see `packages/shared-types/src/index.ts`):

```typescript
interface GenerationResult {
  appName: string;
  entities: Entity[];
  userRoles: UserRole[];
  features: Feature[];
}

interface Entity {
  name: string;
  attributes: string[];
}

interface UserRole {
  name: string;
  description: string;
}

interface Feature {
  name: string;
  description: string;
}
```

## API Specifications

**Single Endpoint**: `POST /api/generate`

**Request**:

```json
{
  "text": "string (max 10,000 characters)"
}
```

**Response** (Success):

```json
{
  "appName": "Generated App Name",
  "entities": [...],
  "userRoles": [...],
  "features": [...]
}
```

**Response** (Error):

```json
{
  "error": "Error Type",
  "message": "Human readable error message"
}
```
