import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { componentFactory } from '../../../services/componentFactory'
import { DomainContext, type ContextDetectionResult } from '../../../services/contextDetectionService'
import type { Entity } from '@mini-ai-app-builder/shared-types'

// Mock the context detection result
const createMockContextResult = (primaryContext: DomainContext, entityDomainMap: Map<string, DomainContext>): ContextDetectionResult => ({
  primaryContext,
  contextScores: [
    {
      domain: primaryContext,
      score: 0.8,
      matchedEntities: ['test']
    }
  ],
  entityDomainMap
})

describe('ComponentFactory E-commerce Integration', () => {
  describe('E-commerce component routing', () => {
    it('routes product entities to EcommerceProductDisplay', () => {
      const entity: Entity = { name: 'product', attributes: ['name', 'price'] }
      const contextResult = createMockContextResult(
        DomainContext.ECOMMERCE,
        new Map([['product', DomainContext.ECOMMERCE]])
      )

      const Component = componentFactory.getComponent(entity, contextResult)
      render(<Component entity={entity} />)

      expect(screen.getByText('🛍️ Product Card')).toBeInTheDocument()
    })

    it('routes cart entities to EcommerceCartDisplay', () => {
      const entity: Entity = { name: 'cart', attributes: ['items', 'total'] }
      const contextResult = createMockContextResult(
        DomainContext.ECOMMERCE,
        new Map([['cart', DomainContext.ECOMMERCE]])
      )

      const Component = componentFactory.getComponent(entity, contextResult)
      render(<Component entity={entity} />)

      expect(screen.getByText('🛒 Shopping Cart')).toBeInTheDocument()
    })

    it('routes checkout entities to EcommerceCheckoutDisplay', () => {
      const entity: Entity = { name: 'checkout', attributes: ['payment', 'shipping'] }
      const contextResult = createMockContextResult(
        DomainContext.ECOMMERCE,
        new Map([['checkout', DomainContext.ECOMMERCE]])
      )

      const Component = componentFactory.getComponent(entity, contextResult)
      render(<Component entity={entity} />)

      expect(screen.getByText('💳 Checkout Flow')).toBeInTheDocument()
    })

    it('falls back to EntityForm for unmapped e-commerce entities', () => {
      const entity: Entity = { name: 'unknown_entity', attributes: ['field1', 'field2'] }
      const contextResult = createMockContextResult(
        DomainContext.ECOMMERCE,
        new Map([['unknown_entity', DomainContext.ECOMMERCE]])
      )

      const Component = componentFactory.getComponent(entity, contextResult)
      render(<Component entity={entity} />)

      // Should render the generic EntityForm
      expect(screen.getByText('unknown_entity')).toBeInTheDocument()
      expect(screen.getByText('field1')).toBeInTheDocument()
    })

    it('handles generic domain entities with fallback', () => {
      const entity: Entity = { name: 'generic_entity', attributes: ['attr1'] }
      const contextResult = createMockContextResult(
        DomainContext.GENERIC,
        new Map([['generic_entity', DomainContext.GENERIC]])
      )

      const Component = componentFactory.getComponent(entity, contextResult)
      render(<Component entity={entity} />)

      expect(screen.getByText('generic_entity')).toBeInTheDocument()
    })
  })

  describe('Component registry verification', () => {
    it('verifies e-commerce components are registered', () => {
      expect(componentFactory.verifyEcommerceComponentsRegistered()).toBe(true)
    })

    it('returns correct available components for e-commerce domain', () => {
      const availableComponents = componentFactory.getAvailableComponents(DomainContext.ECOMMERCE)

      expect(availableComponents).toContain('product')
      expect(availableComponents).toContain('cart')
      expect(availableComponents).toContain('checkout')
      expect(availableComponents).toContain('basket')
      expect(availableComponents).toContain('payment')
    })

    it('has specific component for known e-commerce entities', () => {
      const productEntity: Entity = { name: 'product', attributes: [] }
      const cartEntity: Entity = { name: 'cart', attributes: [] }
      const contextResult = createMockContextResult(
        DomainContext.ECOMMERCE,
        new Map([
          ['product', DomainContext.ECOMMERCE],
          ['cart', DomainContext.ECOMMERCE]
        ])
      )

      expect(componentFactory.hasSpecificComponent(productEntity, contextResult)).toBe(true)
      expect(componentFactory.hasSpecificComponent(cartEntity, contextResult)).toBe(true)
    })

    it('does not have specific component for unknown entities', () => {
      const unknownEntity: Entity = { name: 'unknown', attributes: [] }
      const contextResult = createMockContextResult(
        DomainContext.ECOMMERCE,
        new Map([['unknown', DomainContext.ECOMMERCE]])
      )

      expect(componentFactory.hasSpecificComponent(unknownEntity, contextResult)).toBe(false)
    })

    it('can register new components dynamically', () => {
      const testComponent = ({ entity }: { entity: Entity }) => <div data-testid="test-component">{entity.name}</div>

      componentFactory.registerComponent(DomainContext.ECOMMERCE, 'test_entity', testComponent)

      const testEntity: Entity = { name: 'test_entity', attributes: [] }
      const contextResult = createMockContextResult(
        DomainContext.ECOMMERCE,
        new Map([['test_entity', DomainContext.ECOMMERCE]])
      )

      expect(componentFactory.hasSpecificComponent(testEntity, contextResult)).toBe(true)

      const Component = componentFactory.getComponent(testEntity, contextResult)
      render(<Component entity={testEntity} />)

      expect(screen.getByTestId('test-component')).toBeInTheDocument()
    })

    it('returns total number of registered components', () => {
      const totalComponents = componentFactory.getTotalRegisteredComponents()
      expect(totalComponents).toBeGreaterThan(0)
      expect(typeof totalComponents).toBe('number')
    })
  })

  describe('Entity name variations', () => {
    it('handles plural product entity names', () => {
      const entity: Entity = { name: 'products', attributes: [] }
      const contextResult = createMockContextResult(
        DomainContext.ECOMMERCE,
        new Map([['products', DomainContext.ECOMMERCE]])
      )

      const Component = componentFactory.getComponent(entity, contextResult)
      const { container } = render(<Component entity={entity} />)

      expect(container.querySelector('.border-l-blue-500')).toBeInTheDocument()
    })

    it('handles shopping_cart entity name', () => {
      const entity: Entity = { name: 'shopping_cart', attributes: [] }
      const contextResult = createMockContextResult(
        DomainContext.ECOMMERCE,
        new Map([['shopping_cart', DomainContext.ECOMMERCE]])
      )

      const Component = componentFactory.getComponent(entity, contextResult)
      const { container } = render(<Component entity={entity} />)

      expect(container.querySelector('.border-l-green-500')).toBeInTheDocument()
    })

    it('handles payment entity name for checkout', () => {
      const entity: Entity = { name: 'payment', attributes: [] }
      const contextResult = createMockContextResult(
        DomainContext.ECOMMERCE,
        new Map([['payment', DomainContext.ECOMMERCE]])
      )

      const Component = componentFactory.getComponent(entity, contextResult)
      const { container } = render(<Component entity={entity} />)

      expect(container.querySelector('.border-l-purple-500')).toBeInTheDocument()
    })
  })
})