import React from 'react';
import type { Entity } from '@mini-ai-app-builder/shared-types';

interface CartItem {
  id: string;
  entity: Entity;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface OrderSummaryProps {
  items: CartItem[];
  subtotal?: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  total?: number;
  promoCode?: string;
  onApplyPromo?: (code: string) => void;
  showItemDetails?: boolean;
  compact?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  tax,
  shipping,
  discount = 0,
  total,
  promoCode = '',
  onApplyPromo,
  showItemDetails = true,
  compact = false,
}) => {
  const [promoInput, setPromoInput] = React.useState('');

  // Calculate values if not provided
  const calculatedSubtotal =
    subtotal || items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const calculatedTax = tax || calculatedSubtotal * 0.08;
  const calculatedShipping = shipping !== undefined ? shipping : calculatedSubtotal > 50 ? 0 : 9.99;
  const calculatedTotal =
    total || calculatedSubtotal + calculatedTax + calculatedShipping - discount;

  const handleApplyPromo = () => {
    if (promoInput.trim()) {
      onApplyPromo?.(promoInput.trim());
      setPromoInput('');
    }
  };

  if (compact) {
    return (
      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="mb-3 font-medium text-gray-900">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
            <span>${calculatedSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${calculatedTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{calculatedShipping === 0 ? 'Free' : `$${calculatedShipping.toFixed(2)}`}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${calculatedTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
        <p className="mt-1 text-sm text-gray-600">
          {items.length} item{items.length !== 1 ? 's' : ''} in your order
        </p>
      </div>

      {/* Items List */}
      {showItemDetails && (
        <div className="border-b border-gray-200 p-4">
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex gap-3">
                {/* Item Image */}
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded bg-gray-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.entity.name}
                      className="h-full w-full rounded object-cover"
                    />
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

                {/* Item Details */}
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-medium text-gray-900">{item.entity.name}</h4>
                  <p className="mt-1 text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>

                {/* Item Price */}
                <div className="text-sm font-medium text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Promo Code Section */}
      {onApplyPromo && (
        <div className="border-b border-gray-200 p-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Promo Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={e => setPromoInput(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleApplyPromo}
                disabled={!promoInput.trim()}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                Apply
              </button>
            </div>
            {promoCode && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Promo code &quot;{promoCode}&quot; applied
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Totals */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
            </span>
            <span className="font-medium text-gray-900">${calculatedSubtotal.toFixed(2)}</span>
          </div>

          {/* Tax */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (8%)</span>
            <span className="font-medium text-gray-900">${calculatedTax.toFixed(2)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium text-gray-900">
              {calculatedShipping === 0 ? (
                <span className="font-medium text-green-600">Free</span>
              ) : (
                `$${calculatedShipping.toFixed(2)}`
              )}
            </span>
          </div>

          {/* Free Shipping Threshold */}
          {calculatedShipping > 0 && calculatedSubtotal < 50 && (
            <div className="rounded bg-blue-50 p-2 text-xs text-blue-600">
              💡 Add ${(50 - calculatedSubtotal).toFixed(2)} more for free shipping!
            </div>
          )}

          {/* Discount */}
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium text-green-600">-${discount.toFixed(2)}</span>
            </div>
          )}

          {/* Total */}
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <span className="text-base font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">${calculatedTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Savings Display */}
          {discount > 0 && (
            <div className="rounded bg-green-50 p-2 text-center text-sm text-green-600">
              🎉 You saved ${discount.toFixed(2)} on this order!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
