import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Cancel,
  FilterList
} from '@mui/icons-material';
import { t } from '../../utils';

interface Review {
  id: number;
  rating: number;
  comment: string;
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  product: {
    id: number;
    name: string;
    image?: string;
  };
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  moderatedBy?: string;
  moderatedAt?: string;
}

const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      rating: 5,
      comment: 'Excellent gaming laptop! High performance and great build quality. Perfect for both gaming and work.',
      user: {
        id: 1,
        name: 'Tech Customer',
        email: 'customer1@example.com'
      },
      product: {
        id: 1,
        name: 'Gaming Laptop Pro'
      },
      createdAt: '2025-01-20',
      status: 'approved',
      moderatedBy: 'admin@example.com',
      moderatedAt: '2025-01-20'
    },
    {
      id: 2,
      rating: 4,
      comment: 'Great sound quality and comfortable to wear. Battery life is impressive as advertised.',
      user: {
        id: 2,
        name: 'Fashion Customer',
        email: 'customer2@example.com'
      },
      product: {
        id: 2,
        name: 'Premium Wireless Headphones'
      },
      createdAt: '2025-01-19',
      status: 'approved',
      moderatedBy: 'admin@example.com',
      moderatedAt: '2025-01-19'
    },
    {
      id: 3,
      rating: 5,
      comment: 'Perfect winter jacket! Warm, waterproof, and stylish. Highly recommended for cold weather.',
      user: {
        id: 3,
        name: 'Outdoor Customer',
        email: 'customer3@example.com'
      },
      product: {
        id: 3,
        name: 'Designer Winter Jacket'
      },
      createdAt: '2025-01-18',
      status: 'pending'
    },
    {
      id: 4,
      rating: 5,
      comment: 'Comprehensive programming guide! Well structured and up-to-date with modern practices.',
      user: {
        id: 1,
        name: 'Tech Customer',
        email: 'customer1@example.com'
      },
      product: {
        id: 4,
        name: 'Programming Complete Guide'
      },
      createdAt: '2025-01-17',
      status: 'approved',
      moderatedBy: 'admin@example.com',
      moderatedAt: '2025-01-17'
    }
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    return matchesSearch && matchesStatus && matchesRating;
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setOpenDialog(true);
  };

  const handleApproveReview = (reviewId: number) => {
    setReviews(reviews.map(review =>
      review.id === reviewId
        ? { ...review, status: 'approved', moderatedBy: 'admin@email.com', moderatedAt: new Date().toISOString().split('T')[0] }
        : review
    ));
    setSnackbar({ open: true, message: 'Reseña aprobada exitosamente', severity: 'success' });
  };

  const handleRejectReview = (reviewId: number) => {
    setReviews(reviews.map(review =>
      review.id === reviewId
        ? { ...review, status: 'rejected', moderatedBy: 'admin@email.com', moderatedAt: new Date().toISOString().split('T')[0] }
        : review
    ));
    setSnackbar({ open: true, message: 'Reseña rechazada exitosamente', severity: 'success' });
  };

  const handleDeleteReview = (reviewId: number) => {
    if (window.confirm(t('confirmDelete'))) {
      setReviews(reviews.filter(review => review.id !== reviewId));
      setSnackbar({ open: true, message: t('itemDeleted'), severity: 'success' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprobada';
      case 'rejected': return 'Rechazada';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
        {t('manageReviews')}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="pending">Pendiente</MenuItem>
              <MenuItem value="approved">Aprobada</MenuItem>
              <MenuItem value="rejected">Rechazada</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Calificación</InputLabel>
            <Select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value="5">5 estrellas</MenuItem>
              <MenuItem value="4">4 estrellas</MenuItem>
              <MenuItem value="3">3 estrellas</MenuItem>
              <MenuItem value="2">2 estrellas</MenuItem>
              <MenuItem value="1">1 estrella</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{t('reviewUser')}</TableCell>
              <TableCell>{t('reviewProduct')}</TableCell>
              <TableCell>{t('reviewRating')}</TableCell>
              <TableCell>{t('reviewComment')}</TableCell>
              <TableCell>{t('reviewDate')}</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {review.user.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {review.user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {review.user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{review.product.name}</TableCell>
                  <TableCell>
                    <Rating value={review.rating} readOnly size="small" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography noWrap>
                      {review.comment}
                    </Typography>
                  </TableCell>
                  <TableCell>{review.createdAt}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(review.status)}
                      color={getStatusColor(review.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => handleViewReview(review)} size="small">
                        <Visibility />
                      </IconButton>
                      {review.status === 'pending' && (
                        <>
                          <IconButton 
                            onClick={() => handleApproveReview(review.id)} 
                            size="small" 
                            color="success"
                          >
                            <CheckCircle />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleRejectReview(review.id)} 
                            size="small" 
                            color="error"
                          >
                            <Cancel />
                          </IconButton>
                        </>
                      )}
                      <IconButton 
                        onClick={() => handleDeleteReview(review.id)} 
                        size="small" 
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredReviews.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Review Detail Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalles de la Reseña #{selectedReview?.id}
        </DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Usuario:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 40, height: 40 }}>
                    {selectedReview.user.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedReview.user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedReview.user.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Producto:
                </Typography>
                <Typography variant="body1">
                  {selectedReview.product.name}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Calificación:
                </Typography>
                <Rating value={selectedReview.rating} readOnly />
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Comentario:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body1">
                    {selectedReview.comment}
                  </Typography>
                </Paper>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Fecha de Creación:
                </Typography>
                <Typography variant="body1">
                  {selectedReview.createdAt}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Estado:
                </Typography>
                <Chip
                  label={getStatusText(selectedReview.status)}
                  color={getStatusColor(selectedReview.status) as any}
                />
              </Box>

              {selectedReview.moderatedBy && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Moderado por:
                  </Typography>
                  <Typography variant="body1">
                    {selectedReview.moderatedBy} el {selectedReview.moderatedAt}
                  </Typography>
                </Box>
              )}

              {selectedReview.status === 'pending' && (
                <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() => {
                      handleApproveReview(selectedReview.id);
                      setOpenDialog(false);
                    }}
                  >
                    Aprobar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={() => {
                      handleRejectReview(selectedReview.id);
                      setOpenDialog(false);
                    }}
                  >
                    Rechazar
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminReviews;
