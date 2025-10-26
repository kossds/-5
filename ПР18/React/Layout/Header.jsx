import React from 'react';
import Navigation from './Navigation';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <h1>Магазин электроники</h1>
        <Navigation />
      </div>
    </header>
  );
};

export default Header;