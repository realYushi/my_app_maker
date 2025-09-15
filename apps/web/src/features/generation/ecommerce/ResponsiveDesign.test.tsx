import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProductCard from './ProductCard'
import CatalogGrid from './CatalogGrid'
import ShoppingCart from './ShoppingCart'
import type { Entity } from '@mini-ai-app-builder/shared-types'

// Mock window.matchMedia
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  })
}

describe('Responsive Design Tests', () => {
  const mockEntity: Entity = {
    name: 'Test Product',
    attributes: ['wireless', 'portable']
  }

  const mockEntities: Entity[] = [
    { name: 'Product 1', attributes: ['attr1'] },
    { name: 'Product 2', attributes: ['attr2'] },
    { name: 'Product 3', attributes: ['attr3'] },
    { name: 'Product 4', attributes: ['attr4'] }
  ]

  describe('ProductCard responsive behavior', () => {
    it('renders properly on mobile viewport', () => {
      mockMatchMedia(true) // mobile
      const { container } = render(<ProductCard entity={mockEntity} />)

      // Check that the card maintains its structure on mobile
      expect(container.querySelector('.aspect-square')).toBeInTheDocument()
      expect(screen.getByText('Test Product')).toBeInTheDocument()
      expect(screen.getByText('🛒 Add to Cart')).toBeInTheDocument()
    })

    it('renders properly on desktop viewport', () => {
      mockMatchMedia(false) // desktop
      const { container } = render(<ProductCard entity={mockEntity} />)

      expect(container.querySelector('.aspect-square')).toBeInTheDocument()
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })

    it('handles long product names gracefully', () => {
      const longNameEntity: Entity = {
        name: 'This is a very long product name that should be truncated properly in the UI',
        attributes: ['attr1']
      }

      render(<ProductCard entity={longNameEntity} />)
      expect(screen.getByText(/This is a very long product name/)).toBeInTheDocument()
    })
  })

  describe('CatalogGrid responsive behavior', () => {
    it('applies responsive grid classes', () => {
      const { container } = render(<CatalogGrid entities={mockEntities} />)

      const gridContainer = container.querySelector('.grid')
      expect(gridContainer).toHaveClass('grid-cols-1')
      expect(gridContainer).toHaveClass('sm:grid-cols-2')
      expect(gridContainer).toHaveClass('lg:grid-cols-3')
      expect(gridContainer).toHaveClass('xl:grid-cols-4')
    })

    it('shows responsive header layout', () => {
      const { container } = render(<CatalogGrid entities={mockEntities} showFilters={true} />)

      const headerContainer = container.querySelector('.flex')
      expect(headerContainer).toHaveClass('flex-col')
      expect(headerContainer).toHaveClass('sm:flex-row')
    })

    it('handles empty state properly', () => {
      render(<CatalogGrid entities={[]} />)
      expect(screen.getByText('No products found')).toBeInTheDocument()
    })
  })

  describe('ShoppingCart responsive behavior', () => {
    const mockItems = [
      {
        id: '1',
        entity: mockEntity,
        quantity: 1,
        price: 99.99
      }
    ]

    it('renders cart items in mobile-friendly layout', () => {
      const { container } = render(<ShoppingCart items={mockItems} />)

      // Check that cart items have responsive layout
      const cartItem = container.querySelector('.flex.gap-4')
      expect(cartItem).toBeInTheDocument()
    })

    it('shows responsive summary layout', () => {
      const { container } = render(<ShoppingCart items={mockItems} />)

      // Check for responsive spacing
      expect(container.querySelector('.space-y-2')).toBeInTheDocument()
    })

    it('handles quantity controls in mobile view', () => {
      render(<ShoppingCart items={mockItems} />)

      const increaseButton = screen.getByText('+')
      const decreaseButton = screen.getByText('-')

      expect(increaseButton).toBeInTheDocument()
      expect(decreaseButton).toBeInTheDocument()
    })
  })

  describe('Viewport-specific CSS classes', () => {
    it('ProductCard uses responsive text classes', () => {
      const { container } = render(<ProductCard entity={mockEntity} />)

      // Check for responsive text sizing
      expect(container.querySelector('.text-lg')).toBeInTheDocument()
      expect(container.querySelector('.text-sm')).toBeInTheDocument()
    })

    it('CatalogGrid uses responsive spacing', () => {
      const { container } = render(<CatalogGrid entities={mockEntities} />)

      // Check for responsive gaps
      expect(container.querySelector('.gap-6')).toBeInTheDocument()
    })

    it('ShoppingCart uses responsive padding', () => {
      const { container } = render(<ShoppingCart />)

      // Check for responsive padding classes
      expect(container.querySelector('.p-4')).toBeInTheDocument()
    })
  })

  describe('Touch-friendly interaction areas', () => {
    it('ProductCard button has adequate touch target size', () => {
      render(<ProductCard entity={mockEntity} />)

      const button = screen.getByText('🛒 Add to Cart')
      expect(button).toHaveClass('py-2', 'px-4')
    })

    it('ShoppingCart quantity controls have touch-friendly size', () => {
      const mockItems = [{
        id: '1',
        entity: mockEntity,
        quantity: 1,
        price: 99.99
      }]

      render(<ShoppingCart items={mockItems} />)

      const increaseButton = screen.getByText('+')
      expect(increaseButton).toHaveClass('px-2', 'py-1')
    })
  })

  describe('Content truncation and overflow', () => {
    it('handles long attribute lists in ProductCard', () => {
      const longAttributeEntity: Entity = {
        name: 'Product',
        attributes: ['very-long-attribute-name-1', 'very-long-attribute-name-2', 'very-long-attribute-name-3', 'very-long-attribute-name-4']
      }

      render(<ProductCard entity={longAttributeEntity} />)
      expect(screen.getByText(/\.\.\./)).toBeInTheDocument()
    })

    it('handles long product names in cart items', () => {
      const longNameEntity: Entity = {
        name: 'This is an extremely long product name that should be handled gracefully in the shopping cart',
        attributes: ['attr1']
      }

      const mockItems = [{
        id: '1',
        entity: longNameEntity,
        quantity: 1,
        price: 99.99
      }]

      render(<ShoppingCart items={mockItems} />)
      expect(screen.getByText(/This is an extremely long product name/)).toBeInTheDocument()
    })
  })
})