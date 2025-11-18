/**
 * Cart types and interfaces
 */

import type { ProductListItem } from './product';
import type { SubscriptionFrequency } from './subscription';

export interface CartItem {
  product: ProductListItem;
  quantity: number;
  subtotal: number;
  isSubscription?: boolean;
  subscriptionFrequency?: SubscriptionFrequency;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (product: ProductListItem, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
  toggleSubscription: (productId: number, isSubscription: boolean, frequency?: SubscriptionFrequency) => void;
}
