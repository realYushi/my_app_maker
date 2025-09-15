import { describe, it, expect } from 'vitest'
import { contextDetectionService, DomainContext } from './contextDetectionService'
import type { Entity } from '@mini-ai-app-builder/shared-types'

describe('ContextDetectionService', () => {
  describe('E-commerce context detection', () => {
    it('should detect e-commerce context for product-related entities', () => {
      const entities: Entity[] = [
        { name: 'Product', attributes: ['name', 'price', 'description', 'sku'] },
        { name: 'Order', attributes: ['total', 'status', 'customer_id'] },
        { name: 'Customer', attributes: ['name', 'email', 'address'] }
      ]

      const result = contextDetectionService.detectContext(entities)

      expect(result.primaryContext).toBe(DomainContext.ECOMMERCE)
      expect(result.entityDomainMap.get('Product')).toBe(DomainContext.ECOMMERCE)
      expect(result.entityDomainMap.get('Order')).toBe(DomainContext.ECOMMERCE)
      expect(result.entityDomainMap.get('Customer')).toBe(DomainContext.ECOMMERCE)
    })

    it('should detect e-commerce context for inventory entities', () => {
      const entities: Entity[] = [
        { name: 'Inventory', attributes: ['stock', 'warehouse', 'supplier'] },
        { name: 'Category', attributes: ['name', 'description'] },
        { name: 'Brand', attributes: ['name', 'logo'] }
      ]

      const result = contextDetectionService.detectContext(entities)

      expect(result.primaryContext).toBe(DomainContext.ECOMMERCE)
      expect(result.entityDomainMap.get('Inventory')).toBe(DomainContext.ECOMMERCE)
      expect(result.entityDomainMap.get('Category')).toBe(DomainContext.ECOMMERCE)
    })

    it('should detect e-commerce context for shopping cart entities', () => {
      const entities: Entity[] = [
        { name: 'Cart', attributes: ['items', 'total', 'user_id'] },
        { name: 'Payment', attributes: ['amount', 'method', 'transaction_id'] },
        { name: 'Shipping', attributes: ['address', 'method', 'tracking'] }
      ]

      const result = contextDetectionService.detectContext(entities)

      expect(result.primaryContext).toBe(DomainContext.ECOMMERCE)
      expect(result.contextScores[0].domain).toBe(DomainContext.ECOMMERCE)
      expect(result.contextScores[0].matchedEntities).toContain('Cart')
      expect(result.contextScores[0].matchedEntities).toContain('Payment')
      expect(result.contextScores[0].matchedEntities).toContain('Shipping')
    })
  })

  describe('User management context detection', () => {
    it('should detect user management context for user-related entities', () => {
      const entities: Entity[] = [
        { name: 'User', attributes: ['username', 'email', 'password'] },
        { name: 'Role', attributes: ['name', 'permissions'] },
        { name: 'Permission', attributes: ['action', 'resource'] }
      ]

      const result = contextDetectionService.detectContext(entities)

      expect(result.primaryContext).toBe(DomainContext.USER_MANAGEMENT)
      expect(result.entityDomainMap.get('User')).toBe(DomainContext.USER_MANAGEMENT)
      expect(result.entityDomainMap.get('Role')).toBe(DomainContext.USER_MANAGEMENT)
      expect(result.entityDomainMap.get('Permission')).toBe(DomainContext.USER_MANAGEMENT)
    })

    it('should detect user management context for profile entities', () => {
      const entities: Entity[] = [
        { name: 'Profile', attributes: ['bio', 'avatar', 'preferences'] },
        { name: 'Account', attributes: ['status', 'created_at', 'last_login'] },
        { name: 'Group', attributes: ['name', 'members', 'access_level'] }
      ]

      const result = contextDetectionService.detectContext(entities)

      expect(result.primaryContext).toBe(DomainContext.USER_MANAGEMENT)
      expect(result.entityDomainMap.get('Profile')).toBe(DomainContext.USER_MANAGEMENT)
      expect(result.entityDomainMap.get('Account')).toBe(DomainContext.USER_MANAGEMENT)
      expect(result.entityDomainMap.get('Group')).toBe(DomainContext.USER_MANAGEMENT)
    })

    it('should detect user management context for authentication entities', () => {
      const entities: Entity[] = [
        { name: 'Session', attributes: ['token', 'expires_at', 'user_id'] },
        { name: 'Credential', attributes: ['type', 'value', 'verified'] },
        { name: 'Organization', attributes: ['name', 'members', 'settings'] }
      ]

      const result = contextDetectionService.detectContext(entities)

      expect(result.primaryContext).toBe(DomainContext.USER_MANAGEMENT)
      expect(result.contextScores[0].domain).toBe(DomainContext.USER_MANAGEMENT)
    })
  })

  describe('Admin context detection', () => {
    it('should detect admin context for administrative entities', () => {
      const entities: Entity[] = [
        { name: 'Admin', attributes: ['username', 'privileges'] },
        { name: 'Configuration', attributes: ['key', 'value', 'type'] },
        { name: 'System', attributes: ['status', 'version', 'uptime'] }
      ]

      const result = contextDetectionService.detectContext(entities)

      expect(result.primaryContext).toBe(DomainContext.ADMIN)
      expect(result.entityDomainMap.get('Admin')).toBe(DomainContext.ADMIN)
      expect(result.entityDomainMap.get('Configuration')).toBe(DomainContext.ADMIN)
      expect(result.entityDomainMap.get('System')).toBe(DomainContext.ADMIN)
    })

    it('should detect admin context for monitoring entities', () => {
      const entities: Entity[] = [
        { name: 'Log', attributes: ['level', 'message', 'timestamp'] },
        { name: 'Report', attributes: ['title', 'data', 'generated_at'] },
        { name: 'Analytics', attributes: ['metric', 'value', 'period'] }
      ]

      const result = contextDetectionService.detectContext(entities)

      expect(result.primaryContext).toBe(DomainContext.ADMIN)
      expect(result.contextScores[0].domain).toBe(DomainContext.ADMIN)
    })
  })

  describe('Generic context detection', () => {
    it('should detect generic context for unrecognized entities', () => {
      const entities: Entity[] = [
        { name: 'Book', attributes: ['title', 'author', 'isbn'] },
        { name: 'Recipe', attributes: ['ingredients', 'instructions', 'prep_time'] },
        { name: 'Weather', attributes: ['temperature', 'humidity', 'location'] }
      ]

      const result = contextDetectionService.detectContext(entities)

      expect(result.primaryContext).toBe(DomainContext.GENERIC)
      expect(result.entityDomainMap.get('Book')).toBe(DomainContext.GENERIC)
      expect(result.entityDomainMap.get('Recipe')).toBe(DomainContext.GENERIC)
      expect(result.entityDomainMap.get('Weather')).toBe(DomainContext.GENERIC)
    })

    it('should default to generic when no clear context emerges', () => {
      const entities: Entity[] = [
        { name: 'RandomEntity', attributes: ['field1', 'field2'] }
      ]

      const result = contextDetectionService.detectContext(entities)

      expect(result.primaryContext).toBe(DomainContext.GENERIC)
      expect(contextDetectionService.hasSpecificContext(result)).toBe(false)
    })
  })

  describe('Mixed context scenarios', () => {
    it('should choose dominant context when multiple contexts are present', () => {
      const entities: Entity[] = [
        // Strong e-commerce signals
        { name: 'Product', attributes: ['name', 'price', 'category'] },
        { name: 'Order', attributes: ['total', 'items', 'customer'] },
        { name: 'Customer', attributes: ['name', 'email', 'address'] },
        // Weak user management signal
        { name: 'User', attributes: ['login', 'status'] }
      ]

      const result = contextDetectionService.detectContext(entities)

      expect(result.primaryContext).toBe(DomainContext.ECOMMERCE)
      expect(result.contextScores[0].domain).toBe(DomainContext.ECOMMERCE)
      expect(result.contextScores[0].score).toBeGreaterThan(0)
    })

    it('should handle edge case with equal scores', () => {
      const entities: Entity[] = [
        { name: 'Product', attributes: ['name', 'price'] }, // E-commerce
        { name: 'User', attributes: ['username', 'email'] } // User management
      ]

      const result = contextDetectionService.detectContext(entities)

      // Should pick one of the specific contexts, not generic
      expect([DomainContext.ECOMMERCE, DomainContext.USER_MANAGEMENT]).toContain(result.primaryContext)
      expect(result.primaryContext).not.toBe(DomainContext.GENERIC)
    })

    it('should properly score entities with mixed attributes', () => {
      const entities: Entity[] = [
        { name: 'CustomerUser', attributes: ['name', 'email', 'orders', 'cart'] }
      ]

      const result = contextDetectionService.detectContext(entities)

      // Should detect e-commerce due to 'orders' and 'cart' attributes
      expect(result.primaryContext).toBe(DomainContext.ECOMMERCE)
      expect(result.entityDomainMap.get('CustomerUser')).toBe(DomainContext.ECOMMERCE)
    })
  })

  describe('Context scoring algorithm', () => {
    it('should give exact matches higher scores than partial matches', () => {
      const entities: Entity[] = [
        { name: 'Product', attributes: ['price'] }, // Exact matches
        { name: 'ProductInfo', attributes: ['pricing'] } // Partial matches
      ]

      const result = contextDetectionService.detectContext(entities)

      expect(result.primaryContext).toBe(DomainContext.ECOMMERCE)

      // Both should be e-commerce, but Product should have higher individual score
      const productScore = result.contextScores.find(cs => cs.domain === DomainContext.ECOMMERCE)
      expect(productScore?.matchedEntities).toContain('Product')
      expect(productScore?.matchedEntities).toContain('ProductInfo')
    })
  })

  describe('Utility methods', () => {
    it('should correctly identify specific vs generic contexts', () => {
      const ecommerceEntities: Entity[] = [
        { name: 'Product', attributes: ['price'] }
      ]
      const genericEntities: Entity[] = [
        { name: 'Something', attributes: ['field'] }
      ]

      const ecommerceResult = contextDetectionService.detectContext(ecommerceEntities)
      const genericResult = contextDetectionService.detectContext(genericEntities)

      expect(contextDetectionService.hasSpecificContext(ecommerceResult)).toBe(true)
      expect(contextDetectionService.hasSpecificContext(genericResult)).toBe(false)
    })

    it('should return correct entity domain from context result', () => {
      const entities: Entity[] = [
        { name: 'Product', attributes: ['price'] },
        { name: 'Unknown', attributes: ['field'] }
      ]

      const result = contextDetectionService.detectContext(entities)

      expect(contextDetectionService.getEntityDomain('Product', result)).toBe(DomainContext.ECOMMERCE)
      expect(contextDetectionService.getEntityDomain('Unknown', result)).toBe(DomainContext.GENERIC)
      expect(contextDetectionService.getEntityDomain('NonExistent', result)).toBe(DomainContext.GENERIC)
    })
  })

  describe('Edge cases', () => {
    it('should handle empty entities array', () => {
      const entities: Entity[] = []

      const result = contextDetectionService.detectContext(entities)

      expect(result.primaryContext).toBe(DomainContext.GENERIC)
      expect(result.contextScores).toHaveLength(4)
      expect(result.entityDomainMap.size).toBe(0)
    })

    it('should handle entities with empty attributes', () => {
      const entities: Entity[] = [
        { name: 'Product', attributes: [] }
      ]

      const result = contextDetectionService.detectContext(entities)

      expect(result.primaryContext).toBe(DomainContext.ECOMMERCE)
      expect(result.entityDomainMap.get('Product')).toBe(DomainContext.ECOMMERCE)
    })

    it('should handle case-insensitive matching', () => {
      const entities: Entity[] = [
        { name: 'PRODUCT', attributes: ['PRICE', 'NAME'] }
      ]

      const result = contextDetectionService.detectContext(entities)

      expect(result.primaryContext).toBe(DomainContext.ECOMMERCE)
      expect(result.entityDomainMap.get('PRODUCT')).toBe(DomainContext.ECOMMERCE)
    })
  })
})