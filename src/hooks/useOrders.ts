import { useState, useEffect } from 'react';
import { orderApi } from '../api';
import { Order, User, OrderStatus, PaymentStatus } from '../types';

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
  orderItems?: any[];
  createdAt: string;
  updatedAt: string;
}

// Transform backend order to frontend order
const transformOrder = (backendOrder: BackendOrder): Order => {
  return {
    id: String(backendOrder.id),
    user: {
      id: String(backendOrder.userId),
      email: '',
      firstName: '',
      lastName: '',
      role: 'customer',
      isActive: true,
      createdAt: '',
      updatedAt: ''
    } as User,
    orderNumber: backendOrder.orderNumber,
    subtotal: backendOrder.subtotal,
    taxAmount: backendOrder.taxAmount,
    shippingAmount: backendOrder.shippingAmount,
    discountAmount: backendOrder.discountAmount,
    totalAmount: backendOrder.totalAmount,
    status: backendOrder.status,
    paymentStatus: backendOrder.paymentStatus,
    shippingAddress: backendOrder.shippingAddress || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    paymentMethod: backendOrder.paymentMethod,
    currency: backendOrder.currency,
    createdAt: backendOrder.createdAt,
    updatedAt: backendOrder.updatedAt,
  };
};

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderApi.getOrders() as unknown as BackendOrder[];
        const transformedOrders = response.map(transformOrder);
        setOrders(transformedOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderApi.getOrders() as unknown as BackendOrder[];
      const transformedOrders = response.map(transformOrder);
      setOrders(transformedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, error, refetch };
};

export const useMyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderApi.getMyOrders() as unknown as BackendOrder[];
        const transformedOrders = response.map(transformOrder);
        setOrders(transformedOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderApi.getMyOrders() as unknown as BackendOrder[];
      const transformedOrders = response.map(transformOrder);
      setOrders(transformedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, error, refetch };
};

export const useOrder = (id: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderApi.getOrder(id) as unknown as BackendOrder;
        const transformedOrder = transformOrder(response);
        setOrder(transformedOrder);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  return { order, loading, error };
};
