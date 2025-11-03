export type OfferType = 'percentage' | 'fixed' | 'buy_x_get_y' | 'free_shipping';

export const OfferTypeEnum = {
  PERCENTAGE: 'percentage' as const,
  FIXED: 'fixed' as const,
  BUY_X_GET_Y: 'buy_x_get_y' as const,
  FREE_SHIPPING: 'free_shipping' as const,
};

export interface Offer {
  id: number;
  seller_id: number;
  product_id: number;
  title: string;
  description: string;
  offer_type: OfferType;
  discount_percentage: number | null;
  discount_fixed: number | null;
  buy_quantity: number | null;
  get_quantity: number | null;
  original_price: number;
  offer_price: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_featured: boolean;
  max_uses: number | null;
  max_uses_per_customer: number | null;
  current_uses: number;
  created_at: string;
  updated_at: string | null;
}

export interface OfferListItem {
  id: number;
  title: string;
  description: string | null;
  offer_type: OfferType;
  original_price: number;
  offer_price: number;
  discount_percentage: number | null;
  product_id: number;
  seller_id: number;
  seller_name: string | null;
  is_featured: boolean;
  end_date: string;
}

export interface OfferWithProduct extends OfferListItem {
  product_name?: string;
  product_image?: string;
  product_unit?: string;
}

export interface OffersParams {
  skip?: number;
  limit?: number;
  is_active?: boolean;
  is_featured?: boolean;
  seller_id?: number;
}
