import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthUser } from '../types';
import { authApi } from '../api';
import { getTokenFromStorage, setTokenInStorage, removeTokenFromStorage, isTokenExpired, isAdmin, isCustomer } from '../utils';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction = 
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: AuthUser }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' };

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isCustomer: () => boolean;
  hasRole: (role: 'admin' | 'customer') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = getTokenFromStorage();
    if (token && !isTokenExpired(token)) {
      // Verify token and get user profile
      authApi.getProfile()
        .then(user => {
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        })
        .catch((error) => {
          console.error('Token validation failed:', error);
          removeTokenFromStorage();
          dispatch({ type: 'AUTH_FAILURE' });
        });
    } else {
      if (token) {
        // Token exists but is expired
        removeTokenFromStorage();
      }
      dispatch({ type: 'AUTH_FAILURE' });
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authApi.login({ email, password });
      setTokenInStorage(response.token);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authApi.register(userData);
      setTokenInStorage(response.token);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    removeTokenFromStorage();
    authApi.logout();
    dispatch({ type: 'LOGOUT' });
  };

  // Role-based utility functions
  const checkIsAdmin = (): boolean => {
    return isAdmin(state.user?.role);
  };

  const checkIsCustomer = (): boolean => {
    return isCustomer(state.user?.role);
  };

  const checkHasRole = (role: 'admin' | 'customer'): boolean => {
    return state.user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        isAdmin: checkIsAdmin,
        isCustomer: checkIsCustomer,
        hasRole: checkHasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
