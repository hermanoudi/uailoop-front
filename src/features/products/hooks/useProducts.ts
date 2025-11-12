/**
 * Hook for fetching products
 */

import { useState, useEffect } from 'react';
import { productService, type GetProductsParams } from '../services/product.service';
import type { ProductListItem } from '../../../types/product';
import { getErrorMessage } from '../../../services/api';

interface UseProductsResult {
  products: ProductListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pages: number;
  refetch: () => Promise<void>;
}

interface UseProductsOptions extends GetProductsParams {
  cep?: string | null;
}

export function useProducts(params?: UseProductsOptions): UseProductsResult {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // If CEP is provided, use CEP-based filtering
      const response = params?.cep
        ? await productService.getProductsByCep(params.cep, params)
        : await productService.getProducts(params);

      setProducts(response.items);
      setTotal(response.total);
      setPage(response.page);
      setPages(response.pages);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(params)]);

  return {
    products,
    loading,
    error,
    total,
    page,
    pages,
    refetch: fetchProducts,
  };
}
