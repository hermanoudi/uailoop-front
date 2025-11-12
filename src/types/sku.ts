/**
 * SKU (Stock Keeping Unit) types based on backend schemas
 */

export interface SKUAttributes {
  [key: string]: string | number | boolean;
}

export interface SKU {
  id: number;
  product_id: number;
  sku_code: string;
  attributes: SKUAttributes | null;
  price: number | string | null;
  stock_quantity: number | string;
  is_available: boolean;
  is_active: boolean;
  image_url: string | null;
  thumbnail_url: string | null;
  weight: number | string | null;
  length: number | string | null;
  width: number | string | null;
  height: number | string | null;
  sales_count: number;
  created_at: string;
  updated_at: string | null;
}

export interface SKUListItem {
  id: number;
  product_id: number;
  sku_code: string;
  attributes: SKUAttributes | null;
  price: number | string | null;
  stock_quantity: number | string;
  is_available: boolean;
  is_active: boolean;
  image_url: string | null;
}

export interface SKUsResponse {
  items: SKUListItem[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface SKUCreateInput {
  product_id: number;
  sku_code: string;
  attributes?: SKUAttributes | null;
  price?: number | string | null;
  stock_quantity?: number | string;
  is_available?: boolean;
  weight?: number | string | null;
  length?: number | string | null;
  width?: number | string | null;
  height?: number | string | null;
  image_url?: string | null;
}

export interface SKUUpdateInput {
  sku_code?: string;
  attributes?: SKUAttributes | null;
  price?: number | string | null;
  stock_quantity?: number | string;
  is_available?: boolean;
  is_active?: boolean;
  image_url?: string | null;
  thumbnail_url?: string | null;
  weight?: number | string | null;
  length?: number | string | null;
  width?: number | string | null;
  height?: number | string | null;
}

export interface SKUBulkCreateInput {
  product_id: number;
  skus: Omit<SKUCreateInput, 'product_id'>[];
}

// Helper type for form data
export interface SKUFormData {
  sku_code: string;
  attributes: SKUAttributes;
  price: string;
  stock_quantity: string;
  is_available: boolean;
  weight: string;
  length: string;
  width: string;
  height: string;
  image_url: string;
}
