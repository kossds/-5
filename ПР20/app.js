const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Импорт роутеров
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');

// Базовые middleware
app.use(express.json()); // для парсинга JSON
app.use(express.urlencoded({ extended: true })); // для парсинга form-data

// Логирование middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Основные маршруты
app.get('/', (req, res) => {
  res.json({
    message: 'Добро пожаловать в Express.js приложение!',
    endpoints: {
      users: '/api/users',
      products: '/api/products'
    }
  });
});

// Подключение модульных роутеров
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);

// Middleware для обработки 404 ошибок
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Маршрут не найден',
    path: req.path,
    method: req.method
  });
});

// Централизованная обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка:', err);
  res.status(500).json({
    error: 'Внутренняя ошибка сервера',
    message: err.message
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Доступно по адресу: http://localhost:${PORT}`);
});

module.exports = app;