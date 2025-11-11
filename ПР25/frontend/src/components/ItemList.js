import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Paper, Box, LinearProgress } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const ItemList = ({ items, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          No items found. Add your first item!
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <List>
        {items.map((item) => (
          <ListItem 
            key={item._id} 
            divider
            secondaryAction={
              <>
                <IconButton edge="end" onClick={() => onEdit(item)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => onDelete(item._id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={
                <Typography variant="h6">
                  {item.name}
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2" color="textSecondary">
                    {item.description || 'No description'}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                    Price: ${item.price.toFixed(2)}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ItemList;