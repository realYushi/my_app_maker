import React from 'react';
import type { Entity } from '@mini-ai-app-builder/shared-types';
import { DomainContext, type ContextDetectionResult } from './contextDetectionService';
import EntityForm from '../features/generation/EntityForm';
import { domainComponentMaps } from '../config/domainComponents';

/**
 * Component factory interface for domain-specific React components
 * @interface DomainComponent
 * @param {Object} props - Component properties
 * @param {Entity} props.entity - The entity data to render
 * @param {number} [props.tabKey] - Optional tab key for component state management
 * @returns {React.ReactElement} Rendered React component
 */
export interface DomainComponent {
  (props: { entity: Entity; tabKey?: number }): React.ReactElement;
}

/**
 * Plugin interface for domain component registration
 * Enables modular registration of components for specific domains
 * @interface DomainPlugin
 */
export interface DomainPlugin {
  /** The domain context this plugin handles */
  domain: DomainContext;
  /** Map of entity types to their corresponding components */
  components: { [key: string]: DomainComponent };
  /** Human-readable plugin name */
  name: string;
  /** Optional version string for debugging and logging */
  version?: string;
}

/**
 * Registry mapping domains to React components
 * @interface ComponentRegistry
 */
interface ComponentRegistry {
  [DomainContext.ECOMMERCE]: { [key: string]: DomainComponent };
  [DomainContext.USER_MANAGEMENT]: { [key: string]: DomainComponent };
  [DomainContext.ADMIN]: { [key: string]: DomainComponent };
  [DomainContext.GENERIC]: { [key: string]: DomainComponent };
}

/**
 * ComponentFactory - Manages dynamic component creation based on domain context
 *
 * This factory provides intelligent component routing based on entity type and domain context.
 * It supports plugin-based architecture for extending component mappings and includes
 * performance optimizations through component caching.
 *
 * @class ComponentFactory
 * @example
 * ```typescript
 * const component = componentFactory.getComponent(entity, contextResult);
 * return <component entity={entity} />;
 * ```
 */
class ComponentFactory {
  private registry: ComponentRegistry = {
    [DomainContext.ECOMMERCE]: {},
    [DomainContext.USER_MANAGEMENT]: {},
    [DomainContext.ADMIN]: {},
    [DomainContext.GENERIC]: {},
  };
  private cache: Map<string, DomainComponent> = new Map();

  /**
   * Creates a new ComponentFactory instance and initializes the component registry
   */
  constructor() {
    this.initializeRegistry();
  }

  /**
   * Initialize the registry with domain component mappings
   */
  private initializeRegistry(): void {
    // Load pre-configured domain components
    Object.entries(domainComponentMaps).forEach(([domain, componentMap]) => {
      this.registry[domain as DomainContext] = { ...componentMap };
    });
  }

  /**
   * Routes an entity to the appropriate UI component based on context detection
   */
  getComponent(entity: Entity, contextResult: ContextDetectionResult): DomainComponent {
    const entityDomain = contextResult.entityDomainMap.get(entity.name) || DomainContext.GENERIC;
    const entityName = entity.name.toLowerCase();
    const cacheKey = `${entityDomain}:${entityName}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const domainRegistry = this.registry[entityDomain];
    let component: DomainComponent;

    if (domainRegistry && domainRegistry[entityName]) {
      component = domainRegistry[entityName];
    } else {
      component = ({ entity, tabKey }) => <EntityForm entity={entity} tabKey={tabKey} />;
    }

    this.cache.set(cacheKey, component);
    return component;
  }

  /**
   * Checks if a specific component exists for an entity
   */
  hasSpecificComponent(entity: Entity, contextResult: ContextDetectionResult): boolean {
    const entityDomain = contextResult.entityDomainMap.get(entity.name) || DomainContext.GENERIC;
    const entityName = entity.name.toLowerCase();
    const domainRegistry = this.registry[entityDomain];
    return !!(domainRegistry && domainRegistry[entityName]);
  }

  /**
   * Gets all available component types for a domain
   */
  getAvailableComponents(domain: DomainContext): string[] {
    return Object.keys(this.registry[domain] || {});
  }

  /**
   * Registers a new component for a specific entity type in a domain
   */
  registerComponent(domain: DomainContext, entityType: string, component: DomainComponent): void {
    if (!this.registry[domain]) {
      this.registry[domain] = {};
    }
    this.registry[domain][entityType.toLowerCase()] = component;
    // Clear cache for this domain to ensure fresh lookups
    this.clearCacheForDomain(domain);
  }

  /**
   * Registers a complete domain plugin with multiple components
   */
  registerPlugin(plugin: DomainPlugin): void {
    if (!this.registry[plugin.domain]) {
      this.registry[plugin.domain] = {};
    }

    // Register all components from the plugin
    Object.entries(plugin.components).forEach(([entityType, component]) => {
      this.registry[plugin.domain][entityType.toLowerCase()] = component;
    });

    // Clear cache for this domain
    this.clearCacheForDomain(plugin.domain);

    console.log(
      `Registered plugin: ${plugin.name}${plugin.version ? ` v${plugin.version}` : ''} for domain ${plugin.domain}`,
    );
  }

  /**
   * Clears cache entries for a specific domain
   */
  private clearCacheForDomain(domain: DomainContext): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => key.startsWith(`${domain}:`));
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Gets the total number of registered components across all domains
   */
  getTotalRegisteredComponents(): number {
    return Object.values(this.registry).reduce((total, domainRegistry) => {
      return total + Object.keys(domainRegistry).length;
    }, 0);
  }

  /**
   * Verifies that components for a given domain are registered.
   */
  private verifyComponentsRegistered(domain: DomainContext, requiredComponents: string[]): boolean {
    const domainRegistry = this.registry[domain];
    if (!domainRegistry) return false;
    return requiredComponents.every(component => component in domainRegistry);
  }

  /**
   * Checks if the enhanced e-commerce components are properly registered
   */
  verifyEcommerceComponentsRegistered(): boolean {
    return this.verifyComponentsRegistered(DomainContext.ECOMMERCE, [
      'product',
      'cart',
      'checkout',
    ]);
  }

  /**
   * Checks if the enhanced user management components are properly registered
   */
  verifyUserManagementComponentsRegistered(): boolean {
    return this.verifyComponentsRegistered(DomainContext.USER_MANAGEMENT, [
      'user',
      'role',
      'profile',
      'activity',
    ]);
  }

  /**
   * Checks if the enhanced admin components are properly registered
   */
  verifyAdminComponentsRegistered(): boolean {
    return this.verifyComponentsRegistered(DomainContext.ADMIN, [
      'admin',
      'dashboard',
      'analytics',
      'system',
    ]);
  }

  /**
   * Verifies all enhanced components across all domains are properly registered
   */
  verifyAllEnhancedComponentsRegistered(): boolean {
    return (
      this.verifyEcommerceComponentsRegistered() &&
      this.verifyUserManagementComponentsRegistered() &&
      this.verifyAdminComponentsRegistered()
    );
  }
}

export const componentFactory = new ComponentFactory();
