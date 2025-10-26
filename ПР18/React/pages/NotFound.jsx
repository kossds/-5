import React from 'react';
import { Link } from 'react-router-dom';


const NotFound = () => {
  return (
    <div className="not-found">
      <div className="container">
        <div className="not-found-content">
          <h2>404 - Страница не найдена</h2>
          <p>Извините, запрашиваемая страница не существует.</p>
          <Link to="/" className="btn btn-primary">
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;