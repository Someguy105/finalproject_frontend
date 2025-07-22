import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider
} from '@mui/material';
import {
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';

export const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 4 }}>
          {/* Company Info */}
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              E-SHOP
            </Typography>
            <Typography variant="body2" color="grey.300">
              Your one-stop destination for quality products at great prices.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link component={RouterLink} to="/" color="grey.300" underline="hover" variant="body2">
                Home
              </Link>
              <Link component={RouterLink} to="/products" color="grey.300" underline="hover" variant="body2">
                Products
              </Link>
              <Link component={RouterLink} to="/about" color="grey.300" underline="hover" variant="body2">
                About Us
              </Link>
              <Link component={RouterLink} to="/contact" color="grey.300" underline="hover" variant="body2">
                Contact
              </Link>
            </Box>
          </Box>

          {/* Customer Service */}
          <Box>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Customer Service
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/help" color="grey.300" underline="hover" variant="body2">
                Help Center
              </Link>
              <Link href="/returns" color="grey.300" underline="hover" variant="body2">
                Returns
              </Link>
              <Link href="/shipping" color="grey.300" underline="hover" variant="body2">
                Shipping Info
              </Link>
              <Link href="/track" color="grey.300" underline="hover" variant="body2">
                Track Order
              </Link>
            </Box>
          </Box>

          {/* Connect */}
          <Box>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                href="#"
                sx={{
                  color: 'grey.300',
                  '&:hover': {
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
                size="small"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                href="#"
                sx={{
                  color: 'grey.300',
                  '&:hover': {
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
                size="small"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                href="#"
                sx={{
                  color: 'grey.300',
                  '&:hover': {
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
                size="small"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                href="#"
                sx={{
                  color: 'grey.300',
                  '&:hover': {
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
                size="small"
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'grey.700' }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="grey.300">
            © 2025 E-Shop. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
