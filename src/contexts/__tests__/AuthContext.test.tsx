import { renderHook, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { AuthProvider, useAuth } from '../AuthContext';
import { authService } from '../../services/auth.service';
import type { User, AuthResponse } from '../../types/auth';

// Mock services
jest.mock('../../services/auth.service');
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockUser: User = {
  id: 1,
  email: 'test@test.com',
  full_name: 'Test User',
  cpf: '12345678901',
  phone: null,
  cep: '30110-000',
  street: 'Rua Teste',
  number: '123',
  complement: null,
  neighborhood: 'Centro',
  city: 'Belo Horizonte',
  state: 'MG',
  is_seller: false,
  is_active: true,
  created_at: new Date().toISOString(),
};

const mockAuthResponse: AuthResponse = {
  access_token: 'fake-token',
  token_type: 'bearer',
  user: mockUser,
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should start with null user and token', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.loading).toBe(false);
    });

    it('should load user from localStorage', () => {
      localStorage.setItem('uailoop_token', 'stored-token');
      localStorage.setItem('uailoop_user', JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe('stored-token');
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      (authService.login as jest.Mock).mockResolvedValue(mockAuthResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login({
          email: 'test@test.com',
          password: 'password123',
        });
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe('fake-token');
      expect(result.current.isAuthenticated).toBe(true);
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      });
    });

    it('should set loading state during login', async () => {
      (authService.login as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockAuthResponse), 100))
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login({
          email: 'test@test.com',
          password: 'password123',
        });
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle login error', async () => {
      const error = new Error('Invalid credentials');
      (authService.login as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.login({
            email: 'test@test.com',
            password: 'wrongpassword',
          });
        })
      ).rejects.toThrow('Invalid credentials');

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should persist token and user to localStorage', async () => {
      (authService.login as jest.Mock).mockResolvedValue(mockAuthResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login({
          email: 'test@test.com',
          password: 'password123',
        });
      });

      expect(localStorage.getItem('uailoop_token')).toBe('fake-token');
      const storedUser = JSON.parse(localStorage.getItem('uailoop_user')!);
      expect(storedUser.email).toBe(mockUser.email);
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      (authService.register as jest.Mock).mockResolvedValue(mockAuthResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.register({
          email: 'newuser@test.com',
          password: 'password123',
          full_name: 'New User',
          cpf: '12345678901',
          cep: '30110-000',
          street: 'Rua Teste',
          number: '123',
          neighborhood: 'Centro',
          city: 'Belo Horizonte',
          state: 'MG',
        });
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe('fake-token');
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle registration error', async () => {
      const error = new Error('Email already exists');
      (authService.register as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.register({
            email: 'existing@test.com',
            password: 'password123',
            full_name: 'Test User',
            cpf: '12345678901',
            cep: '30110-000',
            street: 'Rua Teste',
            number: '123',
            neighborhood: 'Centro',
            city: 'Belo Horizonte',
            state: 'MG',
          });
        })
      ).rejects.toThrow('Email already exists');

      expect(result.current.user).toBeNull();
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      (authService.login as jest.Mock).mockResolvedValue(mockAuthResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Login first
      await act(async () => {
        await result.current.login({
          email: 'test@test.com',
          password: 'password123',
        });
      });

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(localStorage.getItem('uailoop_token')).toBeNull();
      expect(localStorage.getItem('uailoop_user')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user and token exist', async () => {
      (authService.login as jest.Mock).mockResolvedValue(mockAuthResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login({
          email: 'test@test.com',
          password: 'password123',
        });
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should return false when user or token is missing', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
