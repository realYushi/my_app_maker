import React from 'react';
import type { Entity } from '@mini-ai-app-builder/shared-types';
import ShoppingCart from './ShoppingCart';

interface EcommerceCartDisplayProps {
  entity: Entity;
}

const EcommerceCartDisplay = ({ entity }: EcommerceCartDisplayProps): React.ReactElement => {
  return (
    <div className="rounded-lg border border-l-4 border-gray-200 border-l-green-500 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center text-lg font-medium text-gray-900">
          <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
          {entity.name}
        </h3>
        <span className="inline-flex items-center rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
          🛒 Shopping Cart
        </span>
      </div>
      <div className="mb-4 text-sm text-gray-600">
        Interactive shopping cart with quantity controls, item management, and checkout flow.
      </div>
      <div className="max-w-md">
        <ShoppingCart
          isOpen={true}
          onClose={() => {
            // Cart is always open in this display component
          }}
        />
      </div>
    </div>
  );
};

export default EcommerceCartDisplay;
