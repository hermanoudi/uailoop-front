/**
 * Hook for fetching a single seller
 */

import { useState, useEffect } from 'react';
import { sellerService } from '../services/seller.service';
import type { Seller } from '../../../types/seller';
import { getErrorMessage } from '../../../services/api';

interface UseSellerResult {
  seller: Seller | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSeller(sellerId: number | string): UseSellerResult {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeller = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sellerService.getSeller(Number(sellerId));
      setSeller(data);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Error fetching seller:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sellerId) {
      fetchSeller();
    }
  }, [sellerId]);

  return {
    seller,
    loading,
    error,
    refetch: fetchSeller,
  };
}
