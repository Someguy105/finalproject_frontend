import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Rating,
  TextField,
  Button,
  Box,
  Stack,
  Alert,
  FormHelperText,
  Divider,
} from '@mui/material';
import { StarOutlineOutlined, StarOutlined, SaveOutlined, CancelOutlined } from '@mui/icons-material';
import { reviewApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { Review } from '../types';

interface ReviewFormProps {
  productId: string;
  existingReview?: Review;
  onReviewSubmitted: () => void;
  onCancel: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  existingReview,
  onReviewSubmitted,
  onCancel,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(existingReview?.rating || 5);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (rating === 0) {
      setError('Por favor selecciona una calificación');
      return false;
    }
    if (title.trim().length < 3) {
      setError('El título debe tener al menos 3 caracteres');
      return false;
    }
    if (comment.trim().length < 10) {
      setError('La reseña debe tener al menos 10 caracteres');
      return false;
    }
    if (comment.trim().length > 1000) {
      setError('La reseña debe tener menos de 1000 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    if (!user) {
      setError('You must be logged in to write a review');
      return;
    }

    try {
      setSubmitting(true);
      
      if (existingReview) {
        // Update existing review
        await reviewApi.updateReview(existingReview.id, {
          rating,
          title: title.trim(),
          comment: comment.trim(),
        });
      } else {
        // Create new review
        await reviewApi.createReview({
          productId: parseInt(productId),
          userId: user.id,
          rating,
          title: title.trim(),
          comment: comment.trim(),
          isVerified: false, // This could be set based on purchase history
        });
      }

      onReviewSubmitted();
      
      // Reset form only if creating new review
      if (!existingReview) {
        setRating(5);
        setTitle('');
        setComment('');
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${existingReview ? 'update' : 'submit'} review. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const ratingLabels: { [index: string]: string } = {
    1: 'Terrible',
    2: 'Deficiente',
    3: 'Regular',
    4: 'Bueno',
    5: 'Excelente',
  };

  return (
    <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
        {existingReview ? 'Editar mi reseña' : 'Escribir una reseña'}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Rating */}
          <Box>
            <Typography variant="body1" gutterBottom fontWeight="medium">
              Calificación general *
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              gap: 2, 
              mb: 1 
            }}>
              <Rating
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue || 0);
                }}
                size="large"
                icon={<StarOutlined fontSize="inherit" sx={{ color: 'secondary.main' }} />}
                emptyIcon={<StarOutlineOutlined fontSize="inherit" />}
                sx={{ fontSize: '2rem' }}
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: rating >= 4 ? 'success.main' : 
                         rating >= 3 ? 'warning.main' : 
                         rating > 0 ? 'error.main' : 'text.secondary',
                  fontWeight: 'bold'
                }}
              >
                {rating > 0 ? ratingLabels[rating] : 'Sin calificar'}
              </Typography>
            </Box>
            <FormHelperText>
              Haz clic en las estrellas para calificar este producto
            </FormHelperText>
          </Box>

          {/* Review Title */}
          <TextField
            label="Título de la reseña"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            placeholder="Resume tu experiencia en pocas palabras"
            inputProps={{ maxLength: 100 }}
            helperText={`${title.length}/100 caracteres`}
            variant="outlined"
          />

          {/* Review Comment */}
          <TextField
            label="Tu reseña"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            required
            multiline
            rows={6}
            placeholder="Cuéntale a otros sobre tu experiencia con este producto. ¿Qué te gustó o no te gustó? ¿Cómo se compara con productos similares? Sé específico y honesto en tu valoración."
            inputProps={{ maxLength: 1000 }}
            helperText={`${comment.length}/1000 caracteres`}
            variant="outlined"
          />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={submitting}
              startIcon={<CancelOutlined />}
              color="inherit"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting || !rating || !title.trim() || !comment.trim()}
              startIcon={<SaveOutlined />}
              sx={{ px: 3 }}
            >
              {submitting 
                ? `${existingReview ? 'Actualizando' : 'Enviando'}...` 
                : `${existingReview ? 'Actualizar' : 'Enviar'} reseña`}
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};

export default ReviewForm;
