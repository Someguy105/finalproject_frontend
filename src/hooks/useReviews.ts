import { useState, useEffect, useCallback } from 'react';
import { reviewApi, productApi } from '../api';
import { Review, Product } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useUserReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<{ [key: string]: Product }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isTestCustomer = useCallback((): boolean => {
    if (!user) return false;
    return user.email === 'customer@test.com';
  }, [user]);

  // Mock reviews data for customer@test.com
  const getTestReviewsData = useCallback((): Review[] => {
    return [
      {
        id: '1',
        productId: 1,
        userId: user?.id || '1',
        rating: 5,
        title: '¡Excelente calidad y diseño único!',
        comment: 'Este producto superó todas mis expectativas. El material es de primera calidad y su diseño es realmente único. Lo uso regularmente y sigue en perfecto estado después de varios meses. La atención al detalle es impresionante y definitivamente compraría de nuevo. Lo recomiendo ampliamente para quienes buscan algo especial y duradero.',
        helpfulCount: 15,
        isVerified: true,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        productId: 2,
        userId: user?.id || '1',
        rating: 4,
        title: 'Muy bueno, pero podría mejorar',
        comment: 'En general estoy satisfecho con esta compra. El producto funciona bien y tiene un buen acabado. Sin embargo, hay algunos pequeños detalles que podrían mejorar como el empaque y algunas instrucciones que no estaban muy claras. A pesar de esto, cumple con lo prometido y la relación calidad-precio es muy buena. Lo recomendaría con esas pequeñas observaciones.',
        helpfulCount: 7,
        isVerified: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        productId: 3,
        userId: user?.id || '1',
        rating: 5,
        title: 'Perfecto para regalo, elegante y práctico',
        comment: 'Compré este producto como regalo para mi mejor amigo y quedó encantado. El empaque es muy elegante y el producto en sí tiene un aspecto premium que supera el precio que pagué. Además de verse bien, es muy funcional y práctico para el uso diario. Definitivamente volveré a comprar para otros amigos y familiares. El servicio de entrega también fue excelente y llegó antes de lo esperado.',
        helpfulCount: 22,
        isVerified: true,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
        updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        productId: 5,
        userId: user?.id || '1',
        rating: 3,
        title: 'Aceptable pero esperaba más',
        comment: 'El producto cumple con su función básica, pero esperaba más por el precio que pagué. El material se siente menos duradero de lo que mostraban las fotos y el color es ligeramente diferente. No es malo, pero tampoco me impresionó. Creo que hay mejores opciones en el mercado por un precio similar. Lo positivo es que el servicio al cliente fue muy atento cuando consulté algunas dudas.',
        helpfulCount: 4,
        isVerified: true,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
        updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        productId: 7,
        userId: user?.id || '1',
        rating: 5,
        title: 'Innovador y de excelente fabricación',
        comment: 'Este es uno de los mejores productos que he comprado este año. Su diseño innovador resuelve problemas que otros productos similares no logran abordar. La calidad de fabricación es excepcional y se nota que hay mucha investigación detrás. El servicio postventa también ha sido muy bueno. Me encanta que la empresa se preocupe tanto por los detalles y la experiencia del cliente. Vale cada centavo invertido.',
        helpfulCount: 31,
        isVerified: true,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '6',
        productId: 8,
        userId: user?.id || '1',
        rating: 5,
        title: 'Increíble relación calidad-precio',
        comment: 'Estoy gratamente sorprendido con este producto. Normalmente no escribo reseñas, pero esta vez sentí que debía hacerlo. La calidad es comparable a productos mucho más caros y su funcionalidad es excelente. Llevo usándolo varias semanas y no he tenido ningún problema. Además, el diseño es muy atractivo y he recibido varios cumplidos. Definitivamente volveré a comprar de esta marca en el futuro.',
        helpfulCount: 18,
        isVerified: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];
  }, [user]);

  // Mock product data to match with test reviews
  const getTestProductsData = useCallback((): { [key: string]: Product } => {
    return {
      '1': {
        id: '1',
        name: 'Camiseta Premium Exclusiva Edición Limitada',
        description: 'Camiseta de algodón 100% orgánico con diseño exclusivo de edición limitada',
        price: 49.99,
        stock: 25,
        images: ['/assets/products/camiseta-premium.jpg'],
        category: { id: '1', name: 'Ropa', description: '', isActive: true, sortOrder: 1, createdAt: '', updatedAt: '' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { featured: false },
      },
      '2': {
        id: '2',
        name: 'Zapatillas Deportivas Ultra Confort',
        description: 'Zapatillas deportivas con tecnología de amortiguación avanzada y soporte para largas jornadas',
        price: 89.99,
        stock: 18,
        images: ['/assets/products/zapatillas-deportivas.jpg'],
        category: { id: '2', name: 'Calzado', description: '', isActive: true, sortOrder: 2, createdAt: '', updatedAt: '' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { featured: true },
      },
      '3': {
        id: '3',
        name: 'Reloj Inteligente TechPro Serie X',
        description: 'Reloj inteligente con monitorización avanzada de actividad física y salud',
        price: 129.99,
        stock: 12,
        images: ['/assets/products/reloj-inteligente.jpg'],
        category: { id: '3', name: 'Tecnología', description: '', isActive: true, sortOrder: 3, createdAt: '', updatedAt: '' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { featured: true },
      },
      '5': {
        id: '5',
        name: 'Mochila Ergonómica Viajera',
        description: 'Mochila con diseño ergonómico para viajes, impermeable y con múltiples compartimentos',
        price: 79.99,
        stock: 22,
        images: ['/assets/products/mochila-ergonomica.jpg'],
        category: { id: '4', name: 'Accesorios', description: '', isActive: true, sortOrder: 4, createdAt: '', updatedAt: '' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { featured: false },
      },
      '7': {
        id: '7',
        name: 'Auriculares Noise-Cancelling Studio Pro',
        description: 'Auriculares over-ear con cancelación de ruido activa y sonido de estudio profesional',
        price: 199.99,
        stock: 10,
        images: ['/assets/products/auriculares-pro.jpg'],
        category: { id: '3', name: 'Tecnología', description: '', isActive: true, sortOrder: 3, createdAt: '', updatedAt: '' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { featured: true },
      },
      '8': {
        id: '8',
        name: 'Cafetera Gourmet Programable',
        description: 'Cafetera automática programable con molinillo integrado y ajustes personalizables',
        price: 149.99,
        stock: 8,
        images: ['/assets/products/cafetera-gourmet.jpg'],
        category: { id: '5', name: 'Hogar', description: '', isActive: true, sortOrder: 5, createdAt: '', updatedAt: '' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { featured: false },
      },
    };
  }, []);

  const fetchUserReviews = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);

      // Use test data for customer@test.com
      if (isTestCustomer()) {
        console.log('Usando datos de prueba para customer@test.com - Reviews');
        const testReviews = getTestReviewsData();
        const testProducts = getTestProductsData();
        
        setReviews(testReviews);
        setProducts(testProducts);
        
        setLoading(false);
        return;
      }

      // Normal API flow for other users
      const userReviews = await reviewApi.getReviewsByUser(user.id);
      setReviews(userReviews as any);

      // Fetch product details for each review
      const productPromises = userReviews.map(review => 
        productApi.getProduct(review.productId.toString())
      );
      
      const productResults = await Promise.allSettled(productPromises);
      const productMap: { [key: string]: Product } = {};
      
      productResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const productId = userReviews[index].productId.toString();
          productMap[productId] = result.value;
        }
      });
      
      setProducts(productMap);
    } catch (err) {
      setError('No se pudieron cargar tus reseñas');
      console.error('Error al cargar reseñas:', err);
    } finally {
      setLoading(false);
    }
  }, [user, isTestCustomer, getTestReviewsData, getTestProductsData]);

  // Handle creating a new review
  const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpfulCount'>) => {
    if (!user) throw new Error('Debes iniciar sesión para escribir una reseña');
    
    try {
      if (isTestCustomer()) {
        // Simulate API call for test user
        const newReview: Review = {
          id: `test-${Date.now()}`,
          ...reviewData,
          helpfulCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setReviews(prev => [...prev, newReview]);
        return newReview;
      }
      
      // Real API call for other users
      const newReview = await reviewApi.createReview(reviewData);
      setReviews(prev => [...prev, newReview]);
      return newReview;
    } catch (err) {
      console.error('Error al crear la reseña:', err);
      throw err;
    }
  };

  // Handle updating an existing review
  const updateReview = async (id: string, reviewData: Partial<Review>) => {
    try {
      if (isTestCustomer()) {
        // Simulate API call for test user
        setReviews(prev => prev.map(r => 
          r.id === id ? { ...r, ...reviewData, updatedAt: new Date().toISOString() } : r
        ));
        
        return reviews.find(r => r.id === id) as Review;
      }
      
      // Real API call for other users
      const updatedReview = await reviewApi.updateReview(id, reviewData);
      setReviews(prev => prev.map(r => r.id === id ? updatedReview : r));
      return updatedReview;
    } catch (err) {
      console.error('Error al actualizar la reseña:', err);
      throw err;
    }
  };

  // Handle deleting a review
  const deleteReview = async (id: string) => {
    try {
      if (isTestCustomer()) {
        // Simulate API call for test user
        setReviews(prev => prev.filter(r => r.id !== id));
        return true;
      }
      
      // Real API call for other users
      await reviewApi.deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      return true;
    } catch (err) {
      console.error('Error al eliminar la reseña:', err);
      throw err;
    }
  };

  // Initial load
  useEffect(() => {
    fetchUserReviews();
  }, [fetchUserReviews]);

  return {
    reviews,
    products,
    loading,
    error,
    refetch: fetchUserReviews,
    addReview,
    updateReview,
    deleteReview
  };
};
