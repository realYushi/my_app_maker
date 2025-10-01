import React from 'react';
import type { Entity } from '@mini-ai-app-builder/shared-types';

interface EcommerceCheckoutDisplayProps {
  entity: Entity;
}

const EcommerceCheckoutDisplay = ({
  entity,
}: EcommerceCheckoutDisplayProps): React.ReactElement => {
  return (
    <div className="rounded-lg border border-l-4 border-gray-200 border-l-purple-500 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center text-lg font-medium text-gray-900">
          <span className="mr-2 h-2 w-2 rounded-full bg-purple-500"></span>
          {entity.name}
        </h3>
        <span className="inline-flex items-center rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
          💳 Checkout Flow
        </span>
      </div>
      <div className="mb-4 text-sm text-gray-600">
        Complete checkout process with shipping, payment, and order confirmation steps.
      </div>
      <div className="rounded-lg bg-gray-50 p-4">
        <p className="mb-3 text-sm text-gray-600">
          <strong>Checkout Preview:</strong> This would display the full checkout flow interface.
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
              1
            </span>
            <span>Shipping Information</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-400">
              2
            </span>
            <span>Payment Details</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-400">
              3
            </span>
            <span>Order Review</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-400">
              4
            </span>
            <span>Confirmation</span>
          </div>
        </div>
        <button className="mt-3 w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700">
          Start Checkout Demo
        </button>
      </div>
    </div>
  );
};

export default EcommerceCheckoutDisplay;
