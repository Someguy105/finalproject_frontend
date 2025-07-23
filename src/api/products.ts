import { get, post, put, del } from './client';
import { Product, Category } from '../types';

export const productApi = {
  // Get all products - Backend wraps data in ApiResponse, client extracts data property
  getProducts: (params?: {
    category?: string;
    search?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }): Promise<Product[]> => {
    // Note: Backend doesn't support query parameters yet, returns all products
    return get<Product[]>('/products');
  },

  // Get single product by ID - Backend wraps data in ApiResponse, client extracts data property
  getProduct: (id: string): Promise<Product> => {
    return get<Product>(`/products/${id}`);
  },

  // Create new product (admin only) - Backend wraps data in ApiResponse, client extracts data property
  createProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    return post<Product>('/admin/products', productData);
  },

  // Update product - Backend wraps data in ApiResponse, client extracts data property
  updateProduct: (id: string, productData: Partial<Product>): Promise<Product> => {
    return put<Product>(`/products/${id}`, productData);
  },

  // Delete product (admin only) - Backend wraps data in ApiResponse, client extracts data property
  deleteProduct: (id: string): Promise<boolean> => {
    return del<boolean>(`/admin/products/${id}`);
  },
};

export const categoryApi = {
  // Get all categories - Backend wraps data in ApiResponse, client extracts data property
  getCategories: (): Promise<Category[]> => {
    return get<Category[]>('/categories');
  },

  // Get single category by ID - Backend wraps data in ApiResponse, client extracts data property
  getCategory: (id: string): Promise<Category> => {
    return get<Category>(`/categories/${id}`);
  },

  // Create new category (admin only) - Backend wraps data in ApiResponse, client extracts data property
  createCategory: (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
    return post<Category>('/categories', categoryData);
  },

  // Update category (admin only) - Fixed: backend returns raw data
  updateCategory: (id: string, categoryData: Partial<Category>): Promise<Category> => {
    return put<Category>(`/categories/${id}`, categoryData);
  },

  // Delete category (admin only) - Fixed: backend returns boolean success
  deleteCategory: (id: string): Promise<boolean> => {
    return del<boolean>(`/categories/${id}`);
  },
};
