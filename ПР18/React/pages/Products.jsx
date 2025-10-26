import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Имитация загрузки данных
    const mockProducts = [
      { id: 1, name: 'Смартфон iPhone 15', price: 79990, category: 'phones' },
      { id: 2, name: 'Ноутбук MacBook Pro', price: 149990, category: 'laptops' },
      { id: 3, name: 'Наушники AirPods Pro', price: 19990, category: 'audio' },
      { id: 4, name: 'Планшет iPad Air', price: 59990, category: 'tablets' },
      { id: 5, name: 'Умные часы Apple Watch', price: 29990, category: 'wearables' },
      { id: 6, name: 'Фотокамера Canon EOS', price: 89990, category: 'cameras' },
    ];
    setProducts(mockProducts);
  }, []);

  return (
    <div className="products">
      <div className="container">
        <h2>Наши товары</h2>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p className="price">{product.price.toLocaleString()} ₽</p>
              <p className="category">Категория: {product.category}</p>
              <Link to={`/products/${product.id}`} className="btn btn-primary">
                Подробнее
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;