// events-tests.js - тесты для обработки событий
console.log('events-tests.js загружен успешно!');

function runTests() {
    console.log('Запуск тестов обработки событий...');
    
    // Проверим доступность функций
    console.log('Проверка доступности функций...');
    const requiredFunctions = [
        'handleBasicClick', 'handleMouseEvents', 'handleKeyEvents',
        'handleDelegationClick', 'addNewItem', 'preventLinkDefault',
        'createDebounce', 'createThrottle'
    ];
    
    requiredFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`✓ Функция ${funcName} доступна`);
        } else {
            console.log(`✗ Функция ${funcName} НЕ доступна`);
        }
    });
    
    // Запускаем тесты только если основные функции доступны
    if (typeof handleBasicClick === 'function' && typeof handleKeyEvents === 'function') {
        // Тест 1: Проверка базовых обработчиков
        testBasicEvents();
        
        // Тест 2: Проверка событий клавиатуры
        testKeyboardEvents();
        
        // Тест 3: Проверка делегирования событий
        testDelegationEvents();
        
        // Тест 4: Проверка предотвращения поведения
        testPreventionEvents();
        
        // Тест 5: Проверка кастомных событий
        testCustomEvents();
        
        // Тест 6: Проверка debounce и throttle
        testDebounceThrottle();
        
        console.log('Все тесты завершены!');
    } else {
        console.error('❌ Основные функции не доступны, тесты пропущены');
    }
}

function testBasicEvents() {
    console.log('=== Тест 1: Базовые обработчики событий ===');
    
    // Создаем тестовые элементы
    const testButton = document.createElement('button');
    testButton.id = 'test-basic-btn';
    document.body.appendChild(testButton);
    
    const testOutput = document.createElement('div');
    testOutput.id = 'test-basic-output';
    document.body.appendChild(testOutput);
    
    const testColorBox = document.createElement('div');
    testColorBox.id = 'test-color-box';
    testColorBox.style.width = '100px';
    testColorBox.style.height = '50px';
    document.body.appendChild(testColorBox);
    
    // Тестируем handleBasicClick
    const mockEvent = {
        type: 'click',
        target: testButton,
        clientX: 100,
        clientY: 50
    };
    
    try {
        handleBasicClick(mockEvent);
        console.log('✓ handleBasicClick выполнен успешно');
    } catch (error) {
        console.error('✗ Ошибка в handleBasicClick:', error);
    }
    
    // Тестируем handleMouseEvents
    const mouseEvents = ['mouseenter', 'mouseleave', 'mousemove'];
    mouseEvents.forEach(eventType => {
        const mockMouseEvent = {
            type: eventType,
            target: testColorBox
        };
        
        try {
            handleMouseEvents(mockMouseEvent);
            console.log(`✓ handleMouseEvents для ${eventType} выполнен успешно`);
        } catch (error) {
            console.error(`✗ Ошибка в handleMouseEvents для ${eventType}:`, error);
        }
    });
    
    // Убираем тестовые элементы
    document.body.removeChild(testButton);
    document.body.removeChild(testOutput);
    document.body.removeChild(testColorBox);
}

function testKeyboardEvents() {
    console.log('=== Тест 2: События клавиатуры ===');
    
    const testInput = document.createElement('input');
    testInput.id = 'test-key-input';
    document.body.appendChild(testInput);
    
    const testOutput = document.createElement('div');
    testOutput.id = 'test-key-output';
    document.body.appendChild(testOutput);
    
    // Тестируем комбинации клавиш
    const testCombinations = [
        { ctrlKey: true, key: 's', shouldPrevent: true },
        { altKey: true, key: 'c', shouldPrevent: true },
        { shiftKey: true, key: 'a', shouldPrevent: true },
        { key: 'a', shouldPrevent: false }
    ];
    
    testCombinations.forEach((combo, index) => {
        const mockKeyEvent = {
            ...combo,
            preventDefault: function() {
                this.wasPrevented = true;
            },
            wasPrevented: false
        };
        
        try {
            handleKeyEvents(mockKeyEvent);
            if (combo.shouldPrevent && mockKeyEvent.wasPrevented) {
                console.log(`✓ Комбинация ${index + 1} правильно предотвращена`);
            } else if (!combo.shouldPrevent && !mockKeyEvent.wasPrevented) {
                console.log(`✓ Обычная клавиша ${index + 1} обработана корректно`);
            } else {
                console.error(`✗ Неправильное поведение для комбинации ${index + 1}`);
            }
        } catch (error) {
            console.error(`✗ Ошибка в handleKeyEvents для комбинации ${index + 1}:`, error);
        }
    });
    
    document.body.removeChild(testInput);
    document.body.removeChild(testOutput);
}

