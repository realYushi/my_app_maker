import React, { useState } from 'react';
import type { Entity } from '@mini-ai-app-builder/shared-types';

interface CartItem {
  id: string;
  entity: Entity;
  quantity: number;
  price: number;
}

interface OrderData {
  items: CartItem[];
  shipping: ShippingInfo;
  payment: PaymentInfo;
  total: number;
  orderId: string;
  orderNumber: string;
}

interface CheckoutFlowProps {
  items?: CartItem[];
  onComplete?: (orderData: OrderData) => void;
  onCancel?: () => void;
}

type CheckoutStep = 'shipping' | 'payment' | 'review' | 'confirmation';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  billingAddressSame: boolean;
}

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ items = [], onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddressSame: true,
  });

  // Mock items if none provided
  const mockItems: CartItem[] =
    items.length > 0
      ? items
      : [
          {
            id: '1',
            entity: { name: 'Premium Headphones', attributes: ['wireless', 'noise-canceling'] },
            quantity: 1,
            price: 299.99,
          },
        ];

  const subtotal = mockItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const steps = [
    { id: 'shipping', title: 'Shipping', icon: '📦' },
    { id: 'payment', title: 'Payment', icon: '💳' },
    { id: 'review', title: 'Review', icon: '👀' },
    { id: 'confirmation', title: 'Confirmation', icon: '✅' },
  ];

  const stepIndex = steps.findIndex(step => step.id === currentStep);

  const handleNextStep = () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id as CheckoutStep);
    }
  };

  const handlePrevStep = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id as CheckoutStep);
    }
  };

  const handleCompleteOrder = async () => {
    setIsProcessing(true);
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep('confirmation');
      onComplete?.({
        items: mockItems,
        shipping: shippingInfo,
        payment: paymentInfo,
        total,
        orderId: `order-${Date.now()}`,
        orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}`,
      });
    }, 3000);
  };

  const renderStepIndicator = () => (
    <div className="mb-8 flex items-center justify-center">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
              index <= stepIndex
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-gray-300 text-gray-400'
            }`}
          >
            {index < stepIndex ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <span className="text-sm font-medium">{index + 1}</span>
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={`h-0.5 w-16 ${index < stepIndex ? 'bg-blue-600' : 'bg-gray-300'}`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderShippingStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={shippingInfo.firstName}
            onChange={e => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            value={shippingInfo.lastName}
            onChange={e => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Doe"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={shippingInfo.email}
            onChange={e => setShippingInfo({ ...shippingInfo, email: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john@example.com"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            value={shippingInfo.address}
            onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123 Main Street"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={shippingInfo.city}
            onChange={e => setShippingInfo({ ...shippingInfo, city: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="New York"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">State</label>
          <select
            value={shippingInfo.state}
            onChange={e => setShippingInfo({ ...shippingInfo, state: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select State</option>
            <option value="CA">California</option>
            <option value="NY">New York</option>
            <option value="TX">Texas</option>
            <option value="FL">Florida</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Card Number</label>
          <input
            type="text"
            value={paymentInfo.cardNumber}
            onChange={e => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1234 5678 9012 3456"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Expiry Date</label>
            <input
              type="text"
              value={paymentInfo.expiryDate}
              onChange={e => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="MM/YY"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">CVV</label>
            <input
              type="text"
              value={paymentInfo.cvv}
              onChange={e => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Order Review</h2>

      {/* Order Items */}
      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="mb-3 font-medium text-gray-900">Order Items</h3>
        <div className="space-y-3">
          {mockItems.map(item => (
            <div key={item.id} className="flex justify-between">
              <div>
                <span className="font-medium">{item.entity.name}</span>
                <span className="ml-2 text-gray-600">× {item.quantity}</span>
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t border-gray-200 pt-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-8 w-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Order Confirmed!</h2>
      <p className="text-gray-600">
        Thank you for your purchase. Your order has been successfully placed.
      </p>
      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-sm text-gray-600">Order Number:</p>
        <p className="font-mono text-lg font-semibold">ORD-ABC123DEF</p>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 bg-white shadow-lg">
      <div className="p-6">
        {renderStepIndicator()}

        <div className="min-h-[400px]">
          {currentStep === 'shipping' && renderShippingStep()}
          {currentStep === 'payment' && renderPaymentStep()}
          {currentStep === 'review' && renderReviewStep()}
          {currentStep === 'confirmation' && renderConfirmationStep()}
        </div>

        {/* Navigation Buttons */}
        {currentStep !== 'confirmation' && (
          <div className="mt-8 flex justify-between border-t border-gray-200 pt-6">
            <div>
              {stepIndex > 0 && (
                <button
                  onClick={handlePrevStep}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-50"
                >
                  ← Back
                </button>
              )}
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="ml-2 px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
                >
                  Cancel
                </button>
              )}
            </div>

            <div>
              {currentStep === 'review' ? (
                <button
                  onClick={handleCompleteOrder}
                  disabled={isProcessing}
                  className={`rounded-md px-6 py-2 font-medium transition-colors ${
                    isProcessing
                      ? 'cursor-not-allowed bg-gray-400 text-gray-600'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
              ) : (
                <button
                  onClick={handleNextStep}
                  className="rounded-md bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Continue →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutFlow;
