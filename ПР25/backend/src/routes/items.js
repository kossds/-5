const express = require('express');

module.exports = (Item) => {
  const router = express.Router();

  // Get all items
  router.get('/', async (req, res) => {
    try {
      const items = await Item.findAll({
        order: [['createdAt', 'DESC']]
      });
      res.json(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Create new item
  router.post('/', async (req, res) => {
    try {
      const { name, description, price } = req.body;
      
      if (!name || typeof price !== 'number' || price < 0) {
        return res.status(400).json({ 
          message: 'Invalid data: name and valid price required' 
        });
      }

      const newItem = await Item.create({
        name,
        description: description || '',
        price
      });

      res.status(201).json(newItem);
    } catch (error) {
      console.error('Error creating item:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get single item
  router.get('/:id', async (req, res) => {
    try {
      const item = await Item.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error fetching item:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Update item
  router.put('/:id', async (req, res) => {
    try {
      const { name, description, price } = req.body;
      const item = await Item.findByPk(req.params.id);
      
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      
      if (name !== undefined) item.name = name;
      if (description !== undefined) item.description = description;
      if (price !== undefined && typeof price === 'number' && price >= 0) {
        item.price = price;
      }

      await item.save();
      res.json(item);
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Delete item
  router.delete('/:id', async (req, res) => {
    try {
      const item = await Item.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      
      await item.destroy();
      res.json({ message: 'Item deleted successfully', id: req.params.id });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};