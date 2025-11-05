const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// База данных в памяти
let books = [
  {
    id: '1',
    title: 'Война и мир',
    author: 'Лев Толстой',
    genre: 'Роман',
    year: 1869,
    isbn: '978-5-699-12014-7'
  },
  {
    id: '2',
    title: 'Преступление и наказание',
    author: 'Федор Достоевский',
    genre: 'Психологический роман',
    year: 1866,
    isbn: '978-5-17-090345-2'
  }
];

// Вспомогательные функции
const validateBook = (book, isUpdate = false) => {
  const errors = [];
  
  if (!isUpdate || book.title !== undefined) {
    if (!book.title || book.title.trim() === '') {
      errors.push('Название книги обязательно');
    }
  }
  
  if (!isUpdate || book.author !== undefined) {
    if (!book.author || book.author.trim() === '') {
      errors.push('Автор книги обязателен');
    }
  }
  
  if (book.isbn && !/^[0-9-]+$/.test(book.isbn)) {
    errors.push('ISBN должен содержать только цифры и дефисы');
  }
  
  if (book.year && (book.year < 0 || book.year > new Date().getFullYear())) {
    errors.push('Год издания указан некорректно');
  }
  
  return errors;
};

const isISBNUnique = (isbn, excludeId = null) => {
  return !books.some(book => 
    book.isbn === isbn && book.id !== excludeId
  );
};

const findBookById = (id) => {
  return books.find(book => book.id === id);
};

const handleError = (res, statusCode, message) => {
  console.error(`Error ${statusCode}: ${message}`);
  res.status(statusCode).json({
    error: true,
    message: message,
    status: statusCode
  });
};

// ========== РЕАЛИЗАЦИЯ ENDPOINTS ==========

// ЗАДАНИЕ 2A: GET endpoints
app.get('/api/books', (req, res) => {
  try {
    let filteredBooks = [...books];
    
    // Фильтрация по query-параметрам
    const { author, genre, year, page = 1, limit = 10 } = req.query;
    
    if (author) {
      filteredBooks = filteredBooks.filter(book => 
        book.author.toLowerCase().includes(author.toLowerCase())
      );
    }
    
    if (genre) {
      filteredBooks = filteredBooks.filter(book => 
        book.genre.toLowerCase().includes(genre.toLowerCase())
      );
    }
    
    if (year) {
      filteredBooks = filteredBooks.filter(book => book.year == year);
    }
    
    // Пагинация
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
    
    res.json({
      data: paginatedBooks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredBooks.length,
        totalPages: Math.ceil(filteredBooks.length / limitNum)
      },
      filters: {
        author: author || null,
        genre: genre || null,
        year: year || null
      }
    });
    
  } catch (error) {
    handleError(res, 500, 'Внутренняя ошибка сервера');
  }
});

app.get('/api/books/:id', (req, res) => {
  try {
    const book = findBookById(req.params.id);
    
    if (!book) {
      return handleError(res, 404, 'Книга не найдена');
    }
    
    res.json({
      data: book
    });
    
  } catch (error) {
    handleError(res, 500, 'Внутренняя ошибка сервера');
  }
});

// ЗАДАНИЕ 2B: POST endpoint
app.post('/api/books', (req, res) => {
  try {
    const { title, author, genre, year, isbn } = req.body;
    
    // Валидация обязательных полей
    const validationErrors = validateBook({ title, author, genre, year, isbn });
    if (validationErrors.length > 0) {
      return handleError(res, 400, validationErrors.join(', '));
    }
    
    // Проверка уникальности ISBN
    if (isbn && !isISBNUnique(isbn)) {
      return handleError(res, 400, 'Книга с таким ISBN уже существует');
    }
    
    // Создание новой книги
    const newBook = {
      id: uuidv4(),
      title: title.trim(),
      author: author.trim(),
      genre: genre ? genre.trim() : null,
      year: year ? parseInt(year) : null,
      isbn: isbn || null
    };
    
    books.push(newBook);
    
    res.status(201).json({
      message: 'Книга успешно создана',
      data: newBook
    });
    
  } catch (error) {
    handleError(res, 500, 'Внутренняя ошибка сервера');
  }
});

// ЗАДАНИЕ 2C: PUT и PATCH endpoints
app.put('/api/books/:id', (req, res) => {
  try {
    const bookIndex = books.findIndex(book => book.id === req.params.id);
    
    if (bookIndex === -1) {
      return handleError(res, 404, 'Книга не найдена');
    }
    
    const { title, author, genre, year, isbn } = req.body;
    
    // Валидация всех обязательных полей для полного обновления
    const validationErrors = validateBook({ title, author, genre, year, isbn });
    if (validationErrors.length > 0) {
      return handleError(res, 400, validationErrors.join(', '));
    }
    
    // Проверка уникальности ISBN
    if (isbn && !isISBNUnique(isbn, req.params.id)) {
      return handleError(res, 400, 'Книга с таким ISBN уже существует');
    }
    
    // Полное обновление книги
    books[bookIndex] = {
      id: req.params.id,
      title: title.trim(),
      author: author.trim(),
      genre: genre ? genre.trim() : null,
      year: year ? parseInt(year) : null,
      isbn: isbn || null
    };
    
    res.json({
      message: 'Книга успешно обновлена',
      data: books[bookIndex]
    });
    
  } catch (error) {
    handleError(res, 500, 'Внутренняя ошибка сервера');
  }
});

app.patch('/api/books/:id', (req, res) => {
  try {
    const bookIndex = books.findIndex(book => book.id === req.params.id);
    
    if (bookIndex === -1) {
      return handleError(res, 404, 'Книга не найдена');
    }
    
    const { title, author, genre, year, isbn } = req.body;
    
    // Валидация только переданных полей
    const validationErrors = validateBook({ title, author, genre, year, isbn }, true);
    if (validationErrors.length > 0) {
      return handleError(res, 400, validationErrors.join(', '));
    }
    
    // Проверка уникальности ISBN если он передается
    if (isbn && !isISBNUnique(isbn, req.params.id)) {
      return handleError(res, 400, 'Книга с таким ISBN уже существует');
    }
    
    // Частичное обновление только переданных полей
    const updatedBook = {
      ...books[bookIndex],
      ...(title && { title: title.trim() }),
      ...(author && { author: author.trim() }),
      ...(genre !== undefined && { genre: genre ? genre.trim() : null }),
      ...(year !== undefined && { year: year ? parseInt(year) : null }),
      ...(isbn !== undefined && { isbn: isbn || null })
    };
    
    books[bookIndex] = updatedBook;
    
    res.json({
      message: 'Книга успешно обновлена',
      data: updatedBook
    });
    
  } catch (error) {
    handleError(res, 500, 'Внутренняя ошибка сервера');
  }
});

// ЗАДАНИЕ 2D: DELETE endpoint
app.delete('/api/books/:id', (req, res) => {
  try {
    const bookIndex = books.findIndex(book => book.id === req.params.id);
    
    if (bookIndex === -1) {
      return handleError(res, 404, 'Книга не найдена');
    }
    
    const deletedBook = books[bookIndex];
    books.splice(bookIndex, 1);
    
    res.json({
      message: 'Книга успешно удалена',
      data: deletedBook
    });
    
  } catch (error) {
    handleError(res, 500, 'Внутренняя ошибка сервера');
  }
});

// Обработка несуществующих маршрутов
app.use('*', (req, res) => {
  handleError(res, 404, 'Маршрут не найден');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`API доступно по адресу: http://localhost:${PORT}/api/books`);
});