import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, CircularProgress, Alert, Grid } from '@mui/material';
import { itemService } from '../services/api';
import ItemList from '../components/ItemList';
import ItemForm from '../components/ItemForm';

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemService.getAllItems();
      setItems(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load items. Please try again later.');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (itemData) => {
    try {
      const response = await itemService.createItem(itemData);
      setItems([...items, response.data]);
      setShowForm(false);
      return { success: true };
    } catch (err) {
      console.error('Error creating item:', err);
      return { success: false, message: 'Failed to create item' };
    }
  };

  const handleUpdateItem = async (id, itemData) => {
    try {
      const response = await itemService.updateItem(id, itemData);
      setItems(items.map(item => item._id === id ? response.data : item));
      setEditingItem(null);
      return { success: true };
    } catch (err) {
      console.error('Error updating item:', err);
      return { success: false, message: 'Failed to update item' };
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await itemService.deleteItem(id);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        YourApp - An app to CRUD
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
        <Grid item>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              setShowForm(true);
              setEditingItem(null);
            }}
          >
            Add New Item
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="outlined" 
            onClick={fetchItems}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Refresh Items'}
          </Button>
        </Grid>
      </Grid>

      {showForm && (
        <ItemForm 
          onSubmit={editingItem ? (data) => handleUpdateItem(editingItem._id, data) : handleCreateItem}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          initialValues={editingItem || null}
        />
      )}

      <ItemList 
        items={items} 
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteItem}
      />
    </Container>
  );
};

export default HomePage;