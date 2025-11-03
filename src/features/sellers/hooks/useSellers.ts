/**
 * Hook for fetching sellers
 */

import { useState, useEffect } from 'react';
import { sellerService, type GetSellersParams } from '../services/seller.service';
import type { SellerListItem } from '../../../types/seller';
import { getErrorMessage } from '../../../services/api';

interface UseSellersResult {
  sellers: SellerListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pages: number;
  refetch: () => Promise<void>;
}

export function useSellers(params?: GetSellersParams): UseSellersResult {
  const [sellers, setSellers] = useState<SellerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sellerService.getSellers(params);
      setSellers(response.items);
      setTotal(response.total);
      setPage(response.page);
      setPages(response.pages);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Error fetching sellers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [JSON.stringify(params)]);

  return {
    sellers,
    loading,
    error,
    total,
    page,
    pages,
    refetch: fetchSellers,
  };
}
