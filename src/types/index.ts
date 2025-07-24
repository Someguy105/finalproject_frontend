// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  description: string;
  slug?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  metadata?: {
    color?: string;
    icon?: string;
    featured?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  images: string[];
  metadata: {
    featured: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Order types
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  user: User;
  orderNumber: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  currency: string;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Order Item types
export interface OrderItem {
  id: string;
  order: Order;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

// Review types
export interface Review {
  id: string;
  productId: number;  // Changed to number to match backend
  userId: string;
  rating: number;
  title: string;
  comment: string;
  helpfulCount?: number;
  isVerified: boolean;
  createdAt: string;  // Changed to string as it comes from API
  updatedAt: string;  // Changed to string as it comes from API
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
  token: string;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}
