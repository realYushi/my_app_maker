import React from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'
import { DomainContext, type ContextDetectionResult } from './contextDetectionService'
import EntityForm from '../features/generation/EntityForm'
import {
  EcommerceProductDisplay,
  EcommerceCartDisplay,
  EcommerceCheckoutDisplay
} from '../features/generation/ecommerce'
import {
  UserManagementDisplay,
  UserRoleDisplay
} from '../features/generation/user-management'
import {
  AdminSystemDisplay,
  AdminReportDisplay
} from '../features/generation/admin'
import {
  EcommerceOrderForm,
  EcommerceCustomerForm
} from './components/EcommerceComponents'
import {
  UserManagementUserForm,
  UserManagementRoleForm
} from './components/UserManagementComponents'
import {
  AdminSystemForm,
  AdminReportForm
} from './components/AdminComponents'

// Component factory interface
export interface DomainComponent {
  (props: { entity: Entity; tabKey?: number }): React.ReactElement
}

// Registry mapping domains to React components
interface ComponentRegistry {
  [DomainContext.ECOMMERCE]: {
    [key: string]: DomainComponent
  }
  [DomainContext.USER_MANAGEMENT]: {
    [key: string]: DomainComponent
  }
  [DomainContext.ADMIN]: {
    [key: string]: DomainComponent
  }
  [DomainContext.GENERIC]: {
    [key: string]: DomainComponent
  }
}

// All domain-specific components are now imported from separate files to fix react-refresh/only-export-components

class ComponentFactory {
  private registry: ComponentRegistry = {
    [DomainContext.ECOMMERCE]: {
      // New enhanced e-commerce components
      'product': EcommerceProductDisplay,
      'products': EcommerceProductDisplay,
      'item': EcommerceProductDisplay,
      'items': EcommerceProductDisplay,
      'catalog': EcommerceProductDisplay,
      'inventory': EcommerceProductDisplay,
      'cart': EcommerceCartDisplay,
      'basket': EcommerceCartDisplay,
      'shopping_cart': EcommerceCartDisplay,
      'order': EcommerceOrderForm,
      'orders': EcommerceOrderForm,
      'purchase': EcommerceOrderForm,
      'checkout': EcommerceCheckoutDisplay,
      'payment': EcommerceCheckoutDisplay,
      'billing': EcommerceCheckoutDisplay,
      'customer': EcommerceCustomerForm,
      'customers': EcommerceCustomerForm,
      'client': EcommerceCustomerForm,
      'buyer': EcommerceCustomerForm,
      'shopper': EcommerceCustomerForm,
    },
    [DomainContext.USER_MANAGEMENT]: {
      // Enhanced user management components
      'user': UserManagementDisplay,
      'users': UserManagementDisplay,
      'account': UserManagementDisplay,
      'accounts': UserManagementDisplay,
      'member': UserManagementDisplay,
      'members': UserManagementDisplay,
      'profile': UserManagementDisplay,
      'profiles': UserManagementDisplay,
      'directory': UserManagementDisplay,
      'table': UserManagementDisplay,
      'list': UserManagementDisplay,
      'activity': UserManagementDisplay,
      'feed': UserManagementDisplay,
      'role': UserRoleDisplay,
      'roles': UserRoleDisplay,
      'permission': UserRoleDisplay,
      'permissions': UserRoleDisplay,
      'group': UserRoleDisplay,
      'groups': UserRoleDisplay,
      'team': UserRoleDisplay,
      'teams': UserRoleDisplay,
      // Keep backward compatibility with old form components
      'user_form': UserManagementUserForm,
      'role_form': UserManagementRoleForm,
    },
    [DomainContext.ADMIN]: {
      // Enhanced admin components
      'admin': AdminSystemDisplay,
      'administrator': AdminSystemDisplay,
      'system': AdminSystemDisplay,
      'configuration': AdminSystemDisplay,
      'config': AdminSystemDisplay,
      'settings': AdminSystemDisplay,
      'control': AdminSystemDisplay,
      'panel': AdminSystemDisplay,
      'dashboard': AdminSystemDisplay,
      'overview': AdminSystemDisplay,
      'metrics': AdminSystemDisplay,
      'monitoring': AdminSystemDisplay,
      'health': AdminSystemDisplay,
      'log': AdminReportDisplay,
      'logs': AdminReportDisplay,
      'report': AdminReportDisplay,
      'reports': AdminReportDisplay,
      'analytics': AdminReportDisplay,
      'chart': AdminReportDisplay,
      'visualization': AdminReportDisplay,
      'data': AdminReportDisplay,
      // Keep backward compatibility with old form components
      'admin_form': AdminSystemForm,
      'report_form': AdminReportForm,
      'monitor': AdminSystemDisplay,
    },
    [DomainContext.GENERIC]: {}
  }

