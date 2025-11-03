/**
 * Authentication service - API calls for authentication
 */

import { api } from './api';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth';

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // FastAPI expects form data for OAuth2
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await api.post<{ access_token: string; token_type: string }>(
      '/auth/login',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Get user data after login
    const token = response.data.access_token;
    const userResponse = await api.get<User>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      access_token: token,
      token_type: response.data.token_type,
      user: userResponse.data,
    };
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<User>('/auth/register', data);

    // Auto-login after registration
    const loginResult = await this.login({
      email: data.email,
      password: data.password,
    });

    return loginResult;
  },

  /**
   * Get current user data
   */
  async getCurrentUser(token: string): Promise<User> {
    const response = await api.get<User>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Logout (client-side only, remove token)
   */
  logout(): void {
    // In a real app, you might want to call an API endpoint to invalidate the token
    // For now, we'll just remove it from local storage (handled by AuthContext)
  },
};
