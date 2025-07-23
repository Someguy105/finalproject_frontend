import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Button
} from '@mui/material';
import {
  ShoppingCart,
  People,
  Category,
  Assessment,
  TrendingUp,
  ShoppingBag,
  RateReview,
  Description,
  Visibility,
  MoreVert
} from '@mui/icons-material';
import { t } from '../../utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Box sx={{ color: `${color}.main` }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export const Dashboard: React.FC = () => {
  // Mock data - En producción esto vendría de la API
  const stats = {
    totalProducts: 4,
    totalOrders: 4,
    totalUsers: 6,
    totalRevenue: '$3,373'
  };

  const recentOrders = [
    { id: 'ORD-2025-001', customer: 'Tech Customer', total: '$2,799.97', status: 'delivered' },
    { id: 'ORD-2025-002', customer: 'Fashion Customer', total: '$215.18', status: 'shipped' },
    { id: 'ORD-2025-003', customer: 'Tech Customer', total: '$59.98', status: 'pending' },
    { id: 'ORD-2025-004', customer: 'Fashion Customer', total: '$298.99', status: 'processing' },
  ];

  const topProducts = [
    { name: 'Gaming Laptop Pro', sales: 1, revenue: '$2,499.99' },
    { name: 'Premium Wireless Headphones', sales: 2, revenue: '$599.98' },
    { name: 'Designer Winter Jacket', sales: 1, revenue: '$189.99' },
    { name: 'Programming Complete Guide', sales: 1, revenue: '$49.99' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'shipped': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return t('completed');
      case 'pending': return t('pending');
      case 'shipped': return t('shipped');
      case 'cancelled': return t('cancelled');
      default: return status;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
        {t('adminDashboard')}
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        {t('overview')}
      </Typography>

      {/* Statistics Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
        gap: 3, 
        mb: 4 
      }}>
        <StatCard
          title={t('totalProducts')}
          value={stats.totalProducts}
          icon={<ShoppingBag fontSize="large" />}
          color="primary"
        />
        <StatCard
          title={t('totalOrders')}
          value={stats.totalOrders}
          icon={<ShoppingCart fontSize="large" />}
          color="secondary"
        />
        <StatCard
          title={t('totalUsers')}
          value={stats.totalUsers}
          icon={<People fontSize="large" />}
          color="success"
        />
        <StatCard
          title={t('totalRevenue')}
          value={stats.totalRevenue}
          icon={<TrendingUp fontSize="large" />}
          color="warning"
        />
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
        gap: 3 
      }}>
        {/* Quick Actions */}
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {t('actions')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              component={Link}
              to="/admin/products"
              variant="outlined"
              startIcon={<ShoppingBag />}
              fullWidth
            >
              {t('manageProducts')}
            </Button>
            <Button
              component={Link}
              to="/admin/orders"
              variant="outlined"
              startIcon={<ShoppingCart />}
              fullWidth
            >
              {t('manageOrders')}
            </Button>
            <Button
              component={Link}
              to="/admin/categories"
              variant="outlined"
              startIcon={<Category />}
              fullWidth
            >
              {t('manageCategories')}
            </Button>
            <Button
              component={Link}
              to="/admin/users"
              variant="outlined"
              startIcon={<People />}
              fullWidth
            >
              {t('manageUsers')}
            </Button>
            <Button
              component={Link}
              to="/admin/reviews"
              variant="outlined"
              startIcon={<RateReview />}
              fullWidth
            >
              {t('manageReviews')}
            </Button>
            <Button
              component={Link}
              to="/admin/logs"
              variant="outlined"
              startIcon={<Description />}
              fullWidth
            >
              {t('manageLogs')}
            </Button>
          </Box>
        </Paper>

        {/* Recent Orders */}
        <Paper sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {t('recentOrders')}
            </Typography>
            <Button component={Link} to="/admin/orders" size="small">
              {t('view')} {t('details')}
            </Button>
          </Box>
          <List>
            {recentOrders.map((order, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight="medium">
                        {order.id}
                      </Typography>
                      <Chip
                        label={getStatusText(order.status)}
                        color={getStatusColor(order.status) as any}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {order.customer}
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" color="primary">
                        {order.total}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Top Products */}
        <Paper sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {t('topProducts')}
            </Typography>
            <Button component={Link} to="/admin/products" size="small">
              {t('view')} {t('details')}
            </Button>
          </Box>
          <List>
            {topProducts.map((product, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight="medium">
                      {product.name}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {product.sales} ventas
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" color="success.main">
                        {product.revenue}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
