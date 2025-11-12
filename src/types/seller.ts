/**
 * Seller types based on backend schemas
 */

export interface Seller {
  id: number;
  user_id: number;
  business_name: string;
  cnpj: string;
  description: string | null;
  category: string;
  business_phone: string | null;
  business_email: string | null;
  website: string | null;
  cep: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  latitude: number | string | null;
  longitude: number | string | null;
  delivery_radius_km: number | string | null;
  min_order_value: number | string | null;
  delivery_fee: number | string | null;
  is_active: boolean;
  is_verified: boolean;
  logo_url: string | null;
  banner_url: string | null;
  rating_average: number | string;
  rating_count: number;
  created_at: string;
  updated_at: string | null;
}

export interface SellerListItem {
  id: number;
  business_name: string;
  category: string;
  description: string | null;
  city: string;
  state: string;
  logo_url: string | null;
  rating_average: number | string;
  rating_count: number;
  is_verified: boolean;
}

export interface SellersResponse {
  items: SellerListItem[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface SellerCreateInput {
  business_name: string;
  cnpj: string;
  description?: string;
  category: string;
  business_phone?: string;
  business_email?: string;
  website?: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  delivery_radius_km?: number;
  min_order_value?: number;
  delivery_fee?: number;
}

export const SELLER_CATEGORIES = [
  { value: 'acougues', label: '🥩 Açougues' },
  { value: 'padarias', label: '🥖 Padarias' },
  { value: 'limpeza', label: '🧹 Limpeza' },
  { value: 'hortifruti', label: '🥗 Hortifruti' },
  { value: 'bebidas', label: '🥤 Bebidas' },
  { value: 'pet', label: '🐾 Pet' },
  { value: 'outros', label: '📦 Outros' },
] as const;
