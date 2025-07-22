import { get, post, put, del } from './client';
import { OrderItem } from '../types';

export const orderItemApi = {
  // Get all order items
  getOrderItems: (): Promise<OrderItem[]> => {
    return get<OrderItem[]>('/order-items');
  },

  // Get single order item by ID
  getOrderItem: (id: string): Promise<OrderItem> => {
    return get<OrderItem>(`/order-items/${id}`);
  },

  // Get order items by order ID
  getOrderItemsByOrder: (orderId: string): Promise<OrderItem[]> => {
    return get<OrderItem[]>(`/order-items/order/${orderId}`);
  },

  // Create new order item (admin only)
  createOrderItem: (orderItemData: Omit<OrderItem, 'id'>): Promise<OrderItem> => {
    return post<OrderItem>('/admin/order-items', orderItemData);
  },

  // Update order item (admin only)
  updateOrderItem: (id: string, orderItemData: Partial<OrderItem>): Promise<OrderItem> => {
    return put<OrderItem>(`/admin/order-items/${id}`, orderItemData);
  },

  // Delete order item (admin only)
  deleteOrderItem: (id: string): Promise<boolean> => {
    return del<boolean>(`/admin/order-items/${id}`);
  },
};
