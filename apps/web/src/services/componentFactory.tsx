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

// Component factory interface
export interface DomainComponent {
  (props: { entity: Entity }): React.ReactElement
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

// E-commerce specific components (keeping existing order and customer forms for backward compatibility)
const EcommerceOrderForm: DomainComponent = ({ entity }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-l-green-500">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
        📦 Order Management
      </span>
    </div>
    <div className="mb-3 text-sm text-gray-600">
      Order processing and fulfillment interface for sales operations.
    </div>
    <EntityForm entity={entity} />
  </div>
)

const EcommerceCustomerForm: DomainComponent = ({ entity }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
        👥 Customer Relationship
      </span>
    </div>
    <div className="mb-3 text-sm text-gray-600">
      Customer data and relationship management interface.
    </div>
    <EntityForm entity={entity} />
  </div>
)

// User management specific components
const UserManagementUserForm: DomainComponent = ({ entity }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-l-indigo-500">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
        👤 User Account
      </span>
    </div>
    <div className="mb-3 text-sm text-gray-600">
      User account management with authentication and profile settings.
    </div>
    <EntityForm entity={entity} />
  </div>
)

const UserManagementRoleForm: DomainComponent = ({ entity }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-l-yellow-500">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
        🔐 Access Control
      </span>
    </div>
    <div className="mb-3 text-sm text-gray-600">
      Role-based access control and permission management interface.
    </div>
    <EntityForm entity={entity} />
  </div>
)

// Admin specific components
const AdminSystemForm: DomainComponent = ({ entity }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-l-red-500">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
        ⚙️ System Admin
      </span>
    </div>
    <div className="mb-3 text-sm text-gray-600">
      System administration and configuration management interface.
    </div>
    <EntityForm entity={entity} />
  </div>
)

const AdminReportForm: DomainComponent = ({ entity }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
        📊 Analytics & Reports
      </span>
    </div>
    <div className="mb-3 text-sm text-gray-600">
      Analytics dashboard and reporting interface for data insights.
    </div>
    <EntityForm entity={entity} />
  </div>
)

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
    return ({ entity }) => <EntityForm entity={entity} />
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