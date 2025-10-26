import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

const MultipleStatesDemo = () => {
  const [user, setUser] = useState({ name: '', age: '' });
  const [items, setItems] = useState([]);

  const addItem = () => {
    setItems(prevItems => [
      ...prevItems,
      { id: Date.now(), name: `Item ${prevItems.length + 1}` }
    ]);
  };

  const removeItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <div>
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Имя"
          value={user.name}
          onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Возраст"
          value={user.age}
          onChange={(e) => setUser(prev => ({ ...prev, age: e.target.value }))}
        />
      </div>
      <p>Пользователь: <strong>{user.name}</strong>, возраст: <strong>{user.age}</strong></p>
      
      <button onClick={addItem}>Добавить элемент</button>
      {items.length > 0 && (
        <ul style={{ textAlign: 'left', marginTop: '10px' }}>
          {items.map(item => (
            <li key={item.id}>
              {item.name}
              <button 
                onClick={() => removeItem(item.id)}
                style={{ marginLeft: '10px', padding: '2px 8px', fontSize: '12px' }}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const HooksTests = () => {
  const [counter, setCounter] = useState(0);
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  // useEffect vs useLayoutEffect
  useEffect(() => {
    console.log('useEffect вызван, counter:', counter);
    if (counter === 5) {
      setMessage('🎉 Достигнуто число 5!');
    }
    
    return () => {
      console.log('useEffect cleanup, counter:', counter);
    };
  }, [counter]);

  useLayoutEffect(() => {
    console.log('useLayoutEffect вызван, counter:', counter);
  }, [counter]);

  // Проблема устаревшего замыкания
  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleIncrementFunctional = () => {
    setCount(prevCount => prevCount + 1);
  };

  // Демонстрация интервала
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      console.log('Текущее значение count:', count);
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [count]);

  const resetAll = () => {
    setCounter(0);
    setCount(0);
    setMessage('');
  };

  return (
    <div>
      <h2>Тестирование хуков и граничные случаи</h2>

      <div className="demo-block">
        <h3>useEffect vs useLayoutEffect</h3>
        <p>Счетчик: <strong>{counter}</strong></p>
        <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>
        <button onClick={() => setCounter(c => c + 1)}>
          Увеличить счетчик
        </button>
        <button onClick={() => setCounter(0)}>
          Сбросить счетчик
        </button>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Откройте консоль чтобы увидеть разницу между useEffect и useLayoutEffect
        </p>
      </div>

      <div className="demo-block">
        <h3>Проблема устаревшего замыкания</h3>
        <p>Count: <strong>{count}</strong></p>
        <button onClick={handleIncrement}>
          Обычное обновление (потенциальные проблемы)
        </button>
        <button onClick={handleIncrementFunctional}>
          Функциональное обновление (рекомендуется)
        </button>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Оба способа работают, но функциональное обновление безопаснее при асинхронных операциях
        </p>
      </div>

      <div className="demo-block">
        <h3>Множественные состояния и сложные объекты</h3>
        <MultipleStatesDemo />
      </div>

      <div className="demo-block">
        <h3>Сброс всего</h3>
        <button onClick={resetAll} style={{ backgroundColor: '#dc3545' }}>
          Сбросить все состояния
        </button>
      </div>
    </div>
  );
};

export default HooksTests;