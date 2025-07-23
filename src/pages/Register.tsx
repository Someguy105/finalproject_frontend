import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Stack,
  Divider,
} from '@mui/material';
import { PersonAddOutlined, LoginOutlined } from '@mui/icons-material';
import { t } from '../utils';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    
    if (!firstName.trim()) {
      return 'First name is required';
    }
    
    if (!lastName.trim()) {
      return 'Last name is required';
    }
    
    if (!email.trim()) {
      return 'Email is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    if (!password) {
      return 'Password is required';
    }
    
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || t('registrationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const fillSampleData = () => {
    setFormData({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PersonAddOutlined sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
            <Typography component="h1" variant="h4" fontWeight="bold">
              {t('createAccount')}
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {t('joinCommunity')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label={t('firstName')}
                  name="firstName"
                  autoComplete="given-name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label={t('lastName')}
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Stack>

              <TextField
                required
                fullWidth
                id="email"
                label={t('emailAddress')}
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
              />

              <TextField
                required
                fullWidth
                name="password"
                label={t('password')}
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                helperText="La contraseña debe tener al menos 8 caracteres"
              />

              <TextField
                required
                fullWidth
                name="confirmPassword"
                label={t('confirmPassword')}
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                variant="outlined"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  mt: 3,
                }}
              >
                {isLoading ? 'Creando Cuenta...' : t('createAccount')}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ width: '100%', my: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {t('alreadyHaveAccount')}
            </Typography>
          </Divider>

          <Button
            component={Link}
            to="/login"
            fullWidth
            variant="outlined"
            startIcon={<LoginOutlined />}
            sx={{ py: 1.5 }}
          >
            {t('signInInstead')}
          </Button>

          <Divider sx={{ width: '100%', my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {t('quickFill')}
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="text"
            onClick={fillSampleData}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            {t('fillSampleData')}
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            {t('agreeToTerms')}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
