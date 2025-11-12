/**
 * Order types
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

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_unit: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  was_on_offer: boolean;
  original_price: number | null;
  offer_id: number | null;
}

export interface Order {
  id: number;
  customer_id: number;
  seller_id: number;
  status: OrderStatus;
  total_amount: number;
  delivery_fee: number;
  payment_method: PaymentMethod;
  payment_status: string;
  delivery_address: string;
  delivery_number: string;
  delivery_city: string;
  delivery_state: string;
  delivery_zipcode: string;
  delivery_instructions: string | null;
  customer_name: string;
  customer_phone: string;
  notes: string | null;
  seller_notes: string | null;
  created_at: string;
  updated_at: string | null;
  confirmed_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  items: OrderItem[];
}

export interface OrderListItem {
  id: number;
  seller_id: number;
  status: OrderStatus;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: string;
  customer_name: string;
  delivery_city: string;
  created_at: string;
  items_count: number;
  items: OrderItem[];  // Include full items data for UI display
}

export interface OrderItemCreate {
  product_id: number;
  quantity: number;
  offer_id?: number;
}

export interface OrderCreate {
  seller_id: number;
  items: OrderItemCreate[];
  payment_method: PaymentMethod;
  delivery_address: string;
  delivery_number: string;
  delivery_city: string;
  delivery_state: string;
  delivery_zipcode: string;
  delivery_instructions?: string;
  customer_name: string;
  customer_phone: string;
  notes?: string;
}

export interface OrderUpdate {
  status?: OrderStatus;
  seller_notes?: string;
  payment_status?: string;
}

export interface OrdersResponse {
  items: OrderListItem[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
