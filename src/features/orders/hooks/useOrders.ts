/**
 * useOrders hook - Fetch orders list
 */

import { useQuery } from '@tanstack/react-query';
import { orderService, type GetOrdersParams } from '../services/order.service';
import type { OrdersResponse } from '../../../types/order';

export function useOrders(params?: GetOrdersParams) {
  return useQuery<OrdersResponse>({
    queryKey: ['orders', params],
    queryFn: () => orderService.getOrders(params),
    staleTime: 1000 * 60, // 1 minute
  });
}
