/**
 * Subscription API service
 */

import api from './api';
import type {
  SubscriptionPlan,
  SubscriptionPlanCreate,
  SubscriptionPlanUpdate,
  Subscription,
  SubscriptionCreate,
  SubscriptionUpdate,
  SubscriptionPauseRequest,
  SubscriptionCancelRequest,
  SubscriptionStatus,
} from '../types';

// Subscription Plans (Seller)
export const subscriptionPlanService = {
  // Public: List all active subscription plans
  listPublic: async (sellerId?: number, skip: number = 0, limit: number = 20): Promise<SubscriptionPlan[]> => {
    const response = await api.get<SubscriptionPlan[]>('/subscription-plans/public', {
      params: { seller_id: sellerId, skip, limit },
    });
    return response.data;
  },

  // Public: Get a specific plan
  getPublic: async (planId: number): Promise<SubscriptionPlan> => {
    const response = await api.get<SubscriptionPlan>(`/subscription-plans/public/${planId}`);
    return response.data;
  },

  // Create a new subscription plan
  create: async (data: SubscriptionPlanCreate): Promise<SubscriptionPlan> => {
    const response = await api.post<SubscriptionPlan>('/subscription-plans/', data);
    return response.data;
  },

  // List all plans for current seller
  list: async (activeOnly: boolean = true): Promise<SubscriptionPlan[]> => {
    const response = await api.get<SubscriptionPlan[]>('/subscription-plans/', {
      params: { active_only: activeOnly },
    });
    return response.data;
  },

  // Get a specific plan
  get: async (planId: number): Promise<SubscriptionPlan> => {
    const response = await api.get<SubscriptionPlan>(`/subscription-plans/${planId}`);
    return response.data;
  },

  // Update a plan
  update: async (
    planId: number,
    data: SubscriptionPlanUpdate
  ): Promise<SubscriptionPlan> => {
    const response = await api.patch<SubscriptionPlan>(
      `/subscription-plans/${planId}`,
      data
    );
    return response.data;
  },

  // Delete a plan
  delete: async (planId: number): Promise<void> => {
    await api.delete(`/subscription-plans/${planId}`);
  },
};

// Subscriptions (Customer)
export const subscriptionService = {
  // Create subscription directly from a plan (simplified)
  createFromPlan: async (
    planId: number,
    deliveryAddress: any,
    paymentMethod: string,
    deliveryDayOfWeek?: number,
    deliveryDayOfMonth?: number
  ): Promise<Subscription> => {
    const response = await api.post<Subscription>(
      `/subscriptions/from-plan/${planId}`,
      {
        delivery_address: deliveryAddress,
        payment_method: paymentMethod,
        delivery_day_of_week: deliveryDayOfWeek,
        delivery_day_of_month: deliveryDayOfMonth,
      }
    );
    return response.data;
  },

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
