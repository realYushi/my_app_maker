import React from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'
import ShoppingCart from './ShoppingCart'

interface EcommerceCartDisplayProps {
  entity: Entity
}

const EcommerceCartDisplay = ({ entity }: EcommerceCartDisplayProps): React.ReactElement => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow border-l-4 border-l-green-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          {entity.name}
        </h3>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
          🛒 Shopping Cart
        </span>
      </div>
      <div className="mb-4 text-sm text-gray-600">
        Interactive shopping cart with quantity controls, item management, and checkout flow.
      </div>
      <div className="max-w-md">
        <ShoppingCart
          isOpen={true}
          onClose={() => {}}
        />
      </div>
    </div>
  )
}

export default EcommerceCartDisplay