import React, { useState, useEffect } from 'react';

const BasicHooks = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  // useEffect с cleanup
  useEffect(() => {
    console.log('✅ Компонент BasicHooks смонтирован');
    
    return () => {
      console.log('🧹 Компонент BasicHooks будет размонтирован');
    };
  }, []);

  // useEffect с зависимостью
  useEffect(() => {
    if (count !== 0) {
      document.title = `Счетчик: ${count}`;
      console.log(`🔢 Счетчик обновлен: ${count}`);
    }
  }, [count]);

  useEffect(() => {
    if (name) {
      console.log(`👤 Имя обновлено: ${name}`);
    }
  }, [name]);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const resetCounter = () => setCount(0);
  const toggleVisibility = () => setIsVisible(prev => !prev);

  return (
    <div>
      <h2>Базовые хуки</h2>
      
      <div className="demo-block">
        <h3>useState: Счетчик</h3>
        <p>Текущее значение: <strong>{count}</strong></p>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
        <button onClick={resetCounter}>Сброс</button>
      </div>

      <div className="demo-block">
        <h3>useState: Форма</h3>
        <input
          type="text"
          placeholder="Введите ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '200px' }}
        />
        <p>Привет, <strong>{name || 'незнакомец'}</strong>!</p>
      </div>

      <div className="demo-block">
        <h3>useState: Условный рендеринг</h3>
        <button onClick={toggleVisibility}>
          {isVisible ? 'Скрыть' : 'Показать'} сообщение
        </button>
        {isVisible && (
          <p style={{ color: 'green', fontWeight: 'bold' }}>
            ✅ Это сообщение можно скрыть/показать
          </p>
        )}
      </div>

      <div className="demo-block">
        <h3>useEffect: Информация</h3>
        <p>Откройте консоль браузера, чтобы увидеть логи useEffect</p>
        <ul style={{ textAlign: 'left' }}>
          <li>Пустой массив зависимостей: только при монтировании</li>
          <li>С зависимостями: при изменении указанных значений</li>
          <li>Cleanup функция: при размонтировании</li>
        </ul>
      </div>
    </div>
  );
};

export default BasicHooks;