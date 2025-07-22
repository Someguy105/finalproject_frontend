import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Stack,
  Chip,
  Paper,
  Avatar,
} from '@mui/material';
import {
  ShoppingCartOutlined,
  StarOutlined,
  LocalShippingOutlined,
  SecurityOutlined,
  SupportAgentOutlined,
  ArrowForwardOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <LocalShippingOutlined />,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50',
    },
    {
      icon: <SecurityOutlined />,
      title: 'Secure Payment',
      description: '100% secure payment processing',
    },
    {
      icon: <SupportAgentOutlined />,
      title: '24/7 Support',
      description: 'Round the clock customer support',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Amazing products and fast delivery!',
      avatar: 'SJ',
    },
    {
      name: 'Mike Chen',
      rating: 5,
      comment: 'Great customer service and quality items.',
      avatar: 'MC',
    },
    {
      name: 'Emma Davis',
      rating: 5,
      comment: 'Love shopping here, highly recommend!',
      avatar: 'ED',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(45deg, #3b82f6 30%, #60a5fa 90%)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  mb: 3,
                }}
              >
                Welcome to Our Store
              </Typography>
              <Typography
                variant="h5"
                component="p"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                }}
              >
                Discover amazing products with unbeatable prices and quality.
                Your satisfaction is our priority.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ShoppingCartOutlined />}
                  onClick={() => navigate('/products')}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    py: 1.5,
                    px: 3,
                    fontSize: '1.1rem',
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  endIcon={<ArrowForwardOutlined />}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    py: 1.5,
                    px: 3,
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Box>
            <Box sx={{ flex: 1, width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: { xs: 300, md: 400 },
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography variant="h4" sx={{ opacity: 0.7 }}>
                  🛍️ Hero Image Placeholder
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Why Choose Us
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {features.map((feature, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                p: 4,
                textAlign: 'center',
                height: '100%',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 4,
                },
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: '50%',
                  mb: 2,
                }}
              >
                {React.cloneElement(feature.icon, { fontSize: 'large' })}
              </Box>
              <Typography variant="h5" component="h3" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            What Our Customers Say
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h4">
                        {testimonial.name}
                      </Typography>
                      <Box sx={{ display: 'flex' }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <StarOutlined
                            key={i}
                            sx={{ color: 'orange', fontSize: 20 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    "{testimonial.comment}"
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'secondary.main',
          color: 'white',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to Start Shopping?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of satisfied customers and discover amazing deals today.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Chip
              label="Free Returns"
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
            />
            <Chip
              label="Money Back Guarantee"
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
            />
            <Chip
              label="Fast Shipping"
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
            />
          </Stack>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ShoppingCartOutlined />}
              onClick={() => navigate('/products')}
              sx={{
                bgcolor: 'white',
                color: 'secondary.main',
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Start Shopping Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
