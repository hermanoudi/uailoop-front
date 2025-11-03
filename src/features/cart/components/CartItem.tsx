/**
 * CartItem - Component to display a single cart item
 */

import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import { formatCurrency } from '../../../lib/formatters';
import type { CartItem as CartItemType } from '../../../types/cart';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity, subtotal } = item;

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div
        className="w-24 h-24 flex-shrink-0 bg-cover bg-center rounded-lg"
        style={{
          backgroundImage: `url('${product.image_url}')`,
        }}
      />

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-dark mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-light-gray mb-2">
          {formatCurrency(Number(product.price))} / {product.unit}
        </p>
        {product.seller_name && (
          <p className="text-xs text-light-gray">
            Vendido e entregue por <span className="font-semibold text-dark">{product.seller_name}</span>
          </p>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 transition-colors p-1"
          title="Remover do carrinho"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-semibold">{quantity}</span>
          <button
            onClick={handleIncrement}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right">
          <p className="text-lg font-bold text-primary">{formatCurrency(subtotal)}</p>
        </div>
      </div>
    </div>
  );
}
