/**
 * Hook for fetching offers
 */

import { useState, useEffect } from 'react';
import { offerService } from '../services/offer.service';
import type { OfferListItem, OffersParams } from '../../../types/offer';
import { getErrorMessage } from '../../../services/api';

interface UseOffersResult {
  offers: OfferListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pages: number;
  refetch: () => Promise<void>;
}

export function useOffers(params?: OffersParams): UseOffersResult {
  const [offers, setOffers] = useState<OfferListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await offerService.getOffers(params);
      setOffers(response.data);
      setTotal(response.total);
      setPage(response.page);
      setPages(response.pages);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [JSON.stringify(params)]);

  return {
    offers,
    loading,
    error,
    total,
    page,
    pages,
    refetch: fetchOffers,
  };
}

/**
 * Hook para buscar ofertas em destaque (featured)
 */
export function useFeaturedOffers(limit: number = 6): Omit<UseOffersResult, 'total' | 'page' | 'pages'> {
  const [offers, setOffers] = useState<OfferListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await offerService.getFeaturedOffers(limit);
      setOffers(data);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Error fetching featured offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedOffers();
  }, [limit]);

  return {
    offers,
    loading,
    error,
    refetch: fetchFeaturedOffers,
  };
}
