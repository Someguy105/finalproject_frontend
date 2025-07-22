import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from '../theme';
import { AuthProvider, CartProvider } from '../contexts';
import { Header, Footer } from '../components/shared';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { Unauthorized } from '../pages/Unauthorized';
import Login from '../pages/Login';
import { AuthTest } from '../components/auth/AuthTest';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import Home from '../pages/Home';
import Products from '../pages/Products';

// Public Pages
const ProductDetail = React.lazy(() => Promise.resolve({ default: () => <div>Product Detail</div> }));

// Auth Pages
const Register = React.lazy(() => Promise.resolve({ default: () => <div>Register Page</div> }));

// Cart and Checkout Pages (placeholders)
const Cart = React.lazy(() => Promise.resolve({ default: () => <div>Cart Page</div> }));
const Checkout = React.lazy(() => Promise.resolve({ default: () => <div>Checkout Page</div> }));

// Admin Pages
const Dashboard = React.lazy(() => Promise.resolve({ default: () => <div>Admin Dashboard</div> }));
const AdminCategories = React.lazy(() => Promise.resolve({ default: () => <div>Admin Categories</div> }));

export const AppRouter: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <React.Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div>Loading...</div>
                  </div>
                }>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/auth-test" element={<AuthTest />} />
                    
                    {/* Cart Routes */}
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute adminOnly>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/products" element={
                      <ProtectedRoute adminOnly>
                        <AdminProducts />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/orders" element={
                      <ProtectedRoute adminOnly>
                        <AdminOrders />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/categories" element={
                      <ProtectedRoute adminOnly>
                        <AdminCategories />
                      </ProtectedRoute>
                    } />
                    
                    {/* Customer Only Routes */}
                    <Route path="/profile" element={
                      <ProtectedRoute requiredRole="customer">
                        <div>Customer Profile</div>
                      </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                      <ProtectedRoute requiredRole="customer">
                        <div>Customer Orders</div>
                      </ProtectedRoute>
                    } />
                    
                    {/* 404 Route */}
                    <Route path="*" element={
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                          <p className="text-gray-600 mb-4">Page not found</p>
                          <a href="/" className="text-blue-600 hover:underline">Go back home</a>
                        </div>
                      </div>
                    } />
                  </Routes>
                </React.Suspense>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};
