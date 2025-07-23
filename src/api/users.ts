import { get, post, put, del } from './client';
import { User } from '../types';

export const userApi = {
  // Get all users (admin only)
  getUsers: (): Promise<User[]> => {
    return get<User[]>('/users');
  },

  // Get single user by ID
  getUser: (id: string): Promise<User> => {
    return get<User>(`/users/${id}`);
  },

  // Create new user (admin only)
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    return post<User>('/users', userData);
  },

  // Update user (admin only)
  updateUser: (id: string, userData: Partial<User>): Promise<User> => {
    return put<User>(`/users/${id}`, userData);
  },

  // Delete user (admin only)
  deleteUser: (id: string): Promise<boolean> => {
    return del<boolean>(`/users/${id}`);
  },

  // Admin protected routes
  getAdminUsers: (): Promise<{ message: string; user: any; data: User[] }> => {
    return get<{ message: string; user: any; data: User[] }>('/admin/users');
  },

  // Customer profile
  getCustomerProfile: (): Promise<{ message: string; user: any }> => {
    return get<{ message: string; user: any }>('/customer/profile');
  },
};
