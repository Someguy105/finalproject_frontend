import { get, post } from './client';
import { LoginCredentials, AuthUser } from '../types';

export const authApi = {
  // Login user - Updated: backend returns access_token, not token
  login: async (credentials: LoginCredentials): Promise<{ token: string; user: AuthUser }> => {
    const response = await post<{ access_token: string; user: AuthUser }>('/auth/login', credentials);
    // Map access_token to token for frontend compatibility
    return {
      token: response.access_token,
      user: response.user
    };
  },

  // Register user - Updated: backend returns access_token, not token
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<{ token: string; user: AuthUser }> => {
    const response = await post<{ access_token: string; user: AuthUser }>('/auth/register', userData);
    // Map access_token to token for frontend compatibility
    return {
      token: response.access_token,
      user: response.user
    };
  },

  // Get current user profile - Fixed: backend returns raw user data
  getProfile: (): Promise<AuthUser> => {
    return get<AuthUser>('/auth/profile');
  },

  // Logout user (client-side token removal)
  logout: (): void => {
    localStorage.removeItem('authToken');
  },
};
