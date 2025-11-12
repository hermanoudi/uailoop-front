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

  /**
   * Get products by CEP - returns products from sellers that deliver to the given CEP
   */
  async getProductsByCep(
    cep: string,
    params?: Omit<GetProductsParams, 'seller_id'>
  ): Promise<ProductsResponse> {
    const cleanCep = cep.replace(/\D/g, '');
    const response = await api.get<ProductsResponse>(`/products/by-cep/${cleanCep}`, {
      params
    });
    return response.data;
  },

  /**
   * Create a new product (seller only)
   */
  async createProduct(data: CreateProductInput): Promise<Product> {
    const response = await api.post<Product>('/products/', data);
    return response.data;
  },

  /**
   * Update a product (seller only)
   */
  async updateProduct(id: number, data: Partial<CreateProductInput>): Promise<Product> {
    const response = await api.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  /**
   * Delete a product (seller only)
   */
  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  /**
   * Get seller's own products
   */
  async getMyProducts(params?: { limit?: number; offset?: number }): Promise<ProductsResponse> {
    const response = await api.get<ProductsResponse>('/products/my-products', { params });
    return response.data;
  },
};

export interface CreateProductInput {
  name: string;
  description?: string;
  category: ProductCategory;
  price: number;
  unit: string;
  sku?: string;
  stock_quantity?: number;
  is_available?: boolean;
  image_url?: string;
  tags?: string;
}
