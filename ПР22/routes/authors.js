const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /authors - Получить всех авторов
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const sql = 'SELECT * FROM authors LIMIT ? OFFSET ?';

  db.all(sql, [limit, offset], (err, rows) => {
    if (err) {
      console.error('Ошибка при получении авторов:', err);
      return res.status(500).json({
        success: false,
        message: 'Ошибка сервера при получении авторов'
      });
    }

    // Получаем общее количество
    db.get('SELECT COUNT(*) as total FROM authors', [], (err, countResult) => {
      if (err) {
        console.error('Ошибка при подсчете авторов:', err);
        return res.status(500).json({
          success: false,
          message: 'Ошибка сервера'
        });
      }

      res.json({
        success: true,
        data: {
          authors: rows,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(countResult.total / limit),
            totalItems: countResult.total,
            itemsPerPage: limit
          }
        }
      });
    });
  });
});

// GET /authors/:id - Получить автора с его книгами
router.get('/:id', (req, res) => {
  // Получаем автора
  db.get('SELECT * FROM authors WHERE id = ?', [req.params.id], (err, author) => {
    if (err) {
      console.error('Ошибка при получении автора:', err);
      return res.status(500).json({
        success: false,
        message: 'Ошибка сервера при получении автора'
      });
    }

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Автор не найден'
      });
    }

    // Получаем книги автора
    db.all(
      'SELECT books.*, categories.name as category_name FROM books LEFT JOIN categories ON books.category_id = categories.id WHERE author_id = ?',
      [req.params.id],
      (err, books) => {
        if (err) {
          console.error('Ошибка при получении книг автора:', err);
          return res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
          });
        }

        res.json({
          success: true,
          data: {
            ...author,
            books: books
          }
        });
      }
    );
  });
});

// POST /authors - Создать нового автора
router.post('/', (req, res) => {
  const { name, bio, birth_date } = req.body;

  // Валидация
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Имя автора обязательно для заполнения'
    });
  }

  const sql = 'INSERT INTO authors (name, bio, birth_date, created_at, updated_at) VALUES (?, ?, ?, datetime(\'now\'), datetime(\'now\'))';

  db.run(sql, [name, bio, birth_date], function(err) {
    if (err) {
      console.error('Ошибка при создании автора:', err);
      return res.status(500).json({
        success: false,
        message: 'Ошибка сервера при создании автора'
      });
    }

    // Получаем созданного автора
    db.get('SELECT * FROM authors WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('Ошибка при получении созданного автора:', err);
        return res.status(500).json({
          success: false,
          message: 'Автор создан, но произошла ошибка при получении данных'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Автор успешно создан',
        data: row
      });
    });
  });
});

module.exports = router;