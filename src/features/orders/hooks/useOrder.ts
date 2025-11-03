/**
 * useOrder hook - Fetch single order
 */

import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/order.service';
import type { Order } from '../../../types/order';

export function useOrder(orderId: number) {
  return useQuery<Order>({
    queryKey: ['orders', orderId],
    queryFn: () => orderService.getOrder(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 30, // 30 seconds
  });
}
