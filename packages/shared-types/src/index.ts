export interface Entity {
  name: string;
  attributes: string[];
}

export interface UserRole {
  name: string;
  description: string;
}

export interface Feature {
  name: string;
  description: string;
  operations?: string[];
  rolePermissions?: Record<string, string | string[]>;
  relatedEntities?: string[];
}

export interface GenerationResult {
  appName: string;
  description?: string;
  entities: Entity[];
  userRoles: UserRole[];
  features: Feature[];
}