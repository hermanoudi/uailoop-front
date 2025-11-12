/**
 * Product types based on backend schemas
 */

export type ProductCategory = 'acougues' | 'padarias' | 'limpeza' | 'hortifruti' | 'bebidas' | 'pet' | 'outros';

export const ProductCategoryEnum = {
  ACOUGUES: 'acougues' as const,
  PADARIAS: 'padarias' as const,
  LIMPEZA: 'limpeza' as const,
  HORTIFRUTI: 'hortifruti' as const,
  BEBIDAS: 'bebidas' as const,
  PET: 'pet' as const,
  OUTROS: 'outros' as const,
};

export interface Product {
  id: number;
  seller_id: number;
  seller_name?: string | null;
  name: string;
  description: string | null;
  category: ProductCategory;
  price: number | string;
  unit: string;
  sku: string | null;
  stock_quantity: number | string | null;
  is_available: boolean;
  is_active: boolean;
  image_url: string | null;
  thumbnail_url: string | null;
  slug: string | null;
  tags: string | null;
  views_count: number;
  sales_count: number;
  created_at: string;
  updated_at: string | null;
}

export interface ProductListItem {
  id: number;
  name: string;
  description: string | null;
  category: ProductCategory;
  price: number | string;
  unit: string;
  sku: string | null;
  image_url: string | null;
  is_available: boolean;
  seller_id: number;
  seller_name: string | null;
}

export interface ProductsResponse {
  items: ProductListItem[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
