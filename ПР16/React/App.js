import React from 'react';
import BasicHooks from './React/BasicHooks';
import AdvancedHooks from './React/AdvancedHooks';
import CustomHooks from './React/CustomHooks';
import HooksTests from './React/HooksTests';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Практическая работа №16: React хуки</h1>
        <p>Изучение встроенных и кастомных хуков React</p>
      </header>
      
      <main>
        <div className="component-section">
          <BasicHooks />
        </div>
        <div className="component-section">
          <AdvancedHooks />
        </div>
        <div className="component-section">
          <CustomHooks />
        </div>
        <div className="component-section">
          <HooksTests />
        </div>
      </main>
    </div>
  );
}

export default App;