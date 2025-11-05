import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Сервер ответил с статусом ошибки
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      console.error('Network Error:', error.request);
      return Promise.reject({
        message: 'Сетевая ошибка. Проверьте подключение к интернету.'
      });
    } else {
      // Что-то пошло не так при настройке запроса
      console.error('Error:', error.message);
      return Promise.reject({
        message: 'Произошла непредвиденная ошибка'
      });
    }
  }
);

// CRUD операции
export const taskAPI = {
  // Получить все задачи
  getAll: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  // Получить задачу по ID
  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Создать новую задачу
  create: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Обновить задачу
  update: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Удалить задачу
  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default api;