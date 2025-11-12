/**
 * OrderCard - Display order in a card format
 */

import { Link } from 'react-router-dom';
import { Calendar, MapPin, CreditCard, Package, User } from 'lucide-react';
import type { OrderListItem } from '../../../types/order';
import { formatCurrency } from '../../../lib/formatters';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderCardProps {
  order: OrderListItem;
}

const paymentMethodLabels: Record<string, string> = {
  money: 'Dinheiro',
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
  pix: 'PIX',
  online: 'Online',
};

export default function OrderCard({ order }: OrderCardProps) {
  const formattedDate = new Date(order.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link
      to={`/orders/${order.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Pedido #{order.id}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Customer Name */}
      <div className="mb-3 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700">Cliente:</span>
          <span className="text-gray-900">{order.customer_name}</span>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-4 space-y-2">
        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Itens do Pedido
        </p>
        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          {order.items && order.items.length > 0 ? (
            order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start text-sm bg-gray-50 rounded px-3 py-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {item.product_name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {item.quantity} {item.product_unit} × {formatCurrency(item.unit_price)}
                  </p>
                </div>
                <span className="ml-2 font-semibold text-gray-900 whitespace-nowrap">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 italic">Nenhum item</p>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package className="w-4 h-4" />
          <span>{order.items_count} {order.items_count === 1 ? 'item' : 'itens'}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{order.delivery_city}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CreditCard className="w-4 h-4" />
          <span>{paymentMethodLabels[order.payment_method] || order.payment_method}</span>
        </div>
      </div>

      <div className="border-t pt-4 flex items-center justify-between">
        <span className="text-sm text-gray-600">Total</span>
        <span className="text-xl font-bold text-primary">
          {formatCurrency(order.total_amount)}
        </span>
      </div>
    </Link>
  );
}
