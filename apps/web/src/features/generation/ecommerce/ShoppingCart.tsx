import React, { useState } from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'

interface CartItem {
  id: string
  entity: Entity
  quantity: number
  price: number
  imageUrl?: string
}

interface ShoppingCartProps {
  items?: CartItem[]
  onUpdateQuantity?: (itemId: string, quantity: number) => void
  onRemoveItem?: (itemId: string) => void
  onCheckout?: () => void
  isOpen?: boolean
  onClose?: () => void
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isOpen = true,
  onClose
}) => {
  const [isProcessing, setIsProcessing] = useState(false)

  // Use provided items, or generate mock items only if no items prop provided
  const cartItems: CartItem[] = items || [
    {
      id: '1',
      entity: { name: 'Premium Headphones', attributes: ['wireless', 'noise-canceling', 'bluetooth'] },
      quantity: 1,
      price: 299.99,
      imageUrl: undefined
    },
    {
      id: '2',
      entity: { name: 'Running Shoes', attributes: ['comfortable', 'breathable', 'durable'] },
      quantity: 2,
      price: 129.99,
      imageUrl: undefined
    }
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08
  const shipping = subtotal > 50 ? 0 : 9.99
  const total = subtotal + tax + shipping

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    onUpdateQuantity?.(itemId, newQuantity)
  }

  const handleRemoveItem = (itemId: string) => {
    onRemoveItem?.(itemId)
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    // Simulate checkout process
    setTimeout(() => {
      setIsProcessing(false)
      onCheckout?.()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="max-h-96 overflow-y-auto">
        {cartItems.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div key={item.id} className="p-4 flex gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.entity.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {item.entity.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.entity.attributes.slice(0, 2).join(', ')}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-sm font-medium border-x border-gray-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600">Add some products to get started</p>
          </div>
        )}
      </div>

      {/* Cart Summary */}
      {cartItems.length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
              isProcessing
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              '🔒 Proceed to Checkout'
            )}
          </button>

          {/* Continue Shopping */}
          <button className="w-full mt-2 py-2 px-4 text-sm text-blue-600 hover:text-blue-700 transition-colors">
            ← Continue Shopping
          </button>
        </div>
      )}
    </div>
  )
}

export default ShoppingCart