/**
 * CartContext - Context for managing shopping cart state
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import type { Cart, CartContextType, CartItem } from '../types/cart';
import type { ProductListItem } from '../types/product';

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'uailoop_cart';

interface CartProviderProps {
  children: ReactNode;
}

// Helper to prevent duplicate toasts
let lastToastTime = 0;
let lastToastMessage = '';

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  const now = Date.now();
  // Prevent same message within 500ms
  if (now - lastToastTime < 500 && message === lastToastMessage) {
    return;
  }
  lastToastTime = now;
  lastToastMessage = message;

  if (type === 'success') {
    toast.success(message);
  } else {
    toast.error(message);
  }
};

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart>(() => {
    // Load cart from localStorage on init
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch {
        return { items: [], totalItems: 0, totalPrice: 0 };
      }
    }
    return { items: [], totalItems: 0, totalPrice: 0 };
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const calculateTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);
    return { totalItems, totalPrice };
  };

  const addToCart = (product: ProductListItem, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex(
        (item) => item.product.id === product.id
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = [...prevCart.items];
        const newQuantity = newItems[existingItemIndex].quantity + quantity;
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newQuantity,
          subtotal: newQuantity * Number(product.price),
        };
        showToast(`Quantidade atualizada no carrinho!`);
      } else {
        // Add new item
        const newItem: CartItem = {
          product,
          quantity,
          subtotal: quantity * Number(product.price),
        };
        newItems = [...prevCart.items, newItem];
        showToast(`${product.name} adicionado ao carrinho!`);
      }

      const totals = calculateTotals(newItems);
      return {
        items: newItems,
        ...totals,
      };
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.product.id !== productId);
      const totals = calculateTotals(newItems);
      showToast('Item removido do carrinho');
      return {
        items: newItems,
        ...totals,
      };
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) => {
        if (item.product.id === productId) {
          return {
            ...item,
            quantity,
            subtotal: quantity * Number(item.product.price),
          };
        }
        return item;
      });

      const totals = calculateTotals(newItems);
      return {
        items: newItems,
        ...totals,
      };
    });
  };

  const clearCart = () => {
    setCart({ items: [], totalItems: 0, totalPrice: 0 });
    showToast('Carrinho limpo!');
  };

  const isInCart = (productId: number): boolean => {
    return cart.items.some((item) => item.product.id === productId);
  };

  const getItemQuantity = (productId: number): number => {
    const item = cart.items.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
