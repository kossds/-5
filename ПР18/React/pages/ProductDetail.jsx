import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';


const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Имитация данных о товаре
  const products = {
    1: { name: 'Смартфон iPhone 15', price: 79990, description: 'Новейший смартфон с инновационной камерой' },
    2: { name: 'Ноутбук MacBook Pro', price: 149990, description: 'Мощный ноутбук для профессионалов' },
    3: { name: 'Наушники AirPods Pro', price: 19990, description: 'Беспроводные наушники с шумоподавлением' },
    4: { name: 'Планшет iPad Air', price: 59990, description: 'Универсальный планшет для работы и творчества' },
    5: { name: 'Умные часы Apple Watch', price: 29990, description: 'Умные часы для здоровья и продуктивности' },
    6: { name: 'Фотокамера Canon EOS', price: 89990, description: 'Профессиональная зеркальная камера' },
  };

  const product = products[id];

  if (!product) {
    return (
      <div className="product-detail">
        <div className="container">
          <h2>Товар не найден</h2>
          <Link to="/products" className="btn btn-primary">
            Вернуться к товарам
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn btn-back">
          ← Назад
        </button>
        <div className="product-detail-content">
          <h2>{product.name}</h2>
          <p className="price">{product.price.toLocaleString()} ₽</p>
          <p className="description">{product.description}</p>
          <div className="product-actions">
            <button className="btn btn-primary">Добавить в корзину</button>
            <Link to="/products" className="btn btn-secondary">
              Все товары
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;