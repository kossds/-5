const express = require('express');
const router = express.Router();

// Временное хранилище данных (в реальном приложении используем БД)
let users = [
  { id: 1, name: 'Иван Иванов', email: 'ivan@example.com', age: 25 },
  { id: 2, name: 'Петр Петров', email: 'petr@example.com', age: 30 },
  { id: 3, name: 'Мария Сидорова', email: 'maria@example.com', age: 28 }
];

let nextId = 4;

// Middleware для логирования запросов к пользователям
router.use((req, res, next) => {
  console.log(`Users router: ${req.method} ${req.path}`);
  next();
});

// Middleware для проверки существования пользователя по ID
router.param('id', (req, res, next, id) => {
  const userId = parseInt(id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ 
      error: 'Пользователь не найден',
      id: userId
    });
  }
  
  req.user = user;
  req.userId = userId;
  next();
});

// GET /api/users - получить всех пользователей
router.get('/', (req, res) => {
  const { limit, offset } = req.query;
  let resultUsers = [...users];
  
  // Пагинация
  if (offset) {
    resultUsers = resultUsers.slice(parseInt(offset));
  }
  if (limit) {
    resultUsers = resultUsers.slice(0, parseInt(limit));
  }
  
  res.json({
    users: resultUsers,
    total: users.length,
    count: resultUsers.length
  });
});

// GET /api/users/:id - получить пользователя по ID
router.get('/:id', (req, res) => {
  res.json(req.user);
});

// POST /api/users - создать нового пользователя
router.post('/', (req, res) => {
  const { name, email, age } = req.body;
  
  // Валидация
  if (!name || !email) {
    return res.status(400).json({
      error: 'Обязательные поля: name, email'
    });
  }
  
  // Проверка на уникальность email
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      error: 'Пользователь с таким email уже существует'
    });
  }
  
  const newUser = {
    id: nextId++,
    name,
    email,
    age: age || null
  };
  
  users.push(newUser);
  
  res.status(201).json({
    message: 'Пользователь успешно создан',
    user: newUser
  });
});

// PUT /api/users/:id - обновить пользователя
router.put('/:id', (req, res) => {
  const { name, email, age } = req.body;
  const userIndex = users.findIndex(u => u.id === req.userId);
  
  // Валидация
  if (!name || !email) {
    return res.status(400).json({
      error: 'Обязательные поля: name, email'
    });
  }
  
  // Проверка на уникальность email (исключая текущего пользователя)
  const existingUser = users.find(u => u.email === email && u.id !== req.userId);
  if (existingUser) {
    return res.status(400).json({
      error: 'Пользователь с таким email уже существует'
    });
  }
  
  users[userIndex] = {
    ...users[userIndex],
    name,
    email,
    age: age || users[userIndex].age
  };
  
  res.json({
    message: 'Пользователь успешно обновлен',
    user: users[userIndex]
  });
});

// DELETE /api/users/:id - удалить пользователя
router.delete('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.userId);
  const deletedUser = users.splice(userIndex, 1)[0];
  
  res.json({
    message: 'Пользователь успешно удален',
    user: deletedUser
  });
});

module.exports = router;