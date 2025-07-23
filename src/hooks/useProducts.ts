import { useState, useEffect } from 'react';
import { productApi, categoryApi } from '../api';
import { Product, Category } from '../types';

// Backend Product type (what we actually get from API)
interface BackendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  images: string[];
  isAvailable: boolean;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export const useProducts = (params?: {
  category?: string;
  search?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both products and categories
        const [productsResponse, categoriesResponse] = await Promise.all([
          productApi.getProducts(params) as unknown as BackendProduct[],
          categoryApi.getCategories()
        ]);
        
        // Create a map of categories for quick lookup
        const categoryMap = new Map<number, Category>();
        categoriesResponse.forEach(cat => {
          categoryMap.set(Number(cat.id), cat);
        });
        
        // Transform backend products to frontend products
        const transformedProducts: Product[] = productsResponse.map(backendProduct => ({
          id: String(backendProduct.id),
          name: backendProduct.name,
          description: backendProduct.description,
          price: backendProduct.price,
          stock: backendProduct.stock,
          category: categoryMap.get(backendProduct.categoryId) || {
            id: String(backendProduct.categoryId),
            name: 'Unknown',
            description: '',
            slug: '',
            image: '',
            isActive: true,
            sortOrder: 999,
            metadata: {},
            createdAt: '',
            updatedAt: ''
          },
          images: backendProduct.images || [],
          metadata: {
            featured: backendProduct.metadata?.featured || false
          },
          createdAt: backendProduct.createdAt,
          updatedAt: backendProduct.updatedAt
        }));
        
        setProducts(transformedProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params, params?.category, params?.search, params?.featured, params?.page, params?.limit]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both products and categories
      const [productsResponse, categoriesResponse] = await Promise.all([
        productApi.getProducts(params) as unknown as BackendProduct[],
        categoryApi.getCategories()
      ]);
      
      // Create a map of categories for quick lookup
      const categoryMap = new Map<number, Category>();
      categoriesResponse.forEach(cat => {
        categoryMap.set(Number(cat.id), cat);
      });
      
      // Transform backend products to frontend products
      const transformedProducts: Product[] = productsResponse.map(backendProduct => ({
        id: String(backendProduct.id),
        name: backendProduct.name,
        description: backendProduct.description,
        price: backendProduct.price,
        stock: backendProduct.stock,
        category: categoryMap.get(backendProduct.categoryId) || {
          id: String(backendProduct.categoryId),
          name: 'Unknown',
          description: '',
          slug: '',
          image: '',
          isActive: true,
          sortOrder: 999,
          metadata: {},
          createdAt: '',
          updatedAt: ''
        },
        images: backendProduct.images || [],
        metadata: {
          featured: backendProduct.metadata?.featured || false
        },
        createdAt: backendProduct.createdAt,
        updatedAt: backendProduct.updatedAt
      }));
      
      setProducts(transformedProducts);
    } catch (err) {
      console.error('Failed to refetch products:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response: Product = await productApi.getProduct(id);
        setProduct(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response: Category[] = await categoryApi.getCategories();
        setCategories(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
