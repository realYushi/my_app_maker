# Data Models

These transient models define the contract between the backend's AI service and the frontend's rendering engine. They will be defined in a shared `packages/shared-types` package.

## `GenerationResult` (Root Model)

This is the root object returned by the `/api/generate` endpoint.

```typescript
import { Entity } from './Entity';
import { UserRole } from './UserRole';
import { Feature } from './Feature';

export interface GenerationResult {
  appName: string;
  entities: Entity[];
  userRoles: UserRole[];
  features: Feature[];
}
```

## `Entity`

Represents a data object used to render a mock form (PRD, FR5).

```typescript
export interface Entity {
  name: string;
  attributes: string[];
}
```

## `UserRole`

Represents a user type, used to populate the navigation menu (PRD, FR6).

```typescript
export interface UserRole {
  name: string;
  description: string;
}
```

## `Feature`

Represents an application capability, used to populate the navigation menu (PRD, FR6).

```typescript
export interface Feature {
  name: string;
  description: string;
}
```
