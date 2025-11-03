import { authService } from '../auth.service';
import { api } from '../api';
import type { User, AuthResponse } from '../../types/auth';

jest.mock('../api');

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

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully and return user data', async () => {
      const mockLoginResponse = {
        data: {
          access_token: 'fake-token',
          token_type: 'bearer',
        },
      };

      const mockUserResponse = {
        data: mockUser,
      };

      (api.post as jest.Mock).mockResolvedValue(mockLoginResponse);
      (api.get as jest.Mock).mockResolvedValue(mockUserResponse);

      const result = await authService.login({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(api.post).toHaveBeenCalledWith(
        '/auth/login',
        expect.any(URLSearchParams),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      expect(api.get).toHaveBeenCalledWith('/auth/me', {
        headers: {
          Authorization: 'Bearer fake-token',
        },
      });

      expect(result).toEqual({
        access_token: 'fake-token',
        token_type: 'bearer',
        user: mockUser,
      });
    });

    it('should handle login errors', async () => {
      const error = new Error('Invalid credentials');
      (api.post as jest.Mock).mockRejectedValue(error);

      await expect(
        authService.login({
          email: 'test@test.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should register and auto-login user', async () => {
      const registerData = {
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
      };

      const mockRegisterResponse = {
        data: mockUser,
      };

      const mockLoginResponse = {
        data: {
          access_token: 'fake-token',
          token_type: 'bearer',
        },
      };

      const mockUserResponse = {
        data: mockUser,
      };

      (api.post as jest.Mock)
        .mockResolvedValueOnce(mockRegisterResponse) // register
        .mockResolvedValueOnce(mockLoginResponse); // login

      (api.get as jest.Mock).mockResolvedValue(mockUserResponse);

      const result = await authService.register(registerData);

      expect(api.post).toHaveBeenCalledWith('/auth/register', registerData);
      expect(result.access_token).toBe('fake-token');
      expect(result.user).toEqual(mockUser);
    });

    it('should handle registration errors', async () => {
      const error = new Error('Email already exists');
      (api.post as jest.Mock).mockRejectedValue(error);

      await expect(
        authService.register({
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
        })
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('getCurrentUser', () => {
    it('should fetch current user data', async () => {
      const mockResponse = {
        data: mockUser,
      };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.getCurrentUser('fake-token');

      expect(api.get).toHaveBeenCalledWith('/auth/me', {
        headers: {
          Authorization: 'Bearer fake-token',
        },
      });

      expect(result).toEqual(mockUser);
    });

    it('should handle errors', async () => {
      const error = new Error('Unauthorized');
      (api.get as jest.Mock).mockRejectedValue(error);

      await expect(
        authService.getCurrentUser('invalid-token')
      ).rejects.toThrow('Unauthorized');
    });
  });
});
