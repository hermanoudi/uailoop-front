import api from '../../../services/api';
import type { Offer, OfferListItem, OffersParams } from '../../../types/offer';

interface OffersResponse {
  data: OfferListItem[];
  total: number;
  page: number;
  pages: number;
}

export const offerService = {
  /**
   * Lista todas as ofertas com filtros opcionais
   */
  async getOffers(params?: OffersParams): Promise<OffersResponse> {
    const response = await api.get<OfferListItem[]>('/offers/', { params });

    // Se a resposta é paginada
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data as unknown as OffersResponse;
    }

    // Se retornar array direto
    return {
      data: response.data,
      total: response.data.length,
      page: 1,
      pages: 1,
    };
  },

  /**
   * Busca ofertas em destaque (para home)
   */
  async getFeaturedOffers(limit: number = 6): Promise<OfferListItem[]> {
    const response = await api.get<OfferListItem[]>('/offers/', {
      params: {
        is_featured: true,
        is_active: true,
        limit,
      },
    });
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Busca detalhes de uma oferta específica
   */
  async getOffer(offerId: number): Promise<Offer> {
    const response = await api.get<Offer>(`/offers/${offerId}`);
    return response.data;
  },

  /**
   * Busca ofertas de um vendedor específico (público)
   */
  async getOffersBySeller(sellerId: number, params?: Omit<OffersParams, 'seller_id'>): Promise<OfferListItem[]> {
    const response = await api.get<OfferListItem[]>('/offers/', {
      params: {
        ...params,
        seller_id: sellerId,
        is_active: true,
      },
    });
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Busca minhas ofertas (vendedor autenticado)
   */
  async getMyOffers(): Promise<Offer[]> {
    const response = await api.get<Offer[]>('/offers/my-offers');
    return response.data;
  },

  /**
   * Cria uma nova oferta (vendedor)
   */
  async createOffer(offerData: Partial<Offer>): Promise<Offer> {
    const response = await api.post<Offer>('/offers/', offerData);
    return response.data;
  },

  /**
   * Atualiza uma oferta (vendedor)
   */
  async updateOffer(offerId: number, offerData: Partial<Offer>): Promise<Offer> {
    const response = await api.patch<Offer>(`/offers/${offerId}`, offerData);
    return response.data;
  },

  /**
   * Desativa uma oferta (vendedor)
   */
  async deleteOffer(offerId: number): Promise<void> {
    await api.delete(`/offers/${offerId}`);
  },
};
