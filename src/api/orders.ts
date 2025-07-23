import { get, post, put, del } from './client';
import { OrderStatus, PaymentStatus } from '../types';

// Backend Order type (what we actually get from API)
interface BackendOrder {
  id: number;
  userId: number;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  shippingAddress: any;
  billingAddress: any;
  paymentMethod: string;
  paymentReference?: string;
  trackingNumber?: string;
  notes?: string;
  metadata?: any;
  orderItems?: BackendOrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Backend OrderItem type
interface BackendOrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productSnapshot?: any;
}

// Create Order DTO
interface CreateOrderDto {
  userId: number;
  orderNumber: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod?: string;
  notes?: string;
}

export const orderApi = {
  // Get all orders (admin only)
  getOrders: (): Promise<BackendOrder[]> => {
    return get<BackendOrder[]>('/orders');
  },

  // Get orders for current customer
  getMyOrders: (): Promise<BackendOrder[]> => {
    return get<BackendOrder[]>('/orders/my-orders');
  },

  // Get single order by ID
  getOrder: (id: string | number): Promise<BackendOrder> => {
    return get<BackendOrder>(`/orders/${id}`);
  },

  // Create new order
  createOrder: (orderData: CreateOrderDto): Promise<BackendOrder> => {
    return post<BackendOrder>('/orders', orderData);
  },

  // Update order status (admin only)
  updateOrder: (id: string | number, orderData: Partial<BackendOrder>): Promise<BackendOrder> => {
    return put<BackendOrder>(`/orders/${id}`, orderData);
  },

  // Cancel order
  cancelOrder: (id: string | number): Promise<BackendOrder> => {
    return put<BackendOrder>(`/orders/${id}/cancel`, {});
  },
};

export const orderItemApi = {
  // Get all order items
  getOrderItems: (): Promise<BackendOrderItem[]> => {
    return get<BackendOrderItem[]>('/order-items');
  },

  // Get order items for specific order
  getOrderItemsByOrder: (orderId: string | number): Promise<BackendOrderItem[]> => {
    return get<BackendOrderItem[]>(`/orders/${orderId}/items`);
  },

  // Create order item (usually done when creating order)
  createOrderItem: (orderItemData: {
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    productSnapshot?: {
      name: string;
      description: string;
      image: string;
    };
  }): Promise<BackendOrderItem> => {
    return post<BackendOrderItem>('/order-items', orderItemData);
  },

  // Update order item
  updateOrderItem: (id: string | number, orderItemData: Partial<BackendOrderItem>): Promise<BackendOrderItem> => {
    return put<BackendOrderItem>(`/order-items/${id}`, orderItemData);
  },

  // Delete order item
  deleteOrderItem: (id: string | number): Promise<boolean> => {
    return del<boolean>(`/order-items/${id}`);
  },
};
