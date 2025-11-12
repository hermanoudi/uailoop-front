/**
 * SKU Service
 * Serviço para gerenciar SKUs (Stock Keeping Units)
 */

import { api } from './api';
import type {
  SKU,
  SKUListItem,
  SKUsResponse,
  SKUCreateInput,
  SKUUpdateInput,
  SKUBulkCreateInput,
} from '../types/sku';

/**
 * Cria um novo SKU
 */
export const createSKU = async (data: SKUCreateInput): Promise<SKU> => {
  const response = await api.post<SKU>('/skus/', data);
  return response.data;
};

/**
 * Cria múltiplos SKUs de uma vez
 */
export const createSKUsBulk = async (data: SKUBulkCreateInput): Promise<SKU[]> => {
  const response = await api.post<SKU[]>('/skus/bulk', data);
  return response.data;
};

/**
 * Lista SKUs com paginação e filtros
 */
export const listSKUs = async (params?: {
  page?: number;
  size?: number;
  product_id?: number;
  is_available?: boolean;
  is_active?: boolean;
}): Promise<SKUsResponse> => {
  const response = await api.get<SKUsResponse>('/skus/', { params });
  return response.data;
};

/**
 * Busca um SKU pelo ID
 */
export const getSKUById = async (skuId: number): Promise<SKU> => {
  const response = await api.get<SKU>(`/skus/${skuId}`);
  return response.data;
};

/**
 * Busca um SKU pelo código
 */
export const getSKUByCode = async (skuCode: string): Promise<SKU> => {
  const response = await api.get<SKU>(`/skus/by-code/${skuCode}`);
  return response.data;
};

/**
 * Busca todos os SKUs de um produto específico
 */
export const getProductSKUs = async (
  productId: number,
  params?: {
    is_available?: boolean;
  }
): Promise<SKUListItem[]> => {
  const response = await api.get<SKUListItem[]>(`/skus/product/${productId}/skus`, { params });
  return response.data;
};

/**
 * Atualiza um SKU
 */
export const updateSKU = async (skuId: number, data: SKUUpdateInput): Promise<SKU> => {
  const response = await api.put<SKU>(`/skus/${skuId}`, data);
  return response.data;
};

/**
 * Remove um SKU (soft delete)
 */
export const deleteSKU = async (skuId: number): Promise<void> => {
  await api.delete(`/skus/${skuId}`);
};

/**
 * Atualiza o estoque de um SKU
 */
export const updateSKUStock = async (
  skuId: number,
  stockQuantity: number | string
): Promise<SKU> => {
  return updateSKU(skuId, { stock_quantity: stockQuantity });
};

/**
 * Atualiza a disponibilidade de um SKU
 */
export const updateSKUAvailability = async (
  skuId: number,
  isAvailable: boolean
): Promise<SKU> => {
  return updateSKU(skuId, { is_available: isAvailable });
};
