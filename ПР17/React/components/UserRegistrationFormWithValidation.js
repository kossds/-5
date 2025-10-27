import React, { useState } from 'react';
import './UserRegistrationForm.css';

const UserRegistrationFormWithValidation = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    newsletter: false,
    age: '',
    bio: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Имя обязательно для заполнения';
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email обязателен для заполнения';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Некорректный формат email';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Пароль обязателен для заполнения';
        } else if (value.length < 8) {
          error = 'Пароль должен содержать минимум 8 символов';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = 'Подтверждение пароля обязательно';
        } else if (value !== formData.password) {
          error = 'Пароли не совпадают';
        }
        break;
      case 'gender':
        if (!value) error = 'Выберите пол';
        break;
      case 'age':
        if (!value) error = 'Выберите возраст';
        break;
      case 'bio':
        if (!value.trim()) error = 'Расскажите о себе';
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prevData => ({
      ...prevData,
      [name]: newValue
    }));

    // Валидация при изменении
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const newTouched = {};

    Object.keys(formData).forEach(key => {
      if (key !== 'newsletter') {
        newTouched[key] = true;
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Данные формы:', formData);
      alert('Регистрация успешно завершена!');
      // Сброс формы
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        newsletter: false,
        age: '',
        bio: ''
      });
      setErrors({});
      setTouched({});
    } else {
      alert('Пожалуйста, исправьте ошибки в форме');
    }
  };

  const isFieldValid = (fieldName) => !errors[fieldName] && touched[fieldName];

  return (
    <div className="form-container">
      <h2>Регистрация пользователя с валидацией</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="name">Имя:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.name ? 'error' : isFieldValid('name') ? 'valid' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.email ? 'error' : isFieldValid('email') ? 'valid' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.password ? 'error' : isFieldValid('password') ? 'valid' : ''}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Подтверждение пароля:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.confirmPassword ? 'error' : isFieldValid('confirmPassword') ? 'valid' : ''}
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <div className="form-group">
          <label>Пол:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
              />
              Мужской
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
              />
              Женский
            </label>
          </div>
          {errors.gender && <span className="error-message">{errors.gender}</span>}
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="newsletter"
              checked={formData.newsletter}
              onChange={handleChange}
            />
            Подписка на рассылку
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="age">Возраст:</label>
          <select
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.age ? 'error' : isFieldValid('age') ? 'valid' : ''}
          >
            <option value="">Выберите возраст</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-45">36-45</option>
            <option value="46+">46+</option>
          </select>
          {errors.age && <span className="error-message">{errors.age}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="bio">О себе:</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="4"
            className={errors.bio ? 'error' : isFieldValid('bio') ? 'valid' : ''}
          />
          {errors.bio && <span className="error-message">{errors.bio}</span>}
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={Object.keys(errors).some(key => errors[key])}
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default UserRegistrationFormWithValidation;