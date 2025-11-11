import React, { useState } from 'react';
import { Box, TextField, Button, Grid, Typography, Alert } from '@mui/material';

const ItemForm = ({ onSubmit, onCancel, initialValues = null }) => {
  const [formData, setFormData] = useState({
    name: initialValues?.name || '',
    description: initialValues?.description || '',
    price: initialValues?.price || ''
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      setError('Valid price is required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price)
      });

      if (result.success) {
        setFormData({ name: '', description: '', price: '' });
      } else {
        setError(result.message || 'Failed to save item');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Form submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        {initialValues ? 'Edit Item' : 'Add New Item'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            disabled={submitting}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            disabled={submitting}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (initialValues ? 'Update Item' : 'Add Item')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItemForm;