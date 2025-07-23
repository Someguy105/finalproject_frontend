import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  Box,
  Chip,
  Divider,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Stack,
} from '@mui/material';
import {
  ArrowBackOutlined,
  CheckCircleOutlined,
  LocalShippingOutlined,
  PendingOutlined,
  LocationOnOutlined,
  PaymentOutlined,
  ShoppingBagOutlined,
} from '@mui/icons-material';
import { orderApi } from '../api';
import { formatCurrency } from '../utils';
import { useAuth } from '../contexts/AuthContext';

interface BackendOrder {
  id: number;
  userId: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
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

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<BackendOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrder = async () => {
      if (!id) return;
      
      try {
        const orderData = await orderApi.getOrder(id);
        setOrder(orderData);
      } catch (err: any) {
        setError(err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated, navigate]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircleOutlined color="success" />;
      case 'shipped':
        return <LocalShippingOutlined color="info" />;
      case 'processing':
        return <PendingOutlined color="warning" />;
      default:
        return <PendingOutlined />;
    }
  };

  const getStatusColor = (status: string): 'success' | 'info' | 'warning' | 'default' => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading order details...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button onClick={() => navigate('/orders')} startIcon={<ArrowBackOutlined />}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="warning" sx={{ mb: 4 }}>
          Order not found
        </Alert>
        <Button onClick={() => navigate('/orders')} startIcon={<ArrowBackOutlined />}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button 
          onClick={() => navigate('/orders')} 
          startIcon={<ArrowBackOutlined />}
          sx={{ mb: 2 }}
        >
          Back to Orders
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Order #{order.orderNumber}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {getStatusIcon(order.status)}
          <Chip 
            label={order.status.toUpperCase()} 
            color={getStatusColor(order.status)}
            variant="outlined" 
          />
          <Chip 
            label={`Payment: ${order.paymentStatus.toUpperCase()}`} 
            color={order.paymentStatus === 'completed' ? 'success' : 'warning'}
            variant="outlined" 
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
        {/* Order Items */}
        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <ShoppingBagOutlined color="primary" />
            <Typography variant="h6">
              Order Items
            </Typography>
          </Box>
          
          {order.orderItems && order.orderItems.length > 0 ? (
            <Stack spacing={3}>
              {order.orderItems.map((item: any, index: number) => (
                <Card key={index} variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    {/* Product Image */}
                    {(item.product?.images?.[0] || item.productSnapshot?.image) && (
                      <Box
                        component="img"
                        src={item.product?.images?.[0] || item.productSnapshot?.image}
                        alt={item.product?.name || item.productSnapshot?.name || 'Product'}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'grey.300'
                        }}
                      />
                    )}
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {item.product?.name || item.productSnapshot?.name || `Product #${item.productId}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {item.product?.description || item.productSnapshot?.description || 'No description available'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Unit Price: {formatCurrency(item.unitPrice)}
                      </Typography>
                      <Chip 
                        label={`Qty: ${item.quantity}`} 
                        size="small" 
                        variant="outlined" 
                        color="primary"
                      />
                    </Box>
                    
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        {formatCurrency(item.totalPrice)}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Stack>
          ) : (
            <Alert severity="info">
              No items found for this order
            </Alert>
          )}
        </Card>

        {/* Order Summary */}
        <Box>
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
            <Typography variant="h6" gutterBottom color="primary.main" fontWeight="bold">
              Order Summary
            </Typography>
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography fontWeight="500">{formatCurrency(order.subtotal)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                <Typography>Tax</Typography>
                <Typography fontWeight="500">{formatCurrency(order.taxAmount)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                <Typography>Shipping</Typography>
                <Typography fontWeight="500">{formatCurrency(order.shippingAmount)}</Typography>
              </Box>
              
              {order.discountAmount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main', p: 1 }}>
                  <Typography>Discount</Typography>
                  <Typography fontWeight="500">-{formatCurrency(order.discountAmount)}</Typography>
                </Box>
              )}
              
              <Divider />
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                p: 2, 
                bgcolor: 'primary.main', 
                color: 'white', 
                borderRadius: 1,
                mt: 1
              }}>
                <Typography variant="h6" fontWeight="bold">
                  Total
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {formatCurrency(order.totalAmount)} {order.currency}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Shipping Information */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationOnOutlined color="primary" />
              <Typography variant="h6">
                Shipping Information
              </Typography>
            </Box>
            
            {order.shippingAddress ? (
              <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  {order.shippingAddress.street}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </Typography>
                <Typography variant="body1" sx={{ mb: 0, color: 'text.secondary' }}>
                  {order.shippingAddress.country}
                </Typography>
              </Box>
            ) : (
              <Alert severity="warning" variant="outlined">
                No shipping address provided
              </Alert>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PaymentOutlined color="primary" />
              <Typography variant="body1" fontWeight="500">
                Payment Details
              </Typography>
            </Box>
            
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Method:</strong> {order.paymentMethod.replace('_', ' ').toUpperCase()}
              </Typography>
              
              {order.trackingNumber && (
                <Typography variant="body2">
                  <strong>Tracking Number:</strong> {order.trackingNumber}
                </Typography>
              )}
            </Box>
          </Paper>

          {/* Notes */}
          {order.notes && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notes
              </Typography>
              <Typography variant="body2">
                {order.notes}
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default OrderDetail;
