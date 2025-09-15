import React from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'

interface EcommerceCheckoutDisplayProps {
  entity: Entity
}

const EcommerceCheckoutDisplay = ({ entity }: EcommerceCheckoutDisplayProps): React.ReactElement => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
          {entity.name}
        </h3>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
          💳 Checkout Flow
        </span>
      </div>
      <div className="mb-4 text-sm text-gray-600">
        Complete checkout process with shipping, payment, and order confirmation steps.
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-3">
          <strong>Checkout Preview:</strong> This would display the full checkout flow interface.
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
            <span>Shipping Information</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
            <span>Payment Details</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
            <span>Order Review</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-xs font-semibold">4</span>
            <span>Confirmation</span>
          </div>
        </div>
        <button className="mt-3 w-full py-2 px-4 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
          Start Checkout Demo
        </button>
      </div>
    </div>
  )
}

export default EcommerceCheckoutDisplay