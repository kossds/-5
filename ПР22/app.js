const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Импорты маршрутов
const booksRouter = require('./routes/books');
const authorsRouter = require('./routes/authors');

// Подключение маршрутов
app.use('/api/books', booksRouter);
app.use('/api/authors', authorsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Library API',
    database: 'SQLite'
  });
});

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({
    message: 'Добро пожаловать в Library API',
    version: '1.0.0',
    endpoints: {
      books: {
        'GET /api/books': 'Get all books',
        'GET /api/books/:id': 'Get book by ID',
        'POST /api/books': 'Create new book',
        'PUT /api/books/:id': 'Update book',
        'DELETE /api/books/:id': 'Delete book'
      },
      authors: {
        'GET /api/authors': 'Get all authors',
        'GET /api/authors/:id': 'Get author by ID',
        'POST /api/authors': 'Create new author'
      },
      health: 'GET /health'
    }
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📚 Library API доступен по адресу: http://localhost:${PORT}`);
  console.log('\n📖 Доступные endpoints:');
  console.log('   GET  /api/books     - список книг');
  console.log('   GET  /api/authors   - список авторов');
  console.log('   GET  /health        - проверка здоровья');
});

module.exports = app;