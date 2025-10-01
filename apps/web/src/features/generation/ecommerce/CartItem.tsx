import React from 'react';
import type { Entity } from '@mini-ai-app-builder/shared-types';

interface CartItemProps {
  entity: Entity;
  quantity: number;
  price: number;
  imageUrl?: string;
  onUpdateQuantity?: (quantity: number) => void;
  onRemove?: () => void;
  compact?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
  entity,
  quantity,
  price,
  imageUrl,
  onUpdateQuantity,
  onRemove,
  compact = false,
}) => {
  const totalPrice = price * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    onUpdateQuantity?.(newQuantity);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
        {/* Compact Image */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded bg-gray-200">
          {imageUrl ? (
            <img src={imageUrl} alt={entity.name} className="h-full w-full rounded object-cover" />
          ) : (
            <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* Compact Details */}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-gray-900">{entity.name}</div>
          <div className="text-xs text-gray-500">
            Qty: {quantity} × ${price.toFixed(2)}
          </div>
        </div>

        {/* Compact Total */}
        <div className="text-sm font-medium text-gray-900">${totalPrice.toFixed(2)}</div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 border-b border-gray-200 p-4 last:border-b-0">
      {/* Product Image */}
      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
        {imageUrl ? (
          <img src={imageUrl} alt={entity.name} className="h-full w-full rounded-lg object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="min-w-0 flex-1">
        <div className="flex h-full flex-col">
          <div className="flex-1">
            <h3 className="mb-1 text-base font-medium text-gray-900">{entity.name}</h3>

            {/* Attributes */}
            {entity.attributes.length > 0 && (
              <div className="mb-2">
                <div className="flex flex-wrap gap-1">
                  {entity.attributes.slice(0, 3).map((attr, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
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
            <div className="mb-3 text-lg font-semibold text-gray-900">
              ${price.toFixed(2)}
              {quantity > 1 && <span className="ml-2 text-sm font-normal text-gray-600">each</span>}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center">
              <span className="mr-3 text-sm text-gray-600">Qty:</span>
              <div className="flex items-center rounded-md border border-gray-300">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-3 py-1 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  -
                </button>
                <span className="min-w-[3rem] border-x border-gray-300 px-4 py-1 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-1 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
                >
                  +
                </button>
              </div>
            </div>

            {/* Remove Button */}
            {onRemove && (
              <button
                onClick={onRemove}
                className="flex items-center gap-1 text-sm text-red-600 transition-colors hover:text-red-800"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Total Price */}
      <div className="flex-shrink-0 text-right">
        <div className="text-lg font-semibold text-gray-900">${totalPrice.toFixed(2)}</div>
        {quantity > 1 && (
          <div className="text-sm text-gray-500">
            {quantity} × ${price.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;
