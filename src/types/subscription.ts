/**
 * Subscription types
 */

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum SubscriptionFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
}

export interface SubscriptionProduct {
  product_id: number;
  quantity: number;
  price?: number;
}

export interface DeliveryAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

// Subscription
export interface Subscription {
  id: number;
  customer_id: number;
  seller_id: number;
  source_order_id?: number;
  frequency: SubscriptionFrequency;
  status: SubscriptionStatus;
  products: Array<{
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  total_amount: number;
  delivery_fee?: number;
  delivery_day_of_week?: number;
  delivery_day_of_month?: number;
  delivery_address: DeliveryAddress;
  payment_method: string;
  next_billing_date: string;
  last_billing_date?: string;
  created_at: string;
  updated_at?: string;
  cancelled_at?: string;
  paused_at?: string;
}

export interface SubscriptionCreate {
  seller_id: number;
  source_order_id?: number;
  frequency: SubscriptionFrequency;
  products: SubscriptionProduct[];
  delivery_address: DeliveryAddress;
  payment_method: string;
  delivery_day_of_week?: number;
  delivery_day_of_month?: number;
}

export interface SubscriptionUpdate {
  frequency?: SubscriptionFrequency;
  products?: SubscriptionProduct[];
  delivery_address?: DeliveryAddress;
  payment_method?: string;
  delivery_day_of_week?: number;
  delivery_day_of_month?: number;
}

// Action requests
export interface SubscriptionPauseRequest {
  reason?: string;
}

export interface SubscriptionCancelRequest {
  reason?: string;
}

// Utility types
export const SubscriptionFrequencyLabels: Record<SubscriptionFrequency, string> = {
  [SubscriptionFrequency.DAILY]: 'Diária',
  [SubscriptionFrequency.WEEKLY]: 'Semanal',
  [SubscriptionFrequency.BIWEEKLY]: 'Quinzenal',
  [SubscriptionFrequency.MONTHLY]: 'Mensal',
};

export const SubscriptionStatusLabels: Record<SubscriptionStatus, string> = {
  [SubscriptionStatus.ACTIVE]: 'Ativa',
  [SubscriptionStatus.PAUSED]: 'Pausada',
  [SubscriptionStatus.CANCELLED]: 'Cancelada',
  [SubscriptionStatus.EXPIRED]: 'Expirada',
};

export const SubscriptionStatusColors: Record<SubscriptionStatus, string> = {
  [SubscriptionStatus.ACTIVE]: 'text-green-600 bg-green-50',
  [SubscriptionStatus.PAUSED]: 'text-yellow-600 bg-yellow-50',
  [SubscriptionStatus.CANCELLED]: 'text-red-600 bg-red-50',
  [SubscriptionStatus.EXPIRED]: 'text-gray-600 bg-gray-50',
};
