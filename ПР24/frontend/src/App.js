import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import LoadingSpinner from './components/LoadingSpinner';
import { taskAPI } from './services/api';
import './styles/App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Загрузка задач при монтировании компонента
  useEffect(() => {
    loadTasks();
  }, []);

  // Очистка сообщений через 3 секунды
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getAll();
      setTasks(response.data);
    } catch (err) {
      setError(err.message || 'Ошибка при загрузке задач');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      setFormLoading(true);
      const response = await taskAPI.create(taskData);
      setTasks(prev => [response.data, ...prev]);
      setSuccess(response.message || 'Задача успешно создана');
    } catch (err) {
      setError(err.message || 'Ошибка при создании задачи');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      setFormLoading(true);
      const response = await taskAPI.update(editingTask.id, taskData);
      setTasks(prev => 
        prev.map(task => 
          task.id === editingTask.id ? response.data : task
        )
      );
      setSuccess(response.message || 'Задача успешно обновлена');
      setEditingTask(null);
    } catch (err) {
      setError(err.message || 'Ошибка при обновлении задачи');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      return;
    }

    try {
      // Оптимистичное обновление
      const taskToDelete = tasks.find(t => t.id === taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));

      await taskAPI.delete(taskId);
      setSuccess('Задача успешно удалена');
    } catch (err) {
      // Откат при ошибке
      setTasks(prev => {
        const newTasks = [...prev];
        const index = newTasks.findIndex(t => t.id === taskId);
        if (index === -1 && taskToDelete) {
          newTasks.splice(index, 0, taskToDelete);
        }
        return newTasks;
      });
      setError(err.message || 'Ошибка при удалении задачи');
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      // Оптимистичное обновление
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, completed } : task
        )
      );

      await taskAPI.update(taskId, { completed });
    } catch (err) {
      // Откат при ошибке
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, completed: !completed } : task
        )
      );
      setError(err.message || 'Ошибка при обновлении задачи');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleFormSubmit = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Менеджер задач</h1>
        <p>Управляйте своими задачами эффективно</p>
      </header>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <main>
        <section>
          <h2>{editingTask ? 'Редактировать задачу' : 'Создать новую задачу'}</h2>
          {formLoading ? (
            <LoadingSpinner message={editingTask ? 'Обновление задачи...' : 'Создание задачи...'} />
          ) : (
            <TaskForm
              onSubmit={handleFormSubmit}
              initialData={editingTask || {}}
              isEditing={!!editingTask}
              onCancel={handleCancelEdit}
            />
          )}
        </section>

        <section>
          <h2>Список задач ({tasks.length})</h2>
          {loading ? (
            <LoadingSpinner message="Загрузка задач..." />
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;