import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ShoppingCart from './ShoppingCart';

const mockCartItems = [
  {
    id: '1',
    entity: { name: 'Premium Headphones', attributes: ['wireless', 'noise-canceling'] },
    quantity: 1,
    price: 299.99,
  },
  {
    id: '2',
    entity: { name: 'Running Shoes', attributes: ['comfortable', 'breathable'] },
    quantity: 2,
    price: 129.99,
  },
];

describe('ShoppingCart', () => {
  it('renders shopping cart with default items when none provided', () => {
    render(<ShoppingCart />);
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.getByText(/\d+ items?/)).toBeInTheDocument();
  });

  it('displays provided cart items', () => {
    render(<ShoppingCart items={mockCartItems} />);
    expect(screen.getByText('Premium Headphones')).toBeInTheDocument();
    expect(screen.getByText('Running Shoes')).toBeInTheDocument();
  });

  it('calculates correct subtotal', () => {
    render(<ShoppingCart items={mockCartItems} />);
    const expectedSubtotal = 299.99 * 1 + 129.99 * 2;
    expect(screen.getByText(`$${expectedSubtotal.toFixed(2)}`)).toBeInTheDocument();
  });

  it('calculates tax correctly', () => {
    render(<ShoppingCart items={mockCartItems} />);
    const subtotal = 299.99 * 1 + 129.99 * 2;
    const expectedTax = subtotal * 0.08;
    expect(screen.getByText(`$${expectedTax.toFixed(2)}`)).toBeInTheDocument();
  });

  it('shows free shipping for orders over $50', () => {
    render(<ShoppingCart items={mockCartItems} />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('shows shipping cost for orders under $50', () => {
    const smallOrder = [
      {
        id: '1',
        entity: { name: 'Small Item', attributes: [] },
        quantity: 1,
        price: 25.0,
      },
    ];
    render(<ShoppingCart items={smallOrder} />);
    expect(screen.getByText('$9.99')).toBeInTheDocument();
  });

  it('handles quantity increase', () => {
    const mockUpdateQuantity = vi.fn();
    render(<ShoppingCart items={mockCartItems} onUpdateQuantity={mockUpdateQuantity} />);

    const increaseButtons = screen.getAllByText('+');
    fireEvent.click(increaseButtons[0]);

    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 2);
  });

  it('handles quantity decrease', () => {
    const mockUpdateQuantity = vi.fn();
    render(<ShoppingCart items={mockCartItems} onUpdateQuantity={mockUpdateQuantity} />);

    const decreaseButtons = screen.getAllByText('-');
    fireEvent.click(decreaseButtons[1]); // Second item has quantity 2

    expect(mockUpdateQuantity).toHaveBeenCalledWith('2', 1);
  });

  it('does not decrease quantity below 1', () => {
    const mockUpdateQuantity = vi.fn();
    const singleQuantityItem = [
      {
        id: '1',
        entity: { name: 'Single Item', attributes: [] },
        quantity: 1,
        price: 50.0,
      },
    ];

    render(<ShoppingCart items={singleQuantityItem} onUpdateQuantity={mockUpdateQuantity} />);

    const decreaseButton = screen.getByText('-');
    fireEvent.click(decreaseButton);

    expect(mockUpdateQuantity).not.toHaveBeenCalled();
  });

  it('handles item removal', () => {
    const mockRemoveItem = vi.fn();
    render(<ShoppingCart items={mockCartItems} onRemoveItem={mockRemoveItem} />);

    const removeButtons = screen.getAllByTitle('Remove item');
    fireEvent.click(removeButtons[0]);

    expect(mockRemoveItem).toHaveBeenCalledWith('1');
  });

  it('handles checkout process', async () => {
    const mockCheckout = vi.fn();
    render(<ShoppingCart items={mockCartItems} onCheckout={mockCheckout} />);

    const checkoutButton = screen.getByText('🔒 Proceed to Checkout');
    fireEvent.click(checkoutButton);

    expect(screen.getByText('Processing...')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(mockCheckout).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  it('can be closed when onClose provided', () => {
    const mockClose = vi.fn();
    render(<ShoppingCart items={mockCartItems} onClose={mockClose} />);

    const closeButton = screen.getByLabelText('Close cart');
    fireEvent.click(closeButton);

    expect(mockClose).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(<ShoppingCart items={mockCartItems} isOpen={false} />);
    expect(screen.queryByText('Shopping Cart')).not.toBeInTheDocument();
  });

  it('shows empty cart message when no items', () => {
    render(<ShoppingCart items={[]} />);
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Add some products to get started')).toBeInTheDocument();
  });

  it('displays correct item count in header', () => {
    render(<ShoppingCart items={mockCartItems} />);
    expect(screen.getByText('2 items')).toBeInTheDocument();
  });

  it('displays singular item text for single item', () => {
    const singleItem = [mockCartItems[0]];
    render(<ShoppingCart items={singleItem} />);
    expect(screen.getByText('1 item')).toBeInTheDocument();
  });

  it('shows continue shopping button', () => {
    render(<ShoppingCart items={mockCartItems} />);
    expect(screen.getByText('← Continue Shopping')).toBeInTheDocument();
  });
});
