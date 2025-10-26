import React from 'react';
import { useLocation, Link } from 'react-router-dom';


const ContactSuccess = () => {
  const location = useLocation();
  const { formData, timestamp } = location.state || {};

  return (
    <div className="contact-success">
      <div className="container">
        <div className="success-message">
          <h2>Сообщение отправлено!</h2>
          <p>Спасибо за ваше обращение. Мы свяжемся с вами в ближайшее время.</p>
          
          {formData && (
            <div className="submitted-data">
              <h3>Ваши данные:</h3>
              <p><strong>Имя:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Сообщение:</strong> {formData.message}</p>
              <p><strong>Время отправки:</strong> {timestamp}</p>
            </div>
          )}
          
          <div className="success-actions">
            <Link to="/" className="btn btn-primary">
              На главную
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Отправить ещё
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSuccess;