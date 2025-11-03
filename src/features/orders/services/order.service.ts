/**
 * Order service - API calls for orders
 */

import { api } from '../../../services/api';
import type {
  Order,
  OrderListItem,
  OrdersResponse,
  OrderCreate,
  OrderUpdate,
  OrderStatus
} from '../../../types/order';

export interface GetOrdersParams {
  page?: number;
  size?: number;
  status_filter?: OrderStatus;
  seller_id?: number;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export const orderService = {
  /**
   * Create a new order
   */
  async createOrder(orderData: OrderCreate): Promise<Order> {
    const response = await api.post<Order>('/orders/', orderData);
    return response.data;
  },

  /**
   * Get all orders with pagination and filters
   */
  async getOrders(params?: GetOrdersParams): Promise<OrdersResponse> {
    const response = await api.get<OrdersResponse>('/orders/', { params });
    return response.data;
  },

  /**
   * Get order by ID
   */
  async getOrder(id: number): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  /**
   * Update order (mainly for status updates - seller only)
   */
  async updateOrder(id: number, data: OrderUpdate): Promise<Order> {
    const response = await api.patch<Order>(`/orders/${id}`, data);
    return response.data;
  },

  /**
   * Get orders by status
   */
  async getOrdersByStatus(
    status: OrderStatus,
    params?: Omit<GetOrdersParams, 'status_filter'>
  ): Promise<OrdersResponse> {
    return this.getOrders({ ...params, status_filter: status });
  },
};
