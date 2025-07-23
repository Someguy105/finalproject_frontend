import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, CartItem } from '../types';
import { orderApi, orderItemApi, productApi } from '../api';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string } // product id
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType extends CartState {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }, paymentMethod?: string) => Promise<number>; // Returns order ID
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);
      
      let newItems;
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, { product, quantity }];
      }
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.payload);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: productId });
      }
      
      const newItems = state.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0,
      };
    
    default:
      return state;
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalAmount: 0,
  });

  const addItem = (product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const checkout = async (
    shippingAddress?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    },
    paymentMethod = 'credit_card'
  ): Promise<number> => {
    if (state.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Calculate totals
    const subtotal = state.totalAmount;
    const taxAmount = subtotal * 0.08; // 8% tax
    const shippingAmount = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const discountAmount = 0;
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Prepare order data (without items)
    const orderData = {
      userId: 1, // Default user ID since no auth is required
      orderNumber,
      subtotal,
      taxAmount,
      shippingAmount,
      discountAmount,
      totalAmount,
      currency: 'USD',
      shippingAddress: shippingAddress || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
      },
      paymentMethod,
      notes: 'Order placed from cart',
    };

    try {
      // Create order first
      const order = await orderApi.createOrder(orderData);
      
      // Create order items
      for (const item of state.items) {
        await orderItemApi.createOrderItem({
          orderId: order.id,
          productId: Number(item.product.id),
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: item.product.price * item.quantity,
          productSnapshot: {
            name: item.product.name,
            description: item.product.description,
            image: item.product.images?.[0] || '',
          },
        });

        // Reduce product stock
        try {
          console.log(`Updating stock for product ${item.product.id}: ${item.product.stock} -> ${item.product.stock - item.quantity}`);
          await productApi.updateProduct(item.product.id, {
            stock: item.product.stock - item.quantity
          });
          console.log(`Successfully updated stock for product ${item.product.id}`);
        } catch (stockError) {
          console.error(`Failed to update stock for product ${item.product.id}:`, stockError);
          // Continue with order creation even if stock update fails
        }
      }
      
      // Clear cart after successful order creation
      dispatch({ type: 'CLEAR_CART' });
      
      return order.id;
    } catch (error) {
      console.error('Checkout failed:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
