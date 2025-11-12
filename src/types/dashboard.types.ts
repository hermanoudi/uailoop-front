/**
 * Types for Dashboard API
 */

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod =
  | 'money'
  | 'credit_card'
  | 'debit_card'
  | 'pix'
  | 'online';

export interface StuckOrder {
  id: number;
  status: OrderStatus;
  customer_name: string;
  total_amount: string;
  created_at: string;
  hours_in_status: number;
  last_status_change: string | null;
}

export interface PeriodOrders {
  date: string;
  orders_count: number;
  total_amount: string;
}

export interface TopProduct {
  product_id: number;
  product_name: string;
  quantity_sold: string;
  times_ordered: number;
  total_revenue: string;
}

export interface SalesByPaymentMethod {
  payment_method: PaymentMethod;
  orders_count: number;
  total_amount: string;
}

export interface OrdersByStatus {
  status: OrderStatus;
  orders_count: number;
  total_amount: string;
}

export interface DashboardMetrics {
  total_sales: string;
  total_orders: number;
  average_order_value: string;
  stuck_orders: StuckOrder[];
  orders_by_period: PeriodOrders[];
  top_products: TopProduct[];
  sales_by_payment_method: SalesByPaymentMethod[];
  orders_by_status: OrdersByStatus[];
  period_start: string;
  period_end: string;
  period_type: 'day' | 'week' | 'month';
}

export interface DashboardFilters {
  period_type?: 'day' | 'week' | 'month';
  date_from?: string;
  date_to?: string;
  stuck_hours_threshold?: number;
  top_products_limit?: number;
}

// Helper to format currency
export const formatCurrency = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numValue);
};

// Helper to format status
export const formatStatus = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    'pending': 'Pendente',
    'confirmed': 'Confirmado',
    'preparing': 'Preparando',
    'out_for_delivery': 'Saiu para Entrega',
    'delivered': 'Entregue',
    'cancelled': 'Cancelado',
  };
  return statusMap[status] || status;
};

// Helper to format payment method
export const formatPaymentMethod = (method: PaymentMethod): string => {
  const methodMap: Record<PaymentMethod, string> = {
    'money': 'Dinheiro',
    'credit_card': 'Cartão de Crédito',
    'debit_card': 'Cartão de Débito',
    'pix': 'PIX',
    'online': 'Online',
  };
  return methodMap[method] || method;
};

// Helper to get status color
export const getStatusColor = (status: OrderStatus): string => {
  const colorMap: Record<OrderStatus, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'preparing': 'bg-purple-100 text-purple-800',
    'out_for_delivery': 'bg-indigo-100 text-indigo-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};
