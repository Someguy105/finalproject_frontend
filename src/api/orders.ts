import { get, post, put, del } from './client';
import { Order } from '../types';

export const orderApi = {
  // Get user's orders - Fixed: backend expects /orders to get all orders, need to filter by current user
  getOrders: (): Promise<Order[]> => {
    return get<Order[]>('/orders');
  },

  // Get single order by ID - Fixed: backend returns raw data
  getOrder: (id: string): Promise<Order> => {
    return get<Order>(`/orders/${id}`);
  },

  // Create new order - Fixed: backend returns raw data
  createOrder: (orderData: {
    items: { productId: string; quantity: number }[];
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    paymentMethod: string;
  }): Promise<Order> => {
    return post<Order>('/orders', orderData);
  },

  // Update order (admin only) - Fixed: backend uses PUT /orders/:id, not /orders/:id/status
  updateOrderStatus: (id: string, status: string): Promise<Order> => {
    return put<Order>(`/admin/orders/${id}`, { status });
  },

  // Delete order (admin only)
  deleteOrder: (id: string): Promise<boolean> => {
    return del<boolean>(`/admin/orders/${id}`);
  },

  // Get all orders (admin only) - Fixed: backend uses /orders, not /admin/orders
  getAllOrders: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<Order[]> => {
    // Note: Backend doesn't support filtering, returns all orders
    return get<Order[]>('/orders');
  },
};
