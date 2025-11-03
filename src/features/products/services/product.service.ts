/**
 * Product service - API calls for products
 */

import { api } from '../../../services/api';
import type { Product, ProductListItem, ProductsResponse } from '../../../types/product';
import type { ProductCategory } from '../../../types/product';

export interface GetProductsParams {
  page?: number;
  size?: number;
  category?: ProductCategory;
  seller_id?: number;
  search?: string;
  is_available?: boolean;
}

export const productService = {
  /**
   * Get all products with pagination and filters
   */
  async getProducts(params?: GetProductsParams): Promise<ProductsResponse> {
    const response = await api.get<ProductsResponse>('/products/', { params });
    return response.data;
  },

  /**
   * Get product by ID
   */
  async getProduct(id: number): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(
    category: ProductCategory,
    params?: Omit<GetProductsParams, 'category'>
  ): Promise<ProductsResponse> {
    return this.getProducts({ ...params, category });
  },

  /**
   * Get products by seller
   */
  async getProductsBySeller(
    sellerId: number,
    params?: Omit<GetProductsParams, 'seller_id'>
  ): Promise<ProductsResponse> {
    return this.getProducts({ ...params, seller_id: sellerId });
  },

  /**
   * Search products
   */
  async searchProducts(
    query: string,
    params?: Omit<GetProductsParams, 'search'>
  ): Promise<ProductsResponse> {
    return this.getProducts({ ...params, search: query });
  },
};
