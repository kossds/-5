import React, { useReducer, useContext, useCallback, useMemo, useRef, createContext } from 'react';

const ThemeContext = createContext();

const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    case 'SET':
      return { count: action.payload };
    default:
      return state;
  }
};

const AdvancedHooksComponent = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  const theme = useContext(ThemeContext);
  
  const inputRef = useRef(null);
  const renderCount = useRef(0);

  renderCount.current += 1;

  const increment = useCallback(() => {
    dispatch({ type: 'INCREMENT' });
  }, []);

  const decrement = useCallback(() => {
    dispatch({ type: 'DECREMENT' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const setValue = useCallback((value) => {
    dispatch({ type: 'SET', payload: value });
  }, []);

  const isEven = useMemo(() => {
    console.log('Вычисление четности...');
    return state.count % 2 === 0;
  }, [state.count]);

  const factorial = useMemo(() => {
    console.log('Вычисление факториала...');
    const calculateFactorial = (n) => {
      if (n <= 1) return 1;
      return n * calculateFactorial(n - 1);
    };
    return calculateFactorial(Math.min(Math.max(state.count, 0), 10));
  }, [state.count]);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  };

  const themeStyles = {
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: theme === 'dark' ? '#2c3e50' : '#ecf0f1',
    color: theme === 'dark' ? 'white' : '#2c3e50',
    border: `2px solid ${theme === 'dark' ? '#34495e' : '#bdc3c7'}`
  };

  return (
    <div style={themeStyles}>
      <h2>Продвинутые хуки</h2>
      <p>Количество рендеров: <strong>{renderCount.current}</strong></p>
      
      <div className="demo-block">
        <h3>useReducer + useCallback</h3>
        <p>Счетчик: <strong>{state.count}</strong></p>
        <p>Четное число: <strong>{isEven ? 'Да ✅' : 'Нет ❌'}</strong></p>
        <p>Факториал (0-10): <strong>{factorial}</strong></p>
        <div>
          <button onClick={increment}>+1</button>
          <button onClick={decrement}>-1</button>
          <button onClick={reset}>Сброс</button>
          <button onClick={() => setValue(5)}>Установить 5</button>
          <button onClick={() => setValue(10)}>Установить 10</button>
        </div>
      </div>

      <div className="demo-block">
        <h3>useRef</h3>
        <input
          ref={inputRef}
          type="text"
          placeholder="Нажмите кнопку для фокуса"
          style={{ width: '250px' }}
        />
        <button onClick={focusInput}>Фокус на input</button>
      </div>

      <div className="demo-block">
        <h3>useContext</h3>
        <p>Текущая тема: <strong>{theme}</strong></p>
        <p style={{ fontSize: '14px', color: theme === 'dark' ? '#bdc3c7' : '#7f8c8d' }}>
          Тема передается через Context API
        </p>
      </div>
    </div>
  );
};

const AdvancedHooks = () => (
  <ThemeContext.Provider value="dark">
    <AdvancedHooksComponent />
  </ThemeContext.Provider>
);

export default AdvancedHooks;