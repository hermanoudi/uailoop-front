import api from './api';

export interface DeliveryItem {
  id: number;
  type: 'order' | 'subscription';
  customer_id: number;
  customer_name: string;
  delivery_date: string;
  total_amount: number;
  status: string;
  delivery_address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  products: Array<{
    product_name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  payment_method: string;
  notes?: string;
}

export const deliveryService = {
  /**
   * Get upcoming deliveries for the seller
   */
  getUpcoming: async (daysAhead: number = 7): Promise<DeliveryItem[]> => {
    const response = await api.get<DeliveryItem[]>('/deliveries/upcoming', {
      params: { days_ahead: daysAhead },
    });
    return response.data;
  },
};