function testDelegationEvents() {
    console.log('=== Тест 3: Делегирование событий ===');
    
    // Используем правильный ID который ищет функция addNewItem
    const testList = document.createElement('ul');
    testList.id = 'item-list'; // ИСПРАВЛЕНО: используем тот же ID что в основном коде
    document.body.appendChild(testList);
    
    // Добавляем тестовые элементы
    const testItem = document.createElement('li');
    testItem.className = 'item';
    testItem.dataset.id = 'test-1';
    testItem.innerHTML = 'Тестовый элемент <span class="delete">×</span>';
    testList.appendChild(testItem);
    
    const mockClickEvent = {
        target: testItem,
        stopPropagation: function() {}
    };
    
    try {
        handleDelegationClick(mockClickEvent);
        console.log('✓ Клик по элементу обработан успешно');
    } catch (error) {
        console.error('✗ Ошибка в handleDelegationClick:', error);
    }
    
    // Тестируем добавление нового элемента
    const initialCount = testList.children.length;
    try {
        addNewItem();
        const newCount = testList.children.length;
        if (newCount > initialCount) {
            console.log('✓ addNewItem работает корректно');
        } else {
            console.error('✗ addNewItem не добавил новый элемент');
        }
    } catch (error) {
        console.error('✗ Ошибка в addNewItem:', error);
    }
    
    document.body.removeChild(testList);
}

function testPreventionEvents() {
    console.log('=== Тест 4: Предотвращение поведения ===');
    
    const testLink = document.createElement('a');
    testLink.id = 'test-prevent-link';
    testLink.href = 'https://example.com';
    document.body.appendChild(testLink);
    
    const mockLinkEvent = {
        target: testLink,
        preventDefault: function() {
            this.wasPrevented = true;
        },
        wasPrevented: false
    };
    
    try {
        preventLinkDefault(mockLinkEvent);
        if (mockLinkEvent.wasPrevented) {
            console.log('✓ preventLinkDefault предотвращает переход по ссылке');
        } else {
            console.error('✗ preventLinkDefault не предотвратил переход');
        }
    } catch (error) {
        console.error('✗ Ошибка в preventLinkDefault:', error);
    }
    
    document.body.removeChild(testLink);
}

function testCustomEvents() {
    console.log('=== Тест 5: Кастомные события ===');
    
    let customEventHandled = false;
    
    const testHandler = (event) => {
        customEventHandled = true;
        if (event.detail && event.detail.message) {
            console.log('✓ Кастомное событие получено с данными:', event.detail.message);
        }
    };
    
    document.addEventListener('testCustomEvent', testHandler);
    
    try {
        const customEvent = new CustomEvent('testCustomEvent', {
            detail: { message: 'Тестовое сообщение' }
        });
        
        document.dispatchEvent(customEvent);
        
        if (customEventHandled) {
            console.log('✓ Кастомные события работают корректно');
        } else {
            console.error('✗ Обработчик кастомного события не сработал');
        }
    } catch (error) {
        console.error('✗ Ошибка в работе с кастомными событиями:', error);
    }
    
    document.removeEventListener('testCustomEvent', testHandler);
}

function testDebounceThrottle() {
    console.log('=== Тест 6: Debounce и Throttle ===');
    
    // Тестируем debounce с правильным ожиданием
    let callCount = 0;
    const testFunction = () => {
        callCount++;
    };
    
    // Тестируем debounce
    try {
        const debouncedFn = createDebounce(testFunction, 100);
        
        // Быстрые последовательные вызовы
        debouncedFn();
        debouncedFn();
        debouncedFn();
        
        // Ждем достаточно времени для срабатывания debounce
        setTimeout(() => {
            if (callCount === 1) {
                console.log('✓ Debounce работает корректно');
            } else {
                console.error('✗ Debounce не ограничил вызовы. Вызовов: ' + callCount);
            }
        }, 150); // Ждем больше чем delay (100ms)
    } catch (error) {
        console.error('✗ Ошибка в createDebounce:', error);
    }
    
    // Тестируем throttle с раздельной переменной
    let throttleCallCount = 0;
    const throttleTestFunction = () => {
        throttleCallCount++;
    };
    
    try {
        const throttledFn = createThrottle(throttleTestFunction, 100);
        
        throttledFn();
        throttledFn(); // Этот вызов должен быть проигнорирован
        
        setTimeout(() => {
            if (throttleCallCount === 1) {
                console.log('✓ Throttle работает корректно');
            } else {
                console.error('✗ Throttle не ограничил вызовы. Вызовов: ' + throttleCallCount);
            }
        }, 50);
    } catch (error) {
        console.error('✗ Ошибка в createThrottle:', error);
    }
}

// Запускаем тесты при полной загрузке страницы
window.addEventListener('load', function() {
    setTimeout(runTests, 1000); // Даем время на инициализацию
});