import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  Divider,
  InputAdornment,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  ShoppingBagOutlined,
  SearchOutlined,
  FilterListOutlined,
  LocalShippingOutlined,
  CheckCircleOutlined,
  PendingOutlined,
  CancelOutlined,
  RefreshOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import { useMyOrders } from '../hooks/useOrders';
import { formatCurrency } from '../utils';
import { OrderStatus } from '../types';

const CustomerOrders: React.FC = () => {
  const { orders, loading, error, refetch } = useMyOrders();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Filter and sort orders
  const filteredOrders = React.useMemo(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort orders
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'amount-high':
        filtered.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case 'amount-low':
        filtered.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      default:
        break;
    }

    return filtered;
  }, [orders, searchTerm, statusFilter, sortBy]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleOutlined color="success" />;
      case 'shipped':
        return <LocalShippingOutlined color="info" />;
      case 'processing':
        return <PendingOutlined color="warning" />;
      case 'cancelled':
        return <CancelOutlined color="error" />;
      default:
        return <PendingOutlined />;
    }
  };

  const getStatusColor = (status: OrderStatus): 'success' | 'info' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderSummary = () => {
    if (orders.length === 0) return null;

    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
    const pendingOrders = orders.filter(order => ['pending', 'processing'].includes(order.status)).length;

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h4" fontWeight="bold">
            {orders.length}
          </Typography>
          <Typography variant="body2">Total Orders</Typography>
        </Paper>
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
          <Typography variant="h4" fontWeight="bold">
            {formatCurrency(totalSpent)}
          </Typography>
          <Typography variant="body2">Total Spent</Typography>
        </Paper>
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'info.main', color: 'white' }}>
          <Typography variant="h4" fontWeight="bold">
            {deliveredOrders}
          </Typography>
          <Typography variant="body2">Delivered Orders</Typography>
        </Paper>
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your orders...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 4 }}
          action={
            <Button color="inherit" size="small" onClick={refetch} startIcon={<RefreshOutlined />}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
          My Orders
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track and manage your order history
        </Typography>
      </Box>

      {orders.length > 0 && getOrderSummary()}

      {/* Filters and Search */}
      {orders.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
            />
            
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort by"
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="amount-high">Amount (High to Low)</MenuItem>
                <MenuItem value="amount-low">Amount (Low to High)</MenuItem>
              </Select>
            </FormControl>

            <Button
              startIcon={<RefreshOutlined />}
              onClick={refetch}
              variant="outlined"
            >
              Refresh
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <ShoppingBagOutlined sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            {orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {orders.length === 0 
              ? 'Start shopping to see your orders here!'
              : 'Try adjusting your search or filter criteria.'
            }
          </Typography>
          {orders.length === 0 && (
            <Button 
              variant="contained" 
              size="large"
              component={Link}
              to="/products"
            >
              Start Shopping
            </Button>
          )}
        </Paper>
      ) : (
        <Stack spacing={3}>
          {filteredOrders.map((order) => (
            <Card key={order.id} sx={{ '&:hover': { boxShadow: 4 }, transition: 'box-shadow 0.2s' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: 'repeat(2, 1fr)', 
                    md: '2fr 1fr 1fr 1fr 2fr' 
                  }, 
                  gap: 3, 
                  alignItems: 'center' 
                }}>
                  {/* Order Info */}
                  <Box>
                    <Stack spacing={1}>
                      <Typography variant="h6" fontWeight="bold">
                        #{order.orderNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Order ID: {order.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(order.createdAt)}
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Status */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {getStatusIcon(order.status)}
                      <Chip 
                        label={order.status.charAt(0).toUpperCase() + order.status.slice(1)} 
                        color={getStatusColor(order.status)}
                        variant="outlined"
                      />
                    </Stack>
                  </Box>

                  {/* Amount */}
                  <Box>
                    <Stack spacing={0.5}>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {formatCurrency(order.totalAmount)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.currency.toUpperCase()}
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Payment Status */}
                  <Box>
                    <Chip 
                      label={order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)} 
                      color={order.paymentStatus === 'completed' ? 'success' : 'warning'}
                      variant="filled"
                      size="small"
                    />
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityOutlined />}
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        View Details
                      </Button>
                      
                      {order.status === 'delivered' && (
                        <Button
                          variant="text"
                          size="small"
                          component={Link}
                          to="/reviews"
                          sx={{ minWidth: 'auto' }}
                        >
                          Review
                        </Button>
                      )}
                    </Stack>
                  </Box>
                </Box>

                {/* Order summary line */}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Payment: {order.paymentMethod?.replace('_', ' ').toUpperCase() || 'N/A'}
                  </Typography>
                  {order.shippingAddress && (
                    <Typography variant="body2" color="text.secondary">
                      Shipping to: {order.shippingAddress.city}, {order.shippingAddress.state}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Quick Actions */}
      {orders.length > 0 && (
        <Paper sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              startIcon={<ShoppingBagOutlined />}
            >
              Continue Shopping
            </Button>
            <Button
              component={Link}
              to="/reviews"
              variant="outlined"
              startIcon={<CheckCircleOutlined />}
            >
              Leave Reviews
            </Button>
          </Stack>
        </Paper>
      )}
    </Container>
  );
};

export default CustomerOrders;
