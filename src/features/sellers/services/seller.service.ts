/**
 * Seller service - API calls for sellers
 */

import { api } from '../../../services/api';
import type { Seller, SellerListItem, SellersResponse } from '../../../types/seller';

export interface GetSellersParams {
  page?: number;
  size?: number;
  category?: string;
  city?: string;
  state?: string;
  is_verified?: boolean;
}

export const sellerService = {
  /**
   * Get all sellers with pagination and filters
   */
  async getSellers(params?: GetSellersParams): Promise<SellersResponse> {
    const response = await api.get<SellersResponse>('/sellers/', { params });
    return response.data;
  },

  /**
   * Get seller by ID
   */
  async getSeller(id: number): Promise<Seller> {
    const response = await api.get<Seller>(`/sellers/${id}`);
    return response.data;
  },

  /**
   * Get sellers by category
   */
  async getSellersByCategory(
    category: string,
    params?: Omit<GetSellersParams, 'category'>
  ): Promise<SellersResponse> {
    return this.getSellers({ ...params, category });
  },
};
