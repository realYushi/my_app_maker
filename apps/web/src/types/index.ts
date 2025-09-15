// Local types for immediate functionality
// TODO: Integrate with shared-types once workspace setup is complete

export interface Entity {
  name: string
  attributes: string[]
}

export interface UserRole {
  name: string
  description: string
}

export interface Feature {
  name: string
  description: string
}

export interface GenerationResult {
  appName: string
  entities: Entity[]
  userRoles: UserRole[]
  features: Feature[]
}