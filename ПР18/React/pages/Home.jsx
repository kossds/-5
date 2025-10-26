import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => {
  return (
    <div className="home">
      <div className="container">
        <h2>Добро пожаловать в наш магазин!</h2>
        <p>Лучшие электронные товары по доступным ценам</p>
        <div className="home-actions">
          <Link to="/products" className="btn btn-primary">
            Смотреть товары
          </Link>
          <Link to="/about" className="btn btn-secondary">
            Узнать о нас
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;