  /**
   * Routes an entity to the appropriate UI component based on context detection
   */
  getComponent(entity: Entity, contextResult: ContextDetectionResult): DomainComponent {
    // Get the domain for this specific entity
    const entityDomain = contextResult.entityDomainMap.get(entity.name) || DomainContext.GENERIC

    // Try to find a specific component for this entity
    const entityName = entity.name.toLowerCase()
    const domainRegistry = this.registry[entityDomain]

    if (domainRegistry && domainRegistry[entityName]) {
      return domainRegistry[entityName]
    }

    // Fallback to generic EntityForm for unknown entity types
    return ({ entity, tabKey }) => <EntityForm entity={entity} tabKey={tabKey} />
  }

  /**
   * Checks if a specific component exists for an entity
   */
  hasSpecificComponent(entity: Entity, contextResult: ContextDetectionResult): boolean {
    const entityDomain = contextResult.entityDomainMap.get(entity.name) || DomainContext.GENERIC
    const entityName = entity.name.toLowerCase()
    const domainRegistry = this.registry[entityDomain]

    return domainRegistry && !!domainRegistry[entityName]
  }

  /**
   * Gets all available component types for a domain
   */
  getAvailableComponents(domain: DomainContext): string[] {
    return Object.keys(this.registry[domain] || {})
  }

  /**
   * Registers a new component for a specific entity type in a domain
   */
  registerComponent(domain: DomainContext, entityType: string, component: DomainComponent): void {
    if (!this.registry[domain]) {
      this.registry[domain] = {}
    }
    this.registry[domain][entityType.toLowerCase()] = component
  }

  /**
   * Gets the total number of registered components across all domains
   */
  getTotalRegisteredComponents(): number {
    return Object.values(this.registry).reduce((total, domainRegistry) => {
      return total + Object.keys(domainRegistry).length
    }, 0)
  }

  /**
   * Checks if the enhanced e-commerce components are properly registered
   */
  verifyEcommerceComponentsRegistered(): boolean {
    const ecommerceRegistry = this.registry[DomainContext.ECOMMERCE]
    if (!ecommerceRegistry) return false

    const requiredComponents = ['product', 'cart', 'checkout']
    return requiredComponents.every(component => component in ecommerceRegistry)
  }

  /**
   * Checks if the enhanced user management components are properly registered
   */
  verifyUserManagementComponentsRegistered(): boolean {
    const userMgmtRegistry = this.registry[DomainContext.USER_MANAGEMENT]
    if (!userMgmtRegistry) return false

    const requiredComponents = ['user', 'role', 'profile', 'activity']
    return requiredComponents.every(component => component in userMgmtRegistry)
  }

  /**
   * Checks if the enhanced admin components are properly registered
   */
  verifyAdminComponentsRegistered(): boolean {
    const adminRegistry = this.registry[DomainContext.ADMIN]
    if (!adminRegistry) return false

    const requiredComponents = ['admin', 'dashboard', 'analytics', 'system']
    return requiredComponents.every(component => component in adminRegistry)
  }

  /**
   * Verifies all enhanced components across all domains are properly registered
   */
  verifyAllEnhancedComponentsRegistered(): boolean {
    return this.verifyEcommerceComponentsRegistered() &&
           this.verifyUserManagementComponentsRegistered() &&
           this.verifyAdminComponentsRegistered()
  }
}

export const componentFactory = new ComponentFactory()