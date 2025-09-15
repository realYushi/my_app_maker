import React from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'

interface CartItemProps {
  entity: Entity
  quantity: number
  price: number
  imageUrl?: string
  onUpdateQuantity?: (quantity: number) => void
  onRemove?: () => void
  compact?: boolean
}

const CartItem: React.FC<CartItemProps> = ({
  entity,
  quantity,
  price,
  imageUrl,
  onUpdateQuantity,
  onRemove,
  compact = false
}) => {
  const totalPrice = price * quantity

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    onUpdateQuantity?.(newQuantity)
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        {/* Compact Image */}
        <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={entity.name} className="w-full h-full object-cover rounded" />
          ) : (
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        {/* Compact Details */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {entity.name}
          </div>
          <div className="text-xs text-gray-500">
            Qty: {quantity} × ${price.toFixed(2)}
          </div>
        </div>

        {/* Compact Total */}
        <div className="text-sm font-medium text-gray-900">
          ${totalPrice.toFixed(2)}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4 p-4 border-b border-gray-200 last:border-b-0">
      {/* Product Image */}
      <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={entity.name} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900 mb-1">
              {entity.name}
            </h3>

            {/* Attributes */}
            {entity.attributes.length > 0 && (
              <div className="mb-2">
                <div className="flex flex-wrap gap-1">
                  {entity.attributes.slice(0, 3).map((attr, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                    >
                      {attr}
                    </span>
                  ))}
                  {entity.attributes.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{entity.attributes.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="text-lg font-semibold text-gray-900 mb-3">
              ${price.toFixed(2)}
              {quantity > 1 && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  each
                </span>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-3">Qty:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1 text-sm font-medium border-x border-gray-300 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Remove Button */}
            {onRemove && (
              <button
                onClick={onRemove}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Total Price */}
      <div className="flex-shrink-0 text-right">
        <div className="text-lg font-semibold text-gray-900">
          ${totalPrice.toFixed(2)}
        </div>
        {quantity > 1 && (
          <div className="text-sm text-gray-500">
            {quantity} × ${price.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  )
}

export default CartItem