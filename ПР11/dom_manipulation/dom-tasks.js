// ЗАДАНИЕ 1: Создание и вставка элементов

function createCard(title, content) {
    const target = document.getElementById('target1');
    
    const card = document.createElement('div');
    card.className = 'card';
    
    const cardTitle = document.createElement('h4');
    cardTitle.textContent = title;
    
    const cardContent = document.createElement('p');
    cardContent.textContent = content;
    
    card.appendChild(cardTitle);
    card.appendChild(cardContent);
    target.appendChild(card);
}

function createList(items) {
    const target = document.getElementById('target1');
    
    const list = document.createElement('ol');
    
    items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        list.appendChild(listItem);
    });
    
    target.appendChild(list);
}

// ЗАДАНИЕ 2: Навигация по DOM

function countChildren() {
    const parent = document.getElementById('parent-element');
    return parent.children.length;
}

function findSpecialChild() {
    const parent = document.getElementById('parent-element');
    const specialChild = parent.querySelector('.special');
    return specialChild ? specialChild.textContent : 'Элемент не найден';
}

function getParentBackground() {
    const child = document.querySelector('.child');
    const parent = child.parentElement;
    return window.getComputedStyle(parent).backgroundColor;
}

// ЗАДАНИЕ 3: Работа с классами и стилями

function setupStyleToggle() {
    const toggleButton = document.getElementById('toggle-style');
    const target = document.getElementById('style-target');
    
    toggleButton.addEventListener('click', () => {
        target.classList.toggle('active-style');
    });
}

function changeHeaderColor() {
    const header = document.getElementById('main-header');
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    header.style.background = `linear-gradient(135deg, ${randomColor} 0%, #764ba2 100%)`;
}

function animateElement() {
    const element = document.getElementById('style-target');
    element.classList.add('animated');
    
    setTimeout(() => {
        element.classList.remove('animated');
    }, 3000);
}

// ЗАДАНИЕ 4: Обработка событий

function setupClickCounter() {
    let count = 0;
    const button = document.getElementById('click-btn');
    const counter = document.getElementById('click-counter');
    
    button.addEventListener('click', () => {
        count++;
        counter.textContent = count;
    });
}

function setupInputDisplay() {
    const input = document.getElementById('text-input');
    const display = document.getElementById('input-display');
    
    input.addEventListener('input', (event) => {
        display.textContent = event.target.value;
    });
}

function setupKeyboardEvents() {
    document.addEventListener('keydown', (event) => {
        console.log(`Key pressed: ${event.key} (Code: ${event.code})`);
    });
    
    document.addEventListener('keyup', (event) => {
        console.log(`Key released: ${event.key} (Code: ${event.code})`);
    });
}

// ЗАДАНИЕ 5: Динамические списки

function addListItem() {
    const input = document.getElementById('item-input');
    const list = document.getElementById('dynamic-list');
    
    if (input.value.trim() === '') {
        alert('Введите текст элемента');
        return;
    }
    
    const listItem = document.createElement('li');
    listItem.className = 'list-item';
    
    const itemText = document.createElement('span');
    itemText.textContent = input.value;
    
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Удалить';
    removeButton.className = 'remove-btn';
    removeButton.onclick = removeListItem;
    
    listItem.appendChild(itemText);
    listItem.appendChild(removeButton);
    list.appendChild(listItem);
    
    input.value = '';
}

function removeListItem(event) {
    const listItem = event.target.closest('li');
    if (listItem) {
        listItem.remove();
    }
}

function clearList() {
    const list = document.getElementById('dynamic-list');
    list.innerHTML = '';
}

function setupListEvents() {
    const addButton = document.getElementById('add-btn');
    const clearButton = document.getElementById('clear-btn');
    const list = document.getElementById('dynamic-list');
    
    addButton.addEventListener('click', addListItem);
    clearButton.addEventListener('click', clearList);
    
    // Делегирование событий для удаления элементов
    list.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-btn')) {
            removeListItem(event);
        }
    });
    
    // Добавление по Enter
    const input = document.getElementById('item-input');
    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addListItem();
        }
    });
}

// ЗАДАНИЕ 6: Работа с формами

function validateForm(formData) {
    const errors = {};
    
    // Проверка имени
    if (!formData.name.trim()) {
        errors.name = 'Имя обязательно для заполнения';
    } else if (formData.name.trim().length < 2) {
        errors.name = 'Имя должно содержать минимум 2 символа';
    }
    
    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
        errors.email = 'Email обязателен для заполнения';
    } else if (!emailRegex.test(formData.email)) {
        errors.email = 'Введите корректный email адрес';
    }
    
    // Проверка возраста
    const age = parseInt(formData.age);
    if (!formData.age) {
        errors.age = 'Возраст обязателен для заполнения';
    } else if (isNaN(age) || age < 1 || age > 120) {
        errors.age = 'Возраст должен быть числом от 1 до 120';
    }
    
    return Object.keys(errors).length === 0 ? null : errors;
}

function displayFormErrors(errors) {
    const output = document.getElementById('form-output');
    output.innerHTML = '';
    
    Object.values(errors).forEach(error => {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = error;
        output.appendChild(errorElement);
    });
}

function displayFormSuccess(userData) {
    const output = document.getElementById('form-output');
    output.innerHTML = '';
    
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.innerHTML = `
        <h3>Данные успешно отправлены!</h3>
        <p><strong>Имя:</strong> ${userData.name}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Возраст:</strong> ${userData.age}</p>
    `;
    
    output.appendChild(successElement);
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value
    };
    
    const errors = validateForm(formData);
    
    if (errors) {
        displayFormErrors(errors);
    } else {
        displayFormSuccess(formData);
        // Очистка формы
        event.target.reset();
    }
}

function setupForm() {
    const form = document.getElementById('user-form');
    form.addEventListener('submit', handleFormSubmit);
}

// Инициализация всех обработчиков при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    setupStyleToggle();
    setupClickCounter();
    setupInputDisplay();
    setupKeyboardEvents();
    setupListEvents();
    setupForm();
});