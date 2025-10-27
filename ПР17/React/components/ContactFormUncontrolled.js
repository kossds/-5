import React, { useRef } from 'react';
import './UserRegistrationForm.css';

const ContactFormUncontrolled = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const subjectRef = useRef();
  const messageRef = useRef();
  const priorityRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      subject: subjectRef.current.value,
      message: messageRef.current.value,
      priority: priorityRef.current.value
    };

    console.log('Данные формы (неуправляемый компонент):', formData);
    alert('Форма обратной связи отправлена! Проверьте консоль для просмотра данных.');

    // Сброс формы
    nameRef.current.value = '';
    emailRef.current.value = '';
    subjectRef.current.value = '';
    messageRef.current.value = '';
    priorityRef.current.value = 'normal';
  };

  return (
    <div className="form-container">
      <h2>Форма обратной связи (неуправляемый компонент)</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="contactName">Имя:</label>
          <input
            type="text"
            id="contactName"
            ref={nameRef}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactEmail">Email:</label>
          <input
            type="email"
            id="contactEmail"
            ref={emailRef}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Тема:</label>
          <input
            type="text"
            id="subject"
            ref={subjectRef}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Приоритет:</label>
          <select
            id="priority"
            ref={priorityRef}
            defaultValue="normal"
          >
            <option value="low">Низкий</option>
            <option value="normal">Обычный</option>
            <option value="high">Высокий</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="contactMessage">Сообщение:</label>
          <textarea
            id="contactMessage"
            ref={messageRef}
            rows="5"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Отправить сообщение
        </button>
      </form>
    </div>
  );
};

export default ContactFormUncontrolled;