/**
 * Subscription API service
 */

import api from './api';
import type {
  Subscription,
  SubscriptionCreate,
  SubscriptionUpdate,
  SubscriptionPauseRequest,
  SubscriptionCancelRequest,
  SubscriptionStatus,
} from '../types';

// Subscriptions (Customer)
export const subscriptionService = {
  // Create a new subscription
  create: async (data: SubscriptionCreate): Promise<Subscription> => {
    const response = await api.post<Subscription>('/subscriptions/', data);
    return response.data;
  },

  // List all subscriptions for current user
  list: async (statusFilter?: SubscriptionStatus): Promise<Subscription[]> => {
    const response = await api.get<Subscription[]>('/subscriptions/', {
      params: statusFilter ? { status_filter: statusFilter } : {},
    });
    return response.data;
  },

  // Get a specific subscription
  get: async (subscriptionId: number): Promise<Subscription> => {
    const response = await api.get<Subscription>(`/subscriptions/${subscriptionId}`);
    return response.data;
  },

  // Update a subscription
  update: async (
    subscriptionId: number,
    data: SubscriptionUpdate
  ): Promise<Subscription> => {
    const response = await api.patch<Subscription>(
      `/subscriptions/${subscriptionId}`,
      data
    );
    return response.data;
  },

  // Pause a subscription
  pause: async (
    subscriptionId: number,
    data: SubscriptionPauseRequest = {}
  ): Promise<Subscription> => {
    const response = await api.post<Subscription>(
      `/subscriptions/${subscriptionId}/pause`,
      data
    );
    return response.data;
  },

  // Resume a paused subscription
  resume: async (subscriptionId: number): Promise<Subscription> => {
    const response = await api.post<Subscription>(
      `/subscriptions/${subscriptionId}/resume`,
      {}
    );
    return response.data;
  },

  // Cancel a subscription
  cancel: async (
    subscriptionId: number,
    data: SubscriptionCancelRequest = {}
  ): Promise<Subscription> => {
    const response = await api.post<Subscription>(
      `/subscriptions/${subscriptionId}/cancel`,
      data
    );
    return response.data;
  },

  // Delete a subscription
  delete: async (subscriptionId: number): Promise<void> => {
    await api.delete(`/subscriptions/${subscriptionId}`);
  },

  // List customer subscriptions for seller
  listForSeller: async (statusFilter?: SubscriptionStatus): Promise<Subscription[]> => {
    const response = await api.get<Subscription[]>('/subscriptions/seller/customers', {
      params: statusFilter ? { status_filter: statusFilter } : {},
    });
    return response.data;
  },
};
