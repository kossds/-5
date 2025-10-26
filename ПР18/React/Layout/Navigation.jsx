import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'active' : ''}
            end
          >
            Главная
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/about"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            О нас
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/products"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Товары
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/contact"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Контакты
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;