import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
import { LoginOutlined, AdminPanelSettingsOutlined, PersonOutlined, PersonAddOutlined } from '@mui/icons-material';
import { t } from '../utils';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || t('loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const fillTestCredentials = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setEmail('admin@test.com');
      setPassword('admin123');
    } else {
      setEmail('customer@test.com');
      setPassword('customer123');
    }
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
            <LoginOutlined sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
            <Typography component="h1" variant="h4" fontWeight="bold">
              {t('signIn')}
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {t('signInToAccount')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Stack spacing={3}>
              <TextField
                required
                fullWidth
                id="email"
                label={t('emailAddress')}
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
              />

              <TextField
                required
                fullWidth
                name="password"
                label={t('password')}
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                }}
              >
                {isLoading ? 'Iniciando Sesión...' : t('signIn')}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ width: '100%', my: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {t('quickAccess')}
            </Typography>
          </Divider>

          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<AdminPanelSettingsOutlined />}
              onClick={() => fillTestCredentials('admin')}
              sx={{ py: 1 }}
            >
              {t('adminLogin')}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<PersonOutlined />}
              onClick={() => fillTestCredentials('customer')}
              sx={{ py: 1 }}
            >
              {t('customerLogin')}
            </Button>
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            Nota: Asegúrate de que estas cuentas de prueba existan en tu backend
          </Typography>

          <Divider sx={{ width: '100%', my: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {t('dontHaveAccount')}
            </Typography>
          </Divider>

          <Button
            component={Link}
            to="/register"
            fullWidth
            variant="outlined"
            color="secondary"
            startIcon={<PersonAddOutlined />}
            sx={{ py: 1.5 }}
          >
            {t('createNewAccount')}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
