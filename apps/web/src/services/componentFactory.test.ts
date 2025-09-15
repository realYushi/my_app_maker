import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { componentFactory, type DomainComponent } from './componentFactory.tsx'
import { contextDetectionService, DomainContext } from './contextDetectionService'
import type { Entity } from '@mini-ai-app-builder/shared-types'

describe('ComponentFactory', () => {
  describe('E-commerce component routing', () => {
    it('should route product entities to specialized product component', () => {
      const entities: Entity[] = [
        { name: 'Product', attributes: ['name', 'price', 'description'] }
      ]

      const contextResult = contextDetectionService.detectContext(entities)
      const component = componentFactory.getComponent(entities[0], contextResult)

      // Render the component to test it
      const { container } = render(component({ entity: entities[0] }))

      expect(container.querySelector('.border-l-blue-500')).toBeInTheDocument()
      expect(screen.getByText('🛍️ Product Card')).toBeInTheDocument()
      expect(screen.getByText('Enhanced product display with pricing, ratings, and add-to-cart functionality.')).toBeInTheDocument()
      expect(componentFactory.hasSpecificComponent(entities[0], contextResult)).toBe(true)
    })

    it('should route order entities to specialized order component', () => {
      const entities: Entity[] = [
        { name: 'Order', attributes: ['total', 'status', 'customer_id'] }
      ]

      const contextResult = contextDetectionService.detectContext(entities)
      const component = componentFactory.getComponent(entities[0], contextResult)

      const { container } = render(component({ entity: entities[0] }))

      expect(container.querySelector('.border-l-green-500')).toBeInTheDocument()
      expect(screen.getByText('📦 Order Management')).toBeInTheDocument()
      expect(screen.getByText('Order processing and fulfillment interface for sales operations.')).toBeInTheDocument()
      expect(componentFactory.hasSpecificComponent(entities[0], contextResult)).toBe(true)
    })

    it('should route customer entities to specialized customer component', () => {
      const entities: Entity[] = [
        { name: 'Customer', attributes: ['name', 'email', 'address'] }
      ]

      const contextResult = contextDetectionService.detectContext(entities)
      const component = componentFactory.getComponent(entities[0], contextResult)

      const { container } = render(component({ entity: entities[0] }))

      expect(container.querySelector('.border-l-purple-500')).toBeInTheDocument()
      expect(screen.getByText('👥 Customer Relationship')).toBeInTheDocument()
      expect(screen.getByText('Customer data and relationship management interface.')).toBeInTheDocument()
      expect(componentFactory.hasSpecificComponent(entities[0], contextResult)).toBe(true)
    })

    it('should handle multiple e-commerce entity variants', () => {
      const entities: Entity[] = [
        { name: 'Products', attributes: ['name'] },
        { name: 'Orders', attributes: ['total'] },
        { name: 'Cart', attributes: ['items'] },
        { name: 'Inventory', attributes: ['stock'] }
      ]

      const contextResult = contextDetectionService.detectContext(entities)

      entities.forEach(entity => {
        expect(componentFactory.hasSpecificComponent(entity, contextResult)).toBe(true)
      })
    })
  })

  describe('User management component routing', () => {
    it('should route user entities to specialized user component', () => {
      const entities: Entity[] = [
        { name: 'User', attributes: ['username', 'email', 'password'] }
      ]

      const contextResult = contextDetectionService.detectContext(entities)
      const component = componentFactory.getComponent(entities[0], contextResult)

      const { container } = render(component({ entity: entities[0] }))

      expect(container.querySelector('.border-l-indigo-500')).toBeInTheDocument()
      expect(screen.getByText('👤 User Management')).toBeInTheDocument()
      expect(screen.getByText('User account management with authentication and profile settings.')).toBeInTheDocument()
      expect(componentFactory.hasSpecificComponent(entities[0], contextResult)).toBe(true)
    })

    it('should route role entities to specialized role component', () => {
      const entities: Entity[] = [
        { name: 'Role', attributes: ['name', 'permissions'] }
      ]

      const contextResult = contextDetectionService.detectContext(entities)
      const component = componentFactory.getComponent(entities[0], contextResult)

      const { container } = render(component({ entity: entities[0] }))

      expect(container.querySelector('.border-l-yellow-500')).toBeInTheDocument()
      expect(screen.getAllByText('🔐 Access Control')[0]).toBeInTheDocument()
      expect(screen.getByText('Role-based access control and permission management interface with matrix-style configuration.')).toBeInTheDocument()
      expect(componentFactory.hasSpecificComponent(entities[0], contextResult)).toBe(true)
    })

    it('should handle multiple user management entity variants', () => {
      const entities: Entity[] = [
        { name: 'Account', attributes: ['status'] },
        { name: 'Profile', attributes: ['bio'] },
        { name: 'Permission', attributes: ['action'] },
        { name: 'Group', attributes: ['members'] }
      ]

      const contextResult = contextDetectionService.detectContext(entities)

      entities.forEach(entity => {
        expect(componentFactory.hasSpecificComponent(entity, contextResult)).toBe(true)
      })
    })
  })

  describe('Admin component routing', () => {
    it('should route system entities to specialized admin component', () => {
      const entities: Entity[] = [
        { name: 'System', attributes: ['status', 'version'] }
      ]

      const contextResult = contextDetectionService.detectContext(entities)
      const component = componentFactory.getComponent(entities[0], contextResult)

      const { container } = render(component({ entity: entities[0] }))

      expect(container.querySelector('.border-l-red-500')).toBeInTheDocument()
      expect(screen.getAllByText('⚙️ System Admin')[0]).toBeInTheDocument()
      expect(screen.getByText('System administration and configuration management interface.')).toBeInTheDocument()
      expect(componentFactory.hasSpecificComponent(entities[0], contextResult)).toBe(true)
    })

    it('should route report entities to specialized report component', () => {
      const entities: Entity[] = [
        { name: 'Report', attributes: ['title', 'data'] }
      ]

      const contextResult = contextDetectionService.detectContext(entities)
      const component = componentFactory.getComponent(entities[0], contextResult)

      const { container } = render(component({ entity: entities[0] }))

      expect(container.querySelector('.border-l-indigo-500')).toBeInTheDocument()
      expect(screen.getAllByText('📊 Analytics & Reports')[0]).toBeInTheDocument()
      expect(screen.getByText('Advanced analytics dashboard with interactive charts, data visualization, and comprehensive reporting capabilities.')).toBeInTheDocument()
      expect(componentFactory.hasSpecificComponent(entities[0], contextResult)).toBe(true)
    })

    it('should handle multiple admin entity variants', () => {
      const entities: Entity[] = [
        { name: 'Admin', attributes: ['privileges'] },
        { name: 'Configuration', attributes: ['key'] },
        { name: 'Log', attributes: ['message'] },
        { name: 'Analytics', attributes: ['metric'] }
      ]

      const contextResult = contextDetectionService.detectContext(entities)

      entities.forEach(entity => {
        expect(componentFactory.hasSpecificComponent(entity, contextResult)).toBe(true)
      })
    })
  })

  describe('Generic and fallback behavior', () => {
    it('should fallback to EntityForm for unknown entities', () => {
      const entities: Entity[] = [
        { name: 'UnknownEntity', attributes: ['field1', 'field2'] }
      ]

      const contextResult = contextDetectionService.detectContext(entities)
      const component = componentFactory.getComponent(entities[0], contextResult)

      const { container } = render(component({ entity: entities[0] }))

      // Should render the standard EntityForm without specialized styling
      expect(container.querySelector('.border-l-blue-500')).not.toBeInTheDocument()
      expect(container.querySelector('.border-l-green-500')).not.toBeInTheDocument()
      expect(container.querySelector('.border-l-purple-500')).not.toBeInTheDocument()
      expect(screen.getByText('UnknownEntity')).toBeInTheDocument()
      expect(componentFactory.hasSpecificComponent(entities[0], contextResult)).toBe(false)
    })

    it('should fallback to EntityForm for generic domain entities', () => {
      const entities: Entity[] = [
        { name: 'Book', attributes: ['title', 'author'] }
      ]

      const contextResult = contextDetectionService.detectContext(entities)
      const component = componentFactory.getComponent(entities[0], contextResult)

      const { } = render(component({ entity: entities[0] }))

      expect(screen.getByText('Book')).toBeInTheDocument()
      expect(componentFactory.hasSpecificComponent(entities[0], contextResult)).toBe(false)
    })

    it('should handle entities that get detected as specific domain but have no specific component', () => {
      const entities: Entity[] = [
        { name: 'SpecialProduct', attributes: ['price', 'category'] } // Will be e-commerce but no specific component
      ]

      const contextResult = contextDetectionService.detectContext(entities)
      const component = componentFactory.getComponent(entities[0], contextResult)

      const { } = render(component({ entity: entities[0] }))

      expect(screen.getByText('SpecialProduct')).toBeInTheDocument()
      expect(componentFactory.hasSpecificComponent(entities[0], contextResult)).toBe(false)
    })
  })

  describe('Utility methods', () => {
    it('should return available components for each domain', () => {
      const ecommerceComponents = componentFactory.getAvailableComponents(DomainContext.ECOMMERCE)
      const userMgmtComponents = componentFactory.getAvailableComponents(DomainContext.USER_MANAGEMENT)
      const adminComponents = componentFactory.getAvailableComponents(DomainContext.ADMIN)
      const genericComponents = componentFactory.getAvailableComponents(DomainContext.GENERIC)

      expect(ecommerceComponents).toContain('product')
      expect(ecommerceComponents).toContain('order')
      expect(ecommerceComponents).toContain('customer')

      expect(userMgmtComponents).toContain('user')
      expect(userMgmtComponents).toContain('role')

      expect(adminComponents).toContain('admin')
      expect(adminComponents).toContain('report')

      expect(genericComponents).toEqual([])
    })

    it('should allow registering new components', () => {
      const customComponent: DomainComponent = ({ entity }) =>
        React.createElement('div', { 'data-testid': 'custom-component' }, entity.name)

      componentFactory.registerComponent(DomainContext.GENERIC, 'CustomEntity', customComponent)

      const entities: Entity[] = [
        { name: 'CustomEntity', attributes: ['field'] }
      ]

      const contextResult = {
        primaryContext: DomainContext.GENERIC,
        contextScores: [],
        entityDomainMap: new Map([['CustomEntity', DomainContext.GENERIC]])
      }

      const component = componentFactory.getComponent(entities[0], contextResult)
      const { } = render(component({ entity: entities[0] }))

      expect(screen.getByTestId('custom-component')).toBeInTheDocument()
      expect(componentFactory.hasSpecificComponent(entities[0], contextResult)).toBe(true)
    })
  })

  describe('Edge cases', () => {
    it('should handle case-insensitive entity names', () => {
      const entities: Entity[] = [
        { name: 'PRODUCT', attributes: ['price'] },
        { name: 'User', attributes: ['name'] },
        { name: 'admin', attributes: ['role'] }
      ]

      const contextResult = contextDetectionService.detectContext(entities)

      entities.forEach(entity => {
        expect(componentFactory.hasSpecificComponent(entity, contextResult)).toBe(true)
      })
    })

    it('should handle empty context results gracefully', () => {
      const entity: Entity = { name: 'TestEntity', attributes: [] }
      const emptyContextResult = {
        primaryContext: DomainContext.GENERIC,
        contextScores: [],
        entityDomainMap: new Map()
      }

      const component = componentFactory.getComponent(entity, emptyContextResult)
      expect(component).toBeDefined()
      expect(componentFactory.hasSpecificComponent(entity, emptyContextResult)).toBe(false)
    })
  })
})