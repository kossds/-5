import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Имитация отправки формы
    console.log('Данные формы:', formData);
    
    // Переход на страницу успеха с передачей данных
    navigate('/contact/success', { 
      state: { 
        formData: formData,
        timestamp: new Date().toLocaleString()
      }
    });
  };

  return (
    <div className="contact">
      <div className="container">
        <h2>Свяжитесь с нами</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Имя:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Сообщение:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Отправить сообщение
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;