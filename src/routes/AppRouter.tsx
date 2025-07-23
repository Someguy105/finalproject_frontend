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
import Register from '../pages/Register';
import { AuthTest } from '../components/auth/AuthTest';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminLogs from '../pages/admin/AdminLogs';
import AdminReviews from '../pages/admin/AdminReviews';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminDashboard from '../pages/admin/Dashboard';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import OrderDetail from '../pages/OrderDetail';
import UserReviews from '../pages/UserReviews';
import CustomerOrders from '../pages/CustomerOrders';

// Public Pages
// const ProductDetail = React.lazy(() => Promise.resolve({ default: () => <div>Product Detail</div> }));

// Checkout Pages (placeholders)
const Checkout = React.lazy(() => Promise.resolve({ default: () => <div>Checkout Page</div> }));

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
                        <AdminDashboard />
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
                    <Route path="/admin/users" element={
                      <ProtectedRoute adminOnly>
                        <AdminUsers />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/reviews" element={
                      <ProtectedRoute adminOnly>
                        <AdminReviews />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/logs" element={
                      <ProtectedRoute adminOnly>
                        <AdminLogs />
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
                        <CustomerOrders />
                      </ProtectedRoute>
                    } />
                    <Route path="/orders/:id" element={
                      <ProtectedRoute>
                        <OrderDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="/reviews" element={
                      <ProtectedRoute requiredRole="customer">
                        <UserReviews />
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
