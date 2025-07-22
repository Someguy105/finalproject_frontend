import { get, post, put, del } from './client';
import { Product, Category } from '../types';

export const productApi = {
  // Get all products - Fixed: backend returns raw data, not wrapped in ApiResponse
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

  // Get single product by ID - Fixed: backend returns raw data
  getProduct: (id: string): Promise<Product> => {
    return get<Product>(`/products/${id}`);
  },

  // Create new product (admin only) - Fixed: backend returns raw data
  createProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    return post<Product>('/admin/products', productData);
  },

  // Update product (admin only) - Fixed: backend returns raw data
  updateProduct: (id: string, productData: Partial<Product>): Promise<Product> => {
    return put<Product>(`/admin/products/${id}`, productData);
  },

  // Delete product (admin only) - Fixed: backend returns boolean success, not void
  deleteProduct: (id: string): Promise<boolean> => {
    return del<boolean>(`/admin/products/${id}`);
  },
};

export const categoryApi = {
  // Get all categories - Fixed: backend returns raw data
  getCategories: (): Promise<Category[]> => {
    return get<Category[]>('/categories');
  },

  // Get single category by ID - Fixed: backend returns raw data
  getCategory: (id: string): Promise<Category> => {
    return get<Category>(`/categories/${id}`);
  },

  // Create new category (admin only) - Fixed: backend returns raw data
  createCategory: (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
    return post<Category>('/admin/categories', categoryData);
  },

  // Update category (admin only) - Fixed: backend returns raw data
  updateCategory: (id: string, categoryData: Partial<Category>): Promise<Category> => {
    return put<Category>(`/admin/categories/${id}`, categoryData);
  },

  // Delete category (admin only) - Fixed: backend returns boolean success
  deleteCategory: (id: string): Promise<boolean> => {
    return del<boolean>(`/admin/categories/${id}`);
  },
};
