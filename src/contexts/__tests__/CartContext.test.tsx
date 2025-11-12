import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { CartProvider, useCart } from '../CartContext';
import type { ProductListItem } from '../../types/product';

// Mock toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockProduct: ProductListItem = {
  id: 1,
  name: 'Test Product',
  description: 'Test description',
  price: 99.90,
  category: 'acougues',
  unit: 'kg',
  image_url: 'https://example.com/image.jpg',
  seller_id: 1,
  seller_name: 'Test Seller',
      sku: null,
  is_available: true,
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('addToCart', () => {
    it('should add a product to cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].product.id).toBe(mockProduct.id);
      expect(result.current.cart.items[0].quantity).toBe(1);
      expect(result.current.cart.totalItems).toBe(1);
    });

    it('should add product with specific quantity', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 3);
      });

      expect(result.current.cart.items[0].quantity).toBe(3);
      expect(result.current.cart.totalItems).toBe(3);
    });

    it('should update quantity if product already in cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 2);
      });

      act(() => {
        result.current.addToCart(mockProduct, 3);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].quantity).toBe(5);
      expect(result.current.cart.totalItems).toBe(5);
    });

    it('should calculate total correctly', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 2);
      });

      expect(result.current.cart.totalPrice).toBe(199.80);
    });

    it('should persist cart to localStorage', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      const stored = localStorage.getItem('uailoop_cart');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.items).toHaveLength(1);
    });
  });

  describe('removeFromCart', () => {
    it('should remove product from cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.removeFromCart(mockProduct.id);
      });

      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.cart.totalItems).toBe(0);
      expect(result.current.cart.totalPrice).toBe(0);
    });
  });

  describe('updateQuantity', () => {
    it('should update product quantity', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.updateQuantity(mockProduct.id, 5);
      });

      expect(result.current.cart.items[0].quantity).toBe(5);
      expect(result.current.cart.totalItems).toBe(5);
      expect(result.current.cart.totalPrice).toBe(499.50);
    });

    it('should remove product if quantity is 0', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.updateQuantity(mockProduct.id, 0);
      });

      expect(result.current.cart.items).toHaveLength(0);
    });

    it('should not allow negative quantity', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.updateQuantity(mockProduct.id, -1);
      });

      expect(result.current.cart.items).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart({ ...mockProduct, id: 2 });
      });

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.cart.totalItems).toBe(0);
      expect(result.current.cart.totalPrice).toBe(0);
    });
  });

  describe('isInCart', () => {
    it('should return true if product is in cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      expect(result.current.isInCart(mockProduct.id)).toBe(true);
      expect(result.current.isInCart(999)).toBe(false);
    });
  });

  describe('getItemQuantity', () => {
    it('should return quantity of product in cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct, 3);
      });

      expect(result.current.getItemQuantity(mockProduct.id)).toBe(3);
      expect(result.current.getItemQuantity(999)).toBe(0);
    });
  });

  describe('persistence', () => {
    it('should load cart from localStorage on mount', () => {
      const cartData = {
        items: [
          {
            product: mockProduct,
            quantity: 2,
            subtotal: 199.80,
          },
        ],
        totalItems: 2,
        totalPrice: 199.80,
      };

      localStorage.setItem('uailoop_cart', JSON.stringify(cartData));

      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.totalItems).toBe(2);
    });
  });
});
