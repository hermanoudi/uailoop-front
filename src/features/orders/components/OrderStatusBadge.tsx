/**
 * OrderStatusBadge - Display order status with color coding
 */

import type { OrderStatus } from '../../../types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pendente',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  confirmed: {
    label: 'Confirmado',
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  preparing: {
    label: 'Em Preparação',
    className: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  out_for_delivery: {
    label: 'Saiu para Entrega',
    className: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },
  delivered: {
    label: 'Entregue',
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-800 border-red-300',
  },
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
