import React, { useState, useEffect, useRef } from 'react';

// Кастомный хук для localStorage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Ошибка чтения localStorage: ${error}`);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Ошибка записи в localStorage: ${error}`);
    }
  };

  return [storedValue, setValue];
};

// Кастомный хук для размера окна
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Устанавливаем начальные значения

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Кастомный хук для API
const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Имитация задержки сети
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const result = await response.json();
        if (isMounted.current) {
          setData(result);
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err.message);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Кастомный хук для таймера
const useTimer = (initialTime = 0) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTime(initialTime);
  };
  const stop = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return { time, isRunning, start, pause, reset, stop };
};

// Основной компонент
const CustomHooks = () => {
  const [name, setName] = useLocalStorage('userName', '');
  const [theme, setTheme] = useLocalStorage('appTheme', 'light');
  const windowSize = useWindowSize();
  const timer = useTimer(0);
  const api = useApi('https://jsonplaceholder.typicode.com/todos/1');

  const containerStyle = {
    backgroundColor: theme === 'dark' ? '#2c3e50' : '#ffffff',
    color: theme === 'dark' ? 'white' : '#2c3e50',
    padding: '20px',
    borderRadius: '8px',
    border: `2px solid ${theme === 'dark' ? '#34495e' : '#bdc3c7'}`
  };

  return (
    <div style={containerStyle}>
      <h2>Кастомные хуки</h2>

      <div className="demo-block">
        <h3>useLocalStorage</h3>
        <div>
          <input
            type="text"
            placeholder="Введите имя (сохраняется автоматически)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        <p>Привет, <strong>{name || 'незнакомец'}</strong>!</p>
        
        <div>
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            Сменить тему: {theme}
          </button>
          <button onClick={() => setName('')}>Очистить имя</button>
        </div>
      </div>

      <div className="demo-block">
        <h3>useWindowSize</h3>
        <p>Ширина окна: <strong>{windowSize.width}px</strong></p>
        <p>Высота окна: <strong>{windowSize.height}px</strong></p>
        <p style={{ fontSize: '14px', opacity: 0.8 }}>
          Попробуйте изменить размер окна браузера
        </p>
      </div>

      <div className="demo-block">
        <h3>useTimer</h3>
        <p>Время: <strong>{timer.time} сек.</strong></p>
        <p>Статус: <strong>{timer.isRunning ? 'Запущен 🟢' : 'Остановлен 🔴'}</strong></p>
        <div>
          <button onClick={timer.start} disabled={timer.isRunning}>Старт</button>
          <button onClick={timer.pause} disabled={!timer.isRunning}>Пауза</button>
          <button onClick={timer.reset}>Сброс</button>
          <button onClick={timer.stop}>Стоп</button>
        </div>
      </div>

      <div className="demo-block">
        <h3>useApi</h3>
        {api.loading && <p>⏳ Загрузка данных...</p>}
        {api.error && <p style={{ color: 'red' }}>❌ Ошибка: {api.error}</p>}
        {api.data && (
          <div>
            <p>✅ Данные успешно загружены:</p>
            <pre style={{ 
              background: theme === 'dark' ? '#34495e' : '#f8f9fa', 
              padding: '10px', 
              borderRadius: '4px',
              fontSize: '12px',
              textAlign: 'left'
            }}>
              {JSON.stringify(api.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomHooks;