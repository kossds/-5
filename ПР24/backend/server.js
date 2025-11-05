const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (в реальном приложении используйте БД)
let tasks = [
  {
    id: '1',
    title: 'Изучить React',
    description: 'Пройти практическую работу по интеграции',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Настроить Express сервер',
    description: 'Создать базовый API',
    completed: true,
    createdAt: new Date().toISOString()
  }
];

// Routes

// GET /api/tasks - получить все задачи
app.get('/api/tasks', (req, res) => {
  try {
    // Имитация задержки сети
    setTimeout(() => {
      res.json({
        success: true,
        data: tasks,
        count: tasks.length
      });
    }, 500);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении задач'
    });
  }
});

// GET /api/tasks/:id - получить задачу по ID
app.get('/api/tasks/:id', (req, res) => {
  try {
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Задача не найдена'
      });
    }
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении задачи'
    });
  }
});

// POST /api/tasks - создать новую задачу
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Название задачи обязательно'
      });
    }

    const newTask = {
      id: uuidv4(),
      title,
      description: description || '',
      completed: false,
      createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    
    res.status(201).json({
      success: true,
      data: newTask,
      message: 'Задача успешно создана'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании задачи'
    });
  }
});

// PUT /api/tasks/:id - обновить задачу
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Задача не найдена'
      });
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title || tasks[taskIndex].title,
      description: description !== undefined ? description : tasks[taskIndex].description,
      completed: completed !== undefined ? completed : tasks[taskIndex].completed
    };

    res.json({
      success: true,
      data: tasks[taskIndex],
      message: 'Задача успешно обновлена'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении задачи'
    });
  }
});

// DELETE /api/tasks/:id - удалить задачу
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Задача не найдена'
      });
    }

    tasks = tasks.filter(t => t.id !== req.params.id);
    
    res.json({
      success: true,
      message: 'Задача успешно удалена'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении задачи'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`API доступно по http://localhost:${PORT}/api/tasks`);
});