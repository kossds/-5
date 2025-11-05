import React from 'react';
import '../styles/App.css';

const TaskList = ({ 
  tasks, 
  onEdit, 
  onDelete, 
  onToggleComplete,
  loading = false 
}) => {
  if (loading) {
    return <div className="loading">Загрузка задач...</div>;
  }

  if (tasks.length === 0) {
    return <div className="no-tasks">Задачи не найдены</div>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <div className="task-header">
            <h3 className="task-title">{task.title}</h3>
            <div className="task-actions">
              <button
                onClick={() => onToggleComplete(task.id, !task.completed)}
                className={`btn btn-sm ${task.completed ? 'btn-warning' : 'btn-success'}`}
                title={task.completed ? 'Отметить как невыполненную' : 'Отметить как выполненную'}
              >
                {task.completed ? '❌' : '✅'}
              </button>
              <button
                onClick={() => onEdit(task)}
                className="btn btn-sm btn-primary"
                title="Редактировать"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="btn btn-sm btn-danger"
                title="Удалить"
              >
                🗑️
              </button>
            </div>
          </div>
          
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          
          <div className="task-meta">
            <span className="task-status">
              {task.completed ? '✅ Выполнено' : '⏳ В процессе'}
            </span>
            <span className="task-date">
              Создано: {formatDate(task.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;