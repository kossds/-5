import React from 'react';


const About = () => {
  return (
    <div className="about">
      <div className="container">
        <h2>О нашей компании</h2>
        <div className="about-content">
          <p>
            Мы - ведущий магазин электроники, работающий на рынке более 10 лет. 
            Наша миссия - предоставлять качественные товары по лучшим ценам.
          </p>
          <div className="features">
            <div className="feature">
              <h3>Качество</h3>
              <p>Все товары проходят строгий контроль качества</p>
            </div>
            <div className="feature">
              <h3>Гарантия</h3>
              <p>Предоставляем официальную гарантию на всю технику</p>
            </div>
            <div className="feature">
              <h3>Поддержка</h3>
              <p>Круглосуточная поддержка наших клиентов</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;