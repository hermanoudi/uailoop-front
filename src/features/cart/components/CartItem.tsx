/**
 * CartItem - Component to display a single cart item
 */

import { useState } from 'react';
import { Minus, Plus, Trash2, Repeat, Check } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import { formatCurrency } from '../../../lib/formatters';
import type { CartItem as CartItemType } from '../../../types/cart';
import { SubscriptionFrequency, SubscriptionFrequencyLabels } from '../../../types/subscription';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart, toggleSubscription } = useCart();
  const { product, quantity, subtotal, isSubscription, subscriptionFrequency } = item;
  const [showFrequencySelector, setShowFrequencySelector] = useState(false);

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

  const handleToggleSubscription = () => {
    if (!isSubscription) {
      setShowFrequencySelector(true);
    } else {
      toggleSubscription(product.id, false);
      setShowFrequencySelector(false);
    }
  };

  const handleSelectFrequency = (frequency: SubscriptionFrequency) => {
    toggleSubscription(product.id, true, frequency);
    setShowFrequencySelector(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex gap-4 p-4">
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

      {/* Subscription Toggle */}
      <div className="px-4 pb-4 border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSubscription}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isSubscription
                  ? 'bg-green-500 text-black hover:bg-green-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isSubscription ? (
                <>
                  <Check className="w-4 h-4" />
                  Assinatura Ativa
                </>
              ) : (
                <>
                  <Repeat className="w-4 h-4" />
                  Assinar este produto
                </>
              )}
            </button>
            {isSubscription && subscriptionFrequency && (
              <span className="text-sm text-gray-600">
                • {SubscriptionFrequencyLabels[subscriptionFrequency]}
              </span>
            )}
          </div>
          {isSubscription && (
            <div className="bg-yellow-50 px-3 py-1 rounded-full">
              <span className="text-xs font-semibold text-yellow-800">10% de desconto</span>
            </div>
          )}
        </div>

        {/* Frequency Selector */}
        {showFrequencySelector && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Escolha a frequência de entrega:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.values(SubscriptionFrequency).map((freq) => (
                <button
                  key={freq}
                  onClick={() => handleSelectFrequency(freq)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-500 transition-colors text-sm font-medium"
                >
                  {SubscriptionFrequencyLabels[freq]}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFrequencySelector(false)}
              className="mt-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
