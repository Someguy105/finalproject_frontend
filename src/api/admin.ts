import { get, post } from './client';

// Admin and development utility endpoints
export const adminApi = {
  // Database operations (admin only)
  resetDatabase: (): Promise<{ success: boolean; message: string }> => {
    return post<{ success: boolean; message: string }>('/admin/reset-database', {});
  },

  hardResetDatabase: (): Promise<{ success: boolean; message: string }> => {
    return post<{ success: boolean; message: string }>('/admin/hard-reset-database', {});
  },

  seedUsers: (): Promise<{ message: string; users: any[] }> => {
    return post<{ message: string; users: any[] }>('/admin/seed-users', {});
  },

  seedAllData: (): Promise<any> => {
    return post<any>('/admin/seed-all-data', {});
  },
};

// Development utility endpoints (only work in non-production)
export const devApi = {
  // Database operations (dev only)
  resetDatabase: (): Promise<{ success: boolean; message: string }> => {
    return post<{ success: boolean; message: string }>('/dev/reset-database', {});
  },

  hardResetDatabase: (): Promise<{ success: boolean; message: string }> => {
    return post<{ success: boolean; message: string }>('/dev/hard-reset-database', {});
  },

  recreateSchema: (): Promise<{ success: boolean; message: string }> => {
    return post<{ success: boolean; message: string }>('/dev/recreate-schema', {});
  },

  seedUsers: (): Promise<{ message: string; users: any[] }> => {
    return post<{ message: string; users: any[] }>('/dev/seed-users', {});
  },

  seedAllData: (): Promise<any> => {
    return post<any>('/dev/seed-all-data', {});
  },
};

// Health check and utility endpoints
export const utilityApi = {
  // Test database connections
  testDatabaseConnections: (): Promise<{
    postgres: boolean;
    mongodb: boolean;
    collections: {
      users: number;
      products: number;
      categories: number;
      orders: number;
      orderItems: number;
      reviews: number;
      logs: number;
    };
  }> => {
    return get<{
      postgres: boolean;
      mongodb: boolean;
      collections: {
        users: number;
        products: number;
        categories: number;
        orders: number;
        orderItems: number;
        reviews: number;
        logs: number;
      };
    }>('/health/db');
  },

  // Hello world endpoint
  getHello: (): Promise<string> => {
    return get<string>('/');
  },
};
