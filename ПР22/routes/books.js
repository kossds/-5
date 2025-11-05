const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /books - Получить все книги с пагинацией
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  let sql = `
    SELECT books.*, authors.name as author_name, categories.name as category_name 
    FROM books 
    LEFT JOIN authors ON books.author_id = authors.id 
    LEFT JOIN categories ON books.category_id = categories.id
  `;
  
  const params = [];

  // Добавляем условия фильтрации если есть
  if (req.query.author_id) {
    sql += ' WHERE books.author_id = ?';
    params.push(req.query.author_id);
  }

  sql += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Ошибка при получении книг:', err);
      return res.status(500).json({
        success: false,
        message: 'Ошибка сервера при получении книг'
      });
    }

    // Получаем общее количество для пагинации
    let countSql = 'SELECT COUNT(*) as total FROM books';
    if (req.query.author_id) {
      countSql += ' WHERE author_id = ?';
    }

    db.get(countSql, req.query.author_id ? [req.query.author_id] : [], (err, countResult) => {
      if (err) {
        console.error('Ошибка при подсчете книг:', err);
        return res.status(500).json({
          success: false,
          message: 'Ошибка сервера'
        });
      }

      res.json({
        success: true,
        data: {
          books: rows,
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

// GET /books/:id - Получить книгу по ID
router.get('/:id', (req, res) => {
  const sql = `
    SELECT books.*, authors.name as author_name, categories.name as category_name 
    FROM books 
    LEFT JOIN authors ON books.author_id = authors.id 
    LEFT JOIN categories ON books.category_id = categories.id 
    WHERE books.id = ?
  `;

  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      console.error('Ошибка при получении книги:', err);
      return res.status(500).json({
        success: false,
        message: 'Ошибка сервера при получении книги'
      });
    }

    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Книга не найдена'
      });
    }

    res.json({
      success: true,
      data: row
    });
  });
});

// POST /books - Создать новую книгу
router.post('/', (req, res) => {
  const { title, isbn, description, published_year, author_id, category_id } = req.body;

  // Валидация
  if (!title || !author_id) {
    return res.status(400).json({
      success: false,
      message: 'Название книги и автор обязательны для заполнения'
    });
  }

  const sql = `
    INSERT INTO books (title, isbn, description, published_year, author_id, category_id, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `;

  db.run(sql, [title, isbn, description, published_year, author_id, category_id], function(err) {
    if (err) {
      console.error('Ошибка при создании книги:', err);
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({
          success: false,
          message: 'Книга с таким ISBN уже существует'
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Ошибка сервера при создании книги'
      });
    }

    // Получаем созданную книгу
    db.get(
      'SELECT books.*, authors.name as author_name, categories.name as category_name FROM books LEFT JOIN authors ON books.author_id = authors.id LEFT JOIN categories ON books.category_id = categories.id WHERE books.id = ?',
      [this.lastID],
      (err, row) => {
        if (err) {
          console.error('Ошибка при получении созданной книги:', err);
          return res.status(500).json({
            success: false,
            message: 'Книга создана, но произошла ошибка при получении данных'
          });
        }

        res.status(201).json({
          success: true,
          message: 'Книга успешно создана',
          data: row
        });
      }
    );
  });
});

// PUT /books/:id - Обновить книгу
router.put('/:id', (req, res) => {
  const { title, isbn, description, published_year, author_id, category_id } = req.body;

  // Проверяем существование книги
  db.get('SELECT * FROM books WHERE id = ?', [req.params.id], (err, book) => {
    if (err) {
      console.error('Ошибка при проверке книги:', err);
      return res.status(500).json({
        success: false,
        message: 'Ошибка сервера'
      });
    }

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Книга не найдена'
      });
    }

    const sql = `
      UPDATE books 
      SET title = ?, isbn = ?, description = ?, published_year = ?, author_id = ?, category_id = ?, updated_at = datetime('now') 
      WHERE id = ?
    `;

    db.run(sql, [title, isbn, description, published_year, author_id, category_id, req.params.id], function(err) {
      if (err) {
        console.error('Ошибка при обновлении книги:', err);
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({
            success: false,
            message: 'Книга с таким ISBN уже существует'
          });
        }
        return res.status(500).json({
          success: false,
          message: 'Ошибка сервера при обновлении книги'
        });
      }

      // Получаем обновленную книгу
      db.get(
        'SELECT books.*, authors.name as author_name, categories.name as category_name FROM books LEFT JOIN authors ON books.author_id = authors.id LEFT JOIN categories ON books.category_id = categories.id WHERE books.id = ?',
        [req.params.id],
        (err, row) => {
          if (err) {
            console.error('Ошибка при получении обновленной книги:', err);
            return res.status(500).json({
              success: false,
              message: 'Книга обновлена, но произошла ошибка при получении данных'
            });
          }

          res.json({
            success: true,
            message: 'Книга успешно обновлена',
            data: row
          });
        }
      );
    });
  });
});

// DELETE /books/:id - Удалить книгу
router.delete('/:id', (req, res) => {
  // Проверяем существование книги
  db.get('SELECT * FROM books WHERE id = ?', [req.params.id], (err, book) => {
    if (err) {
      console.error('Ошибка при проверке книги:', err);
      return res.status(500).json({
        success: false,
        message: 'Ошибка сервера'
      });
    }

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Книга не найдена'
      });
    }

    const sql = 'DELETE FROM books WHERE id = ?';

    db.run(sql, [req.params.id], function(err) {
      if (err) {
        console.error('Ошибка при удалении книги:', err);
        return res.status(500).json({
          success: false,
          message: 'Ошибка сервера при удалении книги'
        });
      }

      res.json({
        success: true,
        message: 'Книга успешно удалена'
      });
    });
  });
});

module.exports = router;