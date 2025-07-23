import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon
} from '@mui/icons-material';
import { useAuth, useCart } from '../../contexts';
import { t } from '../../utils';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <StoreIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            E-TIENDA
          </Typography>

          <StoreIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            E-TIENDA
          </Typography>

          {/* Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{ my: 2, color: 'text.primary', display: 'block' }}
            >
              {t('home')}
            </Button>
            <Button
              component={RouterLink}
              to="/products"
              sx={{ my: 2, color: 'text.primary', display: 'block' }}
            >
              {t('products')}
            </Button>
            {isAuthenticated && user?.role === 'admin' && (
              <Button
                component={RouterLink}
                to="/admin"
                sx={{ my: 2, color: 'text.primary', display: 'block' }}
              >
                {t('admin')}
              </Button>
            )}
            {isAuthenticated && user?.role === 'customer' && (
              <>
                <Button
                  component={RouterLink}
                  to="/orders"
                  sx={{ my: 2, color: 'text.primary', display: 'block' }}
                >
                  {t('myOrders')}
                </Button>
                <Button
                  component={RouterLink}
                  to="/reviews"
                  sx={{ my: 2, color: 'text.primary', display: 'block' }}
                >
                  {t('myReviews')}
                </Button>
              </>
            )}
          </Box>

          {/* User Actions */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Cart */}
            <IconButton
              component={RouterLink}
              to="/cart"
              color="inherit"
            >
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* User Menu */}
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('hi')}, {user?.firstName}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  {t('logout')}
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button component={RouterLink} to="/login" color="inherit">
                  {t('login')}
                </Button>
                <Button component={RouterLink} to="/register" variant="contained">
                  {t('register')}
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
