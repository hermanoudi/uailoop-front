import { api } from './api';
import type { DashboardMetrics, DashboardFilters, StuckOrder } from '../types/dashboard.types';

/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */
export const dashboardService = {
  /**
   * Get dashboard metrics
   */
  async getMetrics(filters?: DashboardFilters): Promise<DashboardMetrics> {
    const params = new URLSearchParams();

    if (filters?.period_type) {
      params.append('period_type', filters.period_type);
    }
    if (filters?.date_from) {
      params.append('date_from', filters.date_from);
    }
    if (filters?.date_to) {
      params.append('date_to', filters.date_to);
    }
    if (filters?.stuck_hours_threshold) {
      params.append('stuck_hours_threshold', filters.stuck_hours_threshold.toString());
    }
    if (filters?.top_products_limit) {
      params.append('top_products_limit', filters.top_products_limit.toString());
    }

    const response = await api.get<DashboardMetrics>(`/dashboard/?${params.toString()}`);
    return response.data;
  },

  /**
   * Get stuck orders
   */
  async getStuckOrders(hours_threshold: number = 24): Promise<StuckOrder[]> {
    const response = await api.get<StuckOrder[]>(`/dashboard/stuck-orders?hours_threshold=${hours_threshold}`);
    return response.data;
  },
};

export default dashboardService;
