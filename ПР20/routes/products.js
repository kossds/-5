const express = require('express');
const router = express.Router();

// Временное хранилище данных
let products = [
  { id: 1, name: 'Ноутбук', price: 50000, category: 'Электроника', inStock: true },
  { id: 2, name: 'Смартфон', price: 30000, category: 'Электроника', inStock: true },
  { id: 3, name: 'Книга', price: 500, category: 'Книги', inStock: false },
  { id: 4, name: 'Наушники', price: 5000, category: 'Электроника', inStock: true }
];

let nextId = 5;

// Middleware для валидации цены
const validatePrice = (req, res, next) => {
  const { price } = req.body;
  if (price && (isNaN(price) || price < 0)) {
    return res.status(400).json({
      error: 'Цена должна быть положительным числом'
    });
  }
  next();
};

// GET /api/products - получить все товары с фильтрацией
router.get('/', (req, res) => {
  const { category, inStock, minPrice, maxPrice } = req.query;
  let filteredProducts = [...products];
  
  // Фильтрация по категории
  if (category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Фильтрация по наличию
  if (inStock !== undefined) {
    const stockFilter = inStock === 'true';
    filteredProducts = filteredProducts.filter(p => p.inStock === stockFilter);
  }
  
  // Фильтрация по цене
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  }
  
  res.json({
    products: filteredProducts,
    total: products.length,
    count: filteredProducts.length,
    filters: {
      category,
      inStock,
      minPrice,
      maxPrice
    }
  });
});

// GET /api/products/:id - получить товар по ID
router.get('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      error: 'Товар не найден',
      id: productId
    });
  }
  
  res.json(product);
});

// POST /api/products - создать новый товар
router.post('/', validatePrice, (req, res) => {
  const { name, price, category, inStock } = req.body;
  
  // Валидация
  if (!name || !price || !category) {
    return res.status(400).json({
      error: 'Обязательные поля: name, price, category'
    });
  }
  
  const newProduct = {
    id: nextId++,
    name,
    price: parseFloat(price),
    category,
    inStock: inStock !== undefined ? inStock : true
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    message: 'Товар успешно создан',
    product: newProduct
  });
});

// PUT /api/products/:id - обновить товар
router.put('/:id', validatePrice, (req, res) => {
  const productId = parseInt(req.params.id);
  const { name, price, category, inStock } = req.body;
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({
      error: 'Товар не найден',
      id: productId
    });
  }
  
  // Валидация
  if (!name || !price || !category) {
    return res.status(400).json({
      error: 'Обязательные поля: name, price, category'
    });
  }
  
  products[productIndex] = {
    ...products[productIndex],
    name,
    price: parseFloat(price),
    category,
    inStock: inStock !== undefined ? inStock : products[productIndex].inStock
  };
  
  res.json({
    message: 'Товар успешно обновлен',
    product: products[productIndex]
  });
});

// DELETE /api/products/:id - удалить товар
router.delete('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({
      error: 'Товар не найден',
      id: productId
    });
  }
  
  const deletedProduct = products.splice(productIndex, 1)[0];
  
  res.json({
    message: 'Товар успешно удален',
    product: deletedProduct
  });
});

module.exports = router;