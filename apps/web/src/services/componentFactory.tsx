import React from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'
import { DomainContext, type ContextDetectionResult } from './contextDetectionService'
import EntityForm from '../features/generation/EntityForm'

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

// E-commerce specific components
const EcommerceProductForm: DomainComponent = ({ entity }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
        🛍️ Product Catalog
      </span>
    </div>
    <div className="mb-3 text-sm text-gray-600">
      Product management interface for inventory and catalog operations.
    </div>
    <EntityForm entity={entity} />
  </div>
)

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
      'product': EcommerceProductForm,
      'products': EcommerceProductForm,
      'item': EcommerceProductForm,
      'items': EcommerceProductForm,
      'catalog': EcommerceProductForm,
      'inventory': EcommerceProductForm,
      'order': EcommerceOrderForm,
      'orders': EcommerceOrderForm,
      'purchase': EcommerceOrderForm,
      'cart': EcommerceOrderForm,
      'basket': EcommerceOrderForm,
      'customer': EcommerceCustomerForm,
      'customers': EcommerceCustomerForm,
      'client': EcommerceCustomerForm,
      'buyer': EcommerceCustomerForm,
      'shopper': EcommerceCustomerForm,
    },
    [DomainContext.USER_MANAGEMENT]: {
      'user': UserManagementUserForm,
      'users': UserManagementUserForm,
      'account': UserManagementUserForm,
      'accounts': UserManagementUserForm,
      'member': UserManagementUserForm,
      'members': UserManagementUserForm,
      'profile': UserManagementUserForm,
      'profiles': UserManagementUserForm,
      'role': UserManagementRoleForm,
      'roles': UserManagementRoleForm,
      'permission': UserManagementRoleForm,
      'permissions': UserManagementRoleForm,
      'group': UserManagementRoleForm,
      'groups': UserManagementRoleForm,
      'team': UserManagementRoleForm,
      'teams': UserManagementRoleForm,
    },
    [DomainContext.ADMIN]: {
      'admin': AdminSystemForm,
      'administrator': AdminSystemForm,
      'system': AdminSystemForm,
      'configuration': AdminSystemForm,
      'config': AdminSystemForm,
      'settings': AdminSystemForm,
      'log': AdminReportForm,
      'logs': AdminReportForm,
      'report': AdminReportForm,
      'reports': AdminReportForm,
      'analytics': AdminReportForm,
      'dashboard': AdminReportForm,
      'metric': AdminReportForm,
      'monitor': AdminSystemForm,
      'monitoring': AdminSystemForm,
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
}

export const componentFactory = new ComponentFactory()