document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registrationForm');

  const fields = [
    { id: 'fullName', validate: (v) => v.trim().length >= 2 },
    { id: 'email', validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'phone', validate: (v) => v === '' || /^[\+]?[0-9\s\-\(\)]{10,}$/.test(v) },
    { id: 'password', validate: (v) => v.length >= 6 },
    { id: 'confirmPassword', validate: (v) => v === document.getElementById('password').value }
  ];

  fields.forEach(field => {
    const input = document.getElementById(field.id);
    const errorSpan = document.getElementById(field.id + 'Error');

    input.addEventListener('input', () => {
      const isValid = field.validate(input.value);
      if (isValid) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        errorSpan.textContent = '';
      } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
        errorSpan.textContent = getErrorMessage(field.id);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let isFormValid = true;

    fields.forEach(field => {
      const input = document.getElementById(field.id);
      const errorSpan = document.getElementById(field.id + 'Error');
      const isValid = field.validate(input.value);

      if (!isValid) {
        input.classList.remove('valid');
        input.classList.add('invalid');
        errorSpan.textContent = getErrorMessage(field.id);
        isFormValid = false;
      }
    });

    if (isFormValid) {
      alert('✅ Форма успешно отправлена!');
      form.reset();
      document.querySelectorAll('input').forEach(el => {
        el.classList.remove('valid', 'invalid');
      });
    }
  });

  function getErrorMessage(id) {
    const messages = {
      fullName: 'Имя должно содержать минимум 2 символа.',
      email: 'Введите корректный email.',
      phone: 'Неверный формат телефона.',
      password: 'Пароль должен быть не короче 6 символов.',
      confirmPassword: 'Пароли не совпадают.'
    };
    return messages[id] || 'Поле заполнено неверно.';
  }
});