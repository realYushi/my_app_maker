import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProductCard from './ProductCard'
import type { Entity } from '@mini-ai-app-builder/shared-types'

describe('ProductCard', () => {
  const mockEntity: Entity = {
    name: 'Test Product',
    attributes: ['wireless', 'portable', 'high-quality']
  }

  it('renders product card with entity name', () => {
    render(<ProductCard entity={mockEntity} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })

  it('displays product attributes', () => {
    render(<ProductCard entity={mockEntity} />)
    expect(screen.getByText(/Features: wireless, portable, high-quality/)).toBeInTheDocument()
  })

  it('shows default price when no price provided', () => {
    render(<ProductCard entity={mockEntity} />)
    const priceElement = screen.getAllByText(/\$\d+\.\d{2}/)[0]
    expect(priceElement).toBeInTheDocument()
  })

  it('shows custom price when provided', () => {
    render(<ProductCard entity={mockEntity} price={99.99} />)
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })

  it('displays rating stars', () => {
    render(<ProductCard entity={mockEntity} rating={4.5} />)
    const ratingElement = screen.getByText('(4.5)')
    expect(ratingElement).toBeInTheDocument()
  })

  it('shows add to cart button when in stock', () => {
    render(<ProductCard entity={mockEntity} inStock={true} />)
    const button = screen.getByText('🛒 Add to Cart')
    expect(button).toBeInTheDocument()
    expect(button).toBeEnabled()
  })

  it('shows out of stock button when not in stock', () => {
    render(<ProductCard entity={mockEntity} inStock={false} />)
    const button = screen.getByRole('button', { name: 'Out of Stock' })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
  })

  it('displays out of stock badge when not in stock', () => {
    const { container } = render(<ProductCard entity={mockEntity} inStock={false} />)
    const badge = container.querySelector('.absolute.top-2.right-2')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Out of Stock')
  })

  it('displays product image when imageUrl provided', () => {
    const imageUrl = 'https://example.com/image.jpg'
    render(<ProductCard entity={mockEntity} imageUrl={imageUrl} />)
    const image = screen.getByAltText('Test Product')
    expect(image).toHaveAttribute('src', imageUrl)
  })

  it('shows placeholder when no image provided', () => {
    render(<ProductCard entity={mockEntity} />)
    expect(screen.getByText('Product Image')).toBeInTheDocument()
  })

  it('generates consistent mock price based on entity name', () => {
    const entity1: Entity = { name: 'Product A', attributes: [] }
    const entity2: Entity = { name: 'Product A', attributes: [] }

    const { rerender } = render(<ProductCard entity={entity1} />)
    const price1 = screen.getAllByText(/\$\d+\.\d{2}/)[0].textContent

    rerender(<ProductCard entity={entity2} />)
    const price2 = screen.getAllByText(/\$\d+\.\d{2}/)[0].textContent

    expect(price1).toBe(price2)
  })

  it('truncates long attribute lists', () => {
    const longAttributeEntity: Entity = {
      name: 'Test Product',
      attributes: ['attr1', 'attr2', 'attr3', 'attr4', 'attr5']
    }

    render(<ProductCard entity={longAttributeEntity} />)
    expect(screen.getByText(/Features: attr1, attr2, attr3\.\.\./)).toBeInTheDocument()
  })

  it('handles entities with no attributes', () => {
    const noAttributeEntity: Entity = {
      name: 'Simple Product',
      attributes: []
    }

    render(<ProductCard entity={noAttributeEntity} />)
    expect(screen.getByText('Simple Product')).toBeInTheDocument()
    expect(screen.queryByText(/Features:/)).not.toBeInTheDocument()
  })
})