import { get, post } from './client';
import { LoginCredentials, AuthUser } from '../types';

export const authApi = {
  // Login user - Fixed: backend returns raw data with token
  login: (credentials: LoginCredentials): Promise<{ token: string; user: AuthUser }> => {
    return post<{ token: string; user: AuthUser }>('/auth/login', credentials);
  },

  // Register user - Fixed: backend returns raw data with token
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<{ token: string; user: AuthUser }> => {
    return post<{ token: string; user: AuthUser }>('/auth/register', userData);
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
