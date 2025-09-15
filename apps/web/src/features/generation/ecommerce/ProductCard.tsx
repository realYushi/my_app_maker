import React from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'

interface ProductCardProps {
  entity: Entity
  price?: number
  rating?: number
  imageUrl?: string
  inStock?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({
  entity,
  price = 29.99,
  rating = 4.5,
  imageUrl,
  inStock = true
}) => {
  const generateMockPrice = () => {
    // Generate consistent mock price based on entity name
    const hash = entity.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return ((hash % 500) + 10) + 0.99
  }

  const generateMockRating = () => {
    // Generate consistent mock rating based on entity attributes
    const hash = entity.attributes.join('').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return Math.max(3, Math.min(5, (hash % 50) / 10))
  }

  const mockPrice = price || generateMockPrice()
  const mockRating = rating || generateMockRating()
  const fullStars = Math.floor(mockRating)
  const hasHalfStar = mockRating % 1 >= 0.5

  const renderStars = () => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">⭐</span>)
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>)
      }
    }
    return stars
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={entity.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <svg className="w-16 h-16 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Product Image</span>
          </div>
        )}

        {/* Stock Badge */}
        {!inStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {entity.name}
        </h3>

        {/* Product Attributes Preview */}
        {entity.attributes.length > 0 && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            Features: {entity.attributes.slice(0, 3).join(', ')}
            {entity.attributes.length > 3 && '...'}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {renderStars()}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            ({mockRating.toFixed(1)})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">
              ${mockPrice.toFixed(2)}
            </span>
            {/* Show original price for demonstrative purposes */}
            {mockPrice < 100 && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${(mockPrice * 1.3).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          disabled={!inStock}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
            inStock
              ? 'bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {inStock ? '🛒 Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard