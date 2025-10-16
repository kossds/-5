// events-tasks.js - базовые обработчики событий
console.log('events-tasks.js загружен успешно!');

// ЗАДАНИЕ 1: Базовые обработчики событий
window.handleBasicClick = function(event) {
    const output = document.getElementById('basic-output');
    output.innerHTML = `
        <strong>Информация о событии:</strong><br>
        Тип: ${event.type}<br>
        Target: ${event.target.tagName}<br>
        Координаты: X=${event.clientX}, Y=${event.clientY}<br>
        Время: ${new Date().toLocaleTimeString()}
    `;
    
    const button = event.target;
    button.classList.add('pulse');
    setTimeout(() => {
        button.classList.remove('pulse');
    }, 500);
};

window.handleMouseEvents = function(event) {
    const box = event.target;
    const output = document.getElementById('mouse-output');
    
    switch(event.type) {
        case 'mouseenter':
            box.style.backgroundColor = '#e74c3c';
            output.textContent = 'Курсор вошел в область';
            break;
        case 'mouseleave':
            box.style.backgroundColor = '#3498db';
            output.textContent = 'Курсор покинул область';
            break;
        case 'mousemove':
            const rect = box.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            output.textContent = `Координаты внутри блока: X=${Math.round(x)}, Y=${Math.round(y)}`;
            break;
    }
};

window.setupBasicEvents = function() {
    const basicBtn = document.getElementById('basic-btn');
    const colorBox = document.getElementById('color-box');
    
    if (basicBtn) basicBtn.addEventListener('click', handleBasicClick);
    if (colorBox) {
        colorBox.addEventListener('mouseenter', handleMouseEvents);
        colorBox.addEventListener('mouseleave', handleMouseEvents);
        colorBox.addEventListener('mousemove', handleMouseEvents);
    }
};

// ЗАДАНИЕ 2: События клавиатуры
window.handleKeyEvents = function(event) {
    const output = document.getElementById('key-output');
    
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        output.innerHTML = '<strong>Комбинация Ctrl+S заблокирована</strong>';
        return;
    }
    
    if (event.altKey && event.key === 'c') {
        event.preventDefault();
        output.innerHTML = '<strong>Комбинация Alt+C заблокирована</strong>';
        return;
    }
    
    if (event.shiftKey && event.key === 'a') {
        event.preventDefault();
        output.innerHTML = '<strong>Комбинация Shift+A заблокирована</strong>';
        return;
    }
    
    output.innerHTML = `
        <strong>Информация о нажатой клавише:</strong><br>
        Key: ${event.key}<br>
        Code: ${event.code}<br>
        Ctrl: ${event.ctrlKey}<br>
        Alt: ${event.altKey}<br>
        Shift: ${event.shiftKey}<br>
        Время: ${new Date().toLocaleTimeString()}
    `;
};

window.setupKeyboardEvents = function() {
    const keyInput = document.getElementById('key-input');
    if (keyInput) {
        keyInput.addEventListener('keydown', handleKeyEvents);
    }
};

// ЗАДАНИЕ 3: Делегирование событий
window.handleDelegationClick = function(event) {
    const output = document.getElementById('delegation-output');
    const itemList = document.getElementById('item-list');
    
    if (event.target.classList.contains('item')) {
        event.target.classList.toggle('selected');
    }
    
    if (event.target.classList.contains('delete')) {
        event.stopPropagation();
        const item = event.target.parentElement;
        item.remove();
    }
    
    const selectedItems = itemList.querySelectorAll('.item.selected');
    const selectedIds = Array.from(selectedItems).map(item => item.dataset.id);
    output.textContent = `Выбрано элементов: ${selectedItems.length}. ID: ${selectedIds.join(', ')}`;
};

window.addNewItem = function() {
    const itemList = document.getElementById('item-list');
    const items = itemList.querySelectorAll('.item');
    const nextId = items.length + 1;
    
    const newItem = document.createElement('li');
    newItem.className = 'item';
    newItem.dataset.id = nextId;
    newItem.innerHTML = `Элемент ${nextId} <span class="delete">×</span>`;
    
    itemList.appendChild(newItem);
};

window.setupDelegationEvents = function() {
    const itemList = document.getElementById('item-list');
    const addBtn = document.getElementById('add-item-btn');
    
    if (itemList) itemList.addEventListener('click', handleDelegationClick);
    if (addBtn) addBtn.addEventListener('click', addNewItem);
};

// ЗАДАНИЕ 4: Предотвращение поведения
window.preventLinkDefault = function(event) {
    event.preventDefault();
    const output = document.getElementById('prevention-output');
    output.innerHTML = '<strong>Переход по ссылке заблокирован!</strong>';
    
    const link = event.target;
    link.classList.add('shake');
    setTimeout(() => {
        link.classList.remove('shake');
    }, 300);
};

window.preventFormSubmit = function(event) {
    event.preventDefault();
    const output = document.getElementById('prevention-output');
    const formInput = document.getElementById('form-input');
    
    if (!formInput.value.trim()) {
        output.innerHTML = '<strong style="color: #e74c3c;">Ошибка: поле не должно быть пустым!</strong>';
        formInput.focus();
        return;
    }
    
    output.innerHTML = `
        <strong>Данные формы:</strong><br>
        Значение: "${formInput.value}"<br>
        Время отправки: ${new Date().toLocaleTimeString()}
    `;
    
    formInput.value = '';
};

window.setupPreventionEvents = function() {
    const preventLink = document.getElementById('prevent-link');
    const preventForm = document.getElementById('prevent-form');
    
    if (preventLink) preventLink.addEventListener('click', preventLinkDefault);
    if (preventForm) preventForm.addEventListener('submit', preventFormSubmit);
};

// ЗАДАНИЕ 5: Кастомные события
window.triggerCustomEvent = function() {
    const customEvent = new CustomEvent('customAction', {
        detail: {
            message: "Привет от кастомного события!",
            timestamp: new Date().toLocaleTimeString(),
            randomNumber: Math.floor(Math.random() * 100)
        },
        bubbles: true
    });
    
    document.dispatchEvent(customEvent);
};

window.handleCustomEvent = function(event) {
    const output = document.getElementById('custom-output');
    const { message, timestamp, randomNumber } = event.detail;
    
    output.innerHTML = `
        <strong>Кастомное событие получено!</strong><br>
        Сообщение: ${message}<br>
        Время: ${timestamp}<br>
        Случайное число: ${randomNumber}
    `;
    
    const button = document.getElementById('trigger-custom');
    button.classList.add('highlight');
    setTimeout(() => {
        button.classList.remove('highlight');
    }, 500);
};

window.setupCustomEvents = function() {
    const triggerBtn = document.getElementById('trigger-custom');
    if (triggerBtn) {
        triggerBtn.addEventListener('click', triggerCustomEvent);
    }
    document.addEventListener('customAction', handleCustomEvent);
};

// ЗАДАНИЕ 6: События загрузки
window.loadImageWithEvents = function() {
    const output = document.getElementById('loading-output');
    const container = document.getElementById('image-container');
    
    container.innerHTML = '';
    output.textContent = 'Начинаем загрузку изображения...';
    
    const img = new Image();
    
    img.addEventListener('loadstart', () => {
        output.textContent += '\nЗагрузка началась...';
    });
    
    img.addEventListener('load', () => {
        output.textContent += '\nИзображение успешно загружено!';
        container.appendChild(img);
    });
    
    img.addEventListener('error', () => {
        output.textContent += '\nОшибка загрузки изображения!';
    });
    
    img.src = 'https://picsum.photos/300/200?' + Date.now();
};

window.simulateLoadError = function() {
    const output = document.getElementById('loading-output');
    const container = document.getElementById('image-container');
    
    container.innerHTML = '';
    output.textContent = 'Пытаемся загрузить несуществующее изображение...';
    
    const img = new Image();
    img.addEventListener('error', () => {
        output.textContent += '\nОшибка загрузки! Изображение не найдено.';
    });
    
    img.src = 'https://example.com/nonexistent-image-' + Date.now() + '.jpg';
};

window.setupLoadingEvents = function() {
    const loadBtn = document.getElementById('load-image');
    const errorBtn = document.getElementById('load-error');
    
    if (loadBtn) loadBtn.addEventListener('click', loadImageWithEvents);
    if (errorBtn) errorBtn.addEventListener('click', simulateLoadError);
};

// ЗАДАНИЕ 7: Таймеры
window.timerInterval = null;
window.timerValue = 0;

window.startTimer = function() {
    const output = document.getElementById('timer-output');
    const startBtn = document.getElementById('start-timer');
    
    if (timerInterval) {
        output.textContent = 'Таймер уже запущен!';
        return;
    }
    
    output.textContent = 'Таймер: 0 сек';
    timerValue = 0;
    
    timerInterval = setInterval(() => {
        timerValue++;
        output.textContent = `Таймер: ${timerValue} сек`;
    }, 1000);
    
    startBtn.disabled = true;
    setTimeout(() => {
        startBtn.disabled = false;
    }, 1000);
};

window.stopTimer = function() {
    const output = document.getElementById('timer-output');
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        output.textContent = `Таймер остановлен на ${timerValue} сек`;
        timerValue = 0;
    } else {
        output.textContent = 'Таймер не был запущен';
    }
};

window.createDebounce = function(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

window.createThrottle = function(func, interval) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= interval) {
            lastCall = now;
            func.apply(this, args);
        }
    };
};

window.testDebounce = function() {
    const output = document.getElementById('async-output');
    output.textContent = 'Тестируем Debounce...';
    
    const normalFunction = () => {
        output.textContent += '\nОбычный вызов: ' + new Date().toLocaleTimeString();
    };
    
    const debouncedFunction = createDebounce(() => {
        output.textContent += '\nDebounce вызов: ' + new Date().toLocaleTimeString();
    }, 1000);
    
    output.textContent += '\n--- Быстрые вызовы ---';
    
    normalFunction();
    debouncedFunction();
    
    setTimeout(() => {
        normalFunction();
        debouncedFunction();
    }, 200);
    
    setTimeout(() => {
        normalFunction();
        debouncedFunction();
    }, 400);
};

window.testThrottle = function() {
    const output = document.getElementById('async-output');
    output.textContent = 'Тестируем Throttle...';
    
    const normalFunction = () => {
        output.textContent += '\nОбычный вызов: ' + new Date().toLocaleTimeString();
    };
    
    const throttledFunction = createThrottle(() => {
        output.textContent += '\nThrottle вызов: ' + new Date().toLocaleTimeString();
    }, 1000);
    
    output.textContent += '\n--- Быстрые вызовы ---';
    
    let count = 0;
    const interval = setInterval(() => {
        normalFunction();
        throttledFunction();
        
        count++;
        if (count >= 5) {
            clearInterval(interval);
            output.textContent += '\n--- Тест завершен ---';
        }
    }, 200);
};

window.setupTimerEvents = function() {
    const startBtn = document.getElementById('start-timer');
    const stopBtn = document.getElementById('stop-timer');
    const debounceBtn = document.getElementById('debounce-btn');
    const throttleBtn = document.getElementById('throttle-btn');
    
    if (startBtn) startBtn.addEventListener('click', startTimer);
    if (stopBtn) stopBtn.addEventListener('click', stopTimer);
    if (debounceBtn) debounceBtn.addEventListener('click', testDebounce);
    if (throttleBtn) throttleBtn.addEventListener('click', testThrottle);
};

// Инициализация всех обработчиков
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем обработчики...');
    
    setupBasicEvents();
    setupKeyboardEvents();
    setupDelegationEvents();
    setupPreventionEvents();
    setupCustomEvents();
    setupLoadingEvents();
    setupTimerEvents();
    
    console.log('Все обработчики событий инициализированы!');
});