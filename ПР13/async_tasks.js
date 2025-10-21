// === АСИНХРОННЫЕ ОПЕРАЦИИ - ОСНОВНЫЕ ЗАДАНИЯ ===

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
function displayOutput(selector, message, type = 'info') {
    const output = document.querySelector(selector);
    const timestamp = new Date().toLocaleTimeString();
    const formattedMessage = `[${timestamp}] ${message}`;
    
    if (type === 'clear') {
        output.innerHTML = formattedMessage;
    } else {
        const messageElement = document.createElement('div');
        messageElement.className = type;
        messageElement.textContent = formattedMessage;
        output.appendChild(messageElement);
        output.scrollTop = output.scrollHeight;
    }
}

function clearOutput(selector) {
    const output = document.querySelector(selector);
    output.innerHTML = '';
}

// ЗАДАНИЕ 1: Основы промисов
function createBasicPromise(shouldResolve = true) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldResolve) {
                resolve("Успех! Промис выполнен через 1 секунду");
            } else {
                reject("Ошибка! Промис отклонен через 1 секунду");
            }
        }, 1000);
    });
}

function handleBasicPromise() {
    clearOutput('#promise-output');
    displayOutput('#promise-output', 'Запуск базового промиса...', 'loading');
    
    createBasicPromise(true)
        .then(result => {
            displayOutput('#promise-output', `✓ ${result}`, 'success');
        })
        .catch(error => {
            displayOutput('#promise-output', `✗ ${error}`, 'error');
        });
}

function createPromiseChain() {
    clearOutput('#promise-output');
    displayOutput('#promise-output', 'Запуск цепочки промисов...', 'loading');
    
    let step = 1;
    
    createBasicPromise(true)
        .then(result => {
            displayOutput('#promise-output', `Шаг ${step++}: ${result}`, 'success');
            return new Promise(resolve => {
                setTimeout(() => resolve("Второй промис выполнен через 0.5 секунды"), 500);
            });
        })
        .then(result => {
            displayOutput('#promise-output', `Шаг ${step++}: ${result}`, 'success');
            return new Promise(resolve => {
                setTimeout(() => resolve("Третий промис выполнен через 0.5 секунды"), 500);
            });
        })
        .then(result => {
            displayOutput('#promise-output', `Шаг ${step}: ${result}`, 'success');
            displayOutput('#promise-output', '✓ Цепочка промисов завершена!', 'success');
        })
        .catch(error => {
            displayOutput('#promise-output', `✗ Ошибка в цепочке: ${error}`, 'error');
        });
}

function handlePromiseError() {
    clearOutput('#promise-output');
    displayOutput('#promise-output', 'Тестирование обработки ошибок...', 'loading');
    
    createBasicPromise(false)
        .then(result => {
            displayOutput('#promise-output', `✓ ${result}`, 'success');
        })
        .catch(error => {
            displayOutput('#promise-output', `✗ Поймана ошибка: ${error}`, 'error');
        });
}

function setupPromiseEvents() {
    document.getElementById('basic-promise').addEventListener('click', handleBasicPromise);
    document.getElementById('promise-chain').addEventListener('click', createPromiseChain);
    document.getElementById('promise-error').addEventListener('click', handlePromiseError);
}

// ЗАДАНИЕ 2: Async/Await
async function basicAsyncAwait() {
    clearOutput('#async-output');
    displayOutput('#async-output', 'Запуск async/await...', 'loading');
    
    try {
        displayOutput('#async-output', 'Ожидание результата...', 'info');
        const result = await createBasicPromise(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        displayOutput('#async-output', `✓ ${result}`, 'success');
    } catch (error) {
        displayOutput('#async-output', `✗ ${error}`, 'error');
    }
}

async function handleAsyncError() {
    clearOutput('#async-output');
    displayOutput('#async-output', 'Тестирование обработки ошибок с async/await...', 'loading');
    
    try {
        const result = await createBasicPromise(false);
        displayOutput('#async-output', `✓ ${result}`, 'success');
    } catch (error) {
        displayOutput('#async-output', `✗ Поймана ошибка в try/catch: ${error}`, 'error');
    }
}

async function parallelAsyncExecution() {
    clearOutput('#async-output');
    displayOutput('#async-output', 'Запуск параллельного выполнения...', 'loading');
    
    const startTime = Date.now();
    
    try {
        const promises = [
            new Promise(resolve => setTimeout(() => resolve("Задача 1 выполнена"), 1000)),
            new Promise(resolve => setTimeout(() => resolve("Задача 2 выполнена"), 1500)),
            new Promise(resolve => setTimeout(() => resolve("Задача 3 выполнена"), 800))
        ];
        
        const results = await Promise.all(promises);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        displayOutput('#async-output', `✓ Все задачи завершены за ${duration}мс`, 'success');
        results.forEach((result, index) => {
            displayOutput('#async-output', `  ${index + 1}. ${result}`, 'success');
        });
    } catch (error) {
        displayOutput('#async-output', `✗ Ошибка: ${error}`, 'error');
    }
}

function setupAsyncEvents() {
    document.getElementById('basic-async').addEventListener('click', basicAsyncAwait);
    document.getElementById('async-error').addEventListener('click', handleAsyncError);
    document.getElementById('async-parallel').addEventListener('click', parallelAsyncExecution);
}

// ЗАДАНИЕ 3: Работа с внешними API
async function fetchUsers() {
    clearOutput('#api-output');
    clearOutput('#api-data');
    displayOutput('#api-output', 'Загрузка пользователей...', 'loading');
    
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        
        const users = await response.json();
        displayOutput('#api-output', `✓ Загружено ${users.length} пользователей`, 'success');
        
        const apiData = document.getElementById('api-data');
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `
                <h3>${user.name}</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Телефон:</strong> ${user.phone}</p>
                <p><strong>Компания:</strong> ${user.company.name}</p>
                <p><strong>Город:</strong> ${user.address.city}</p>
            `;
            apiData.appendChild(userCard);
        });
    } catch (error) {
        displayOutput('#api-output', `✗ Ошибка загрузки: ${error.message}`, 'error');
    }
}

async function createPost() {
    clearOutput('#api-output');
    displayOutput('#api-output', 'Отправка POST запроса...', 'loading');
    
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: 'Новый пост',
                body: 'Содержание нового поста',
                userId: 1
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        
        const data = await response.json();
        displayOutput('#api-output', '✓ POST запрос успешен!', 'success');
        displayOutput('#api-output', `ID созданного поста: ${data.id}`, 'info');
        displayOutput('#api-output', `Заголовок: ${data.title}`, 'info');
        displayOutput('#api-output', `Содержание: ${data.body}`, 'info');
    } catch (error) {
        displayOutput('#api-output', `✗ Ошибка: ${error.message}`, 'error');
    }
}

async function testApiError() {
    clearOutput('#api-output');
    displayOutput('#api-output', 'Тестирование обработки ошибок API...', 'loading');
    
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/nonexistent');
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        displayOutput('#api-output', `Данные: ${JSON.stringify(data)}`, 'success');
    } catch (error) {
        displayOutput('#api-output', `✗ Поймана ошибка: ${error.message}`, 'error');
        
        if (error.message.includes('Failed to fetch')) {
            displayOutput('#api-output', '⚠ Возможно, проблема с сетью', 'info');
        } else if (error.message.includes('404')) {
            displayOutput('#api-output', '⚠ Ресурс не найден (404)', 'info');
        }
    }
}

function setupApiEvents() {
    document.getElementById('fetch-users').addEventListener('click', fetchUsers);
    document.getElementById('fetch-post').addEventListener('click', createPost);
    document.getElementById('fetch-error').addEventListener('click', testApiError);
}

// ЗАДАНИЕ 4: Асинхронные таймеры
let intervalId;
let intervalCounter = 0;

async function startAsyncInterval() {
    clearOutput('#interval-output');
    displayOutput('#interval-output', 'Запуск асинхронного интервала...', 'loading');
    
    intervalCounter = 0;
    intervalId = setInterval(async () => {
        intervalCounter++;
        const timestamp = new Date().toLocaleTimeString();
        displayOutput('#interval-output', `Интервал #${intervalCounter} - ${timestamp}`, 'info');
        
        if (intervalCounter >= 5) {
            stopAsyncInterval();
            displayOutput('#interval-output', '✓ Интервал автоматически остановлен после 5 выполнений', 'success');
        }
    }, 1000);
}

function stopAsyncInterval() {
    if (intervalId) {
        clearInterval(intervalId);
        displayOutput('#interval-output', '✗ Интервал остановлен', 'error');
        intervalId = null;
    }
}

function delayWithPromise(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`Задержка ${ms}мс завершена`);
        }, ms);
    });
}

async function testDelay() {
    clearOutput('#timer-output');
    displayOutput('#timer-output', 'Тестирование последовательных задержек...', 'loading');
    
    try {
        displayOutput('#timer-output', 'Запуск задержки 500мс...', 'info');
        const result1 = await delayWithPromise(500);
        displayOutput('#timer-output', `✓ ${result1}`, 'success');
        
        displayOutput('#timer-output', 'Запуск задержки 1000мс...', 'info');
        const result2 = await delayWithPromise(1000);
        displayOutput('#timer-output', `✓ ${result2}`, 'success');
        
        displayOutput('#timer-output', 'Запуск задержки 300мс...', 'info');
        const result3 = await delayWithPromise(300);
        displayOutput('#timer-output', `✓ ${result3}`, 'success');
        
        displayOutput('#timer-output', '✓ Все задержки завершены!', 'success');
    } catch (error) {
        displayOutput('#timer-output', `✗ Ошибка: ${error}`, 'error');
    }
}

function setupTimerEvents() {
    document.getElementById('start-interval').addEventListener('click', startAsyncInterval);
    document.getElementById('stop-interval').addEventListener('click', stopAsyncInterval);
    document.getElementById('delay-promise').addEventListener('click', testDelay);
}

// ЗАДАНИЕ 5: Обработка ошибок
async function asyncTryCatch() {
    clearOutput('#error-output');
    displayOutput('#error-output', 'Тестирование вложенных try/catch...', 'loading');
    
    try {
        displayOutput('#error-output', 'Внешний блок: начало', 'info');
        
        try {
            displayOutput('#error-output', 'Внутренний блок: попытка операции 1', 'info');
            await createBasicPromise(true);
            displayOutput('#error-output', 'Внутренний блок: операция 1 успешна', 'success');
        } catch (innerError) {
            displayOutput('#error-output', `Внутренний блок: поймана ошибка - ${innerError}`, 'error');
        }
        
        try {
            displayOutput('#error-output', 'Внутренний блок: попытка операции 2 (с ошибкой)', 'info');
            await createBasicPromise(false);
            displayOutput('#error-output', 'Внутренний блок: операция 2 успешна', 'success');
        } catch (innerError) {
            displayOutput('#error-output', `Внутренний блок: поймана ошибка - ${innerError}`, 'error');
            throw new Error('Проброс ошибки во внешний блок');
        }
        
        displayOutput('#error-output', 'Внешний блок: все операции завершены', 'success');
    } catch (outerError) {
        displayOutput('#error-output', `Внешний блок: поймана ошибка - ${outerError.message}`, 'error');
    }
}

async function handleMultipleErrors() {
    clearOutput('#error-output');
    displayOutput('#error-output', 'Тестирование множественных ошибок...', 'loading');
    
    const promises = [
        createBasicPromise(true),
        createBasicPromise(false),
        createBasicPromise(true),
        createBasicPromise(false),
        createBasicPromise(true)
    ];
    
    const results = await Promise.allSettled(promises);
    
    let fulfilledCount = 0;
    let rejectedCount = 0;
    
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            fulfilledCount++;
            displayOutput('#error-output', `Промис ${index + 1}: ✓ ${result.value}`, 'success');
        } else {
            rejectedCount++;
            displayOutput('#error-output', `Промис ${index + 1}: ✗ ${result.reason}`, 'error');
        }
    });
    
    displayOutput('#error-output', `Статистика: ${fulfilledCount} успешно, ${rejectedCount} с ошибками`, 'info');
}

async function retryWithBackoff(operation, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            displayOutput('#error-output', `Попытка ${attempt}/${maxRetries}...`, 'info');
            const result = await operation();
            displayOutput('#error-output', `✓ Попытка ${attempt} успешна!`, 'success');
            return result;
        } catch (error) {
            lastError = error;
            displayOutput('#error-output', `✗ Попытка ${attempt} failed: ${error}`, 'error');
            
            if (attempt < maxRetries) {
                const delay = Math.pow(2, attempt) * 100;
                displayOutput('#error-output', `Ожидание ${delay}мс перед следующей попыткой...`, 'info');
                await delayWithPromise(delay);
            }
        }
    }
    
    throw new Error(`Все ${maxRetries} попытки не удались. Последняя ошибка: ${lastError}`);
}

async function testRetryPattern() {
    clearOutput('#error-output');
    displayOutput('#error-output', 'Тестирование повторных попыток...', 'loading');
    
    let attemptCount = 0;
    const failingOperation = () => {
        return new Promise((resolve, reject) => {
            attemptCount++;
            if (attemptCount < 3) {
                reject(`Искусственная ошибка на попытке ${attemptCount}`);
            } else {
                resolve("Успех на третьей попытке!");
            }
        });
    };
    
    try {
        const result = await retryWithBackoff(failingOperation, 3);
        displayOutput('#error-output', `✓ Финальный результат: ${result}`, 'success');
    } catch (error) {
        displayOutput('#error-output', `✗ Финальная ошибка: ${error.message}`, 'error');
    }
}

function setupErrorEvents() {
    document.getElementById('try-catch').addEventListener('click', asyncTryCatch);
    document.getElementById('multiple-errors').addEventListener('click', handleMultipleErrors);
    document.getElementById('retry-pattern').addEventListener('click', testRetryPattern);
}

// ЗАДАНИЕ 6: Параллельные операции
async function demonstratePromiseAll() {
    clearOutput('#parallel-output');
    displayOutput('#parallel-output', 'Демонстрация Promise.all...', 'loading');
    
    const startTime = Date.now();
    
    const promises = [
        delayWithPromise(1000).then(() => 'Задача 1 (1000мс)'),
        delayWithPromise(500).then(() => 'Задача 2 (500мс)'),
        delayWithPromise(800).then(() => 'Задача 3 (800мс)'),
        delayWithPromise(1200).then(() => 'Задача 4 (1200мс)'),
        delayWithPromise(300).then(() => 'Задача 5 (300мс)')
    ];
    
    try {
        const results = await Promise.all(promises);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        displayOutput('#parallel-output', `✓ Все задачи завершены за ${duration}мс`, 'success');
        results.forEach((result, index) => {
            displayOutput('#parallel-output', `${index + 1}. ${result}`, 'success');
        });
        displayOutput('#parallel-output', 'Примечание: Promise.all ждет завершения ВСЕХ промисов', 'info');
    } catch (error) {
        displayOutput('#parallel-output', `✗ Ошибка: ${error}`, 'error');
    }
}

async function demonstratePromiseRace() {
    clearOutput('#parallel-output');
    displayOutput('#parallel-output', 'Демонстрация Promise.race...', 'loading');
    
    const promises = [
        delayWithPromise(1000).then(() => 'Медленная задача (1000мс)'),
        delayWithPromise(300).then(() => 'Быстрая задача (300мс)'),
        delayWithPromise(500).then(() => 'Средняя задача (500мс)')
    ];
    
    try {
        const winner = await Promise.race(promises);
        displayOutput('#parallel-output', `✓ Победитель гонки: ${winner}`, 'success');
        displayOutput('#parallel-output', 'Примечание: Promise.race возвращает первый завершенный промис', 'info');
    } catch (error) {
        displayOutput('#parallel-output', `✗ Ошибка: ${error}`, 'error');
    }
}

async function demonstratePromiseAllSettled() {
    clearOutput('#parallel-output');
    displayOutput('#parallel-output', 'Демонстрация Promise.allSettled...', 'loading');
    
    const promises = [
        createBasicPromise(true),
        createBasicPromise(false),
        delayWithPromise(500).then(() => 'Успешная задержка'),
        createBasicPromise(true),
        createBasicPromise(false)
    ];
    
    const results = await Promise.allSettled(promises);
    
    displayOutput('#parallel-output', 'Результаты Promise.allSettled:', 'info');
    
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            displayOutput('#parallel-output', `Промис ${index + 1}: ✓ ${result.value}`, 'success');
        } else {
            displayOutput('#parallel-output', `Промис ${index + 1}: ✗ ${result.reason}`, 'error');
        }
    });
    
    const fulfilledCount = results.filter(r => r.status === 'fulfilled').length;
    const rejectedCount = results.filter(r => r.status === 'rejected').length;
    
    displayOutput('#parallel-output', `Итого: ${fulfilledCount} успешно, ${rejectedCount} с ошибками`, 'info');
}

function setupParallelEvents() {
    document.getElementById('promise-all').addEventListener('click', demonstratePromiseAll);
    document.getElementById('promise-race').addEventListener('click', demonstratePromiseRace);
    document.getElementById('promise-allSettled').addEventListener('click', demonstratePromiseAllSettled);
}

// ЗАДАНИЕ 7: Реальные сценарии
async function sequentialApiRequests() {
    clearOutput('#scenario-output');
    displayOutput('#scenario-output', 'Запуск последовательных API запросов...', 'loading');
    
    try {
        displayOutput('#scenario-output', '1. Получение пользователя...', 'info');
        const userResponse = await fetch('https://jsonplaceholder.typicode.com/users/1');
        const user = await userResponse.json();
        displayOutput('#scenario-output', `✓ Пользователь: ${user.name}`, 'success');
        
        displayOutput('#scenario-output', '2. Получение постов пользователя...', 'info');
        const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/users/1/posts`);
        const posts = await postsResponse.json();
        displayOutput('#scenario-output', `✓ Найдено постов: ${posts.length}`, 'success');
        
        if (posts.length > 0) {
            displayOutput('#scenario-output', '3. Получение комментариев к первому посту...', 'info');
            const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${posts[0].id}/comments`);
            const comments = await commentsResponse.json();
            displayOutput('#scenario-output', `✓ Найдено комментариев: ${comments.length}`, 'success');
            
            displayOutput('#scenario-output', '✓ Все последовательные запросы завершены!', 'success');
            displayOutput('#scenario-output', `Первый пост: "${posts[0].title}"`, 'info');
            displayOutput('#scenario-output', `Комментарии: ${comments.length} шт.`, 'info');
        }
    } catch (error) {
        displayOutput('#scenario-output', `✗ Ошибка в цепочке запросов: ${error.message}`, 'error');
    }
}

async function simulateFileUpload() {
    clearOutput('#scenario-output');
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = '0%';
    
    displayOutput('#scenario-output', 'Симуляция загрузки файла...', 'loading');
    
    return new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                displayOutput('#scenario-output', '✓ Загрузка завершена!', 'success');
                resolve();
            }
            
            progressBar.style.width = `${progress}%`;
            displayOutput('#scenario-output', `Прогресс загрузки: ${Math.round(progress)}%`, 'info');
        }, 200);
    });
}

function createRequestCache() {
    const cache = new Map();
    
    return async function cachedRequest(url) {
        if (cache.has(url)) {
            displayOutput('#scenario-output', `✓ Данные из кэша: ${url}`, 'success');
            return cache.get(url);
        }
        
        displayOutput('#scenario-output', `Загрузка данных: ${url}`, 'info');
        try {
            const response = await fetch(url);
            const data = await response.json();
            cache.set(url, data);
            displayOutput('#scenario-output', `✓ Данные загружены и сохранены в кэш: ${url}`, 'success');
            return data;
        } catch (error) {
            displayOutput('#scenario-output', `✗ Ошибка загрузки: ${url}`, 'error');
            throw error;
        }
    };
}

async function testCacheRequests() {
    clearOutput('#scenario-output');
    displayOutput('#scenario-output', 'Тестирование кэширования запросов...', 'loading');
    
    const cachedRequest = createRequestCache();
    const testUrl = 'https://jsonplaceholder.typicode.com/users/1';
    
    try {
        displayOutput('#scenario-output', '--- Первый запрос (должен загрузить) ---', 'info');
        const data1 = await cachedRequest(testUrl);
        displayOutput('#scenario-output', `Пользователь: ${data1.name}`, 'info');
        
        displayOutput('#scenario-output', '--- Второй запрос (должен быть из кэша) ---', 'info');
        const data2 = await cachedRequest(testUrl);
        displayOutput('#scenario-output', `Пользователь: ${data2.name}`, 'info');
        
        displayOutput('#scenario-output', '--- Третий запрос (должен быть из кэша) ---', 'info');
        const data3 = await cachedRequest(testUrl);
        displayOutput('#scenario-output', `Пользователь: ${data3.name}`, 'info');
        
        displayOutput('#scenario-output', '✓ Тест кэширования завершен!', 'success');
    } catch (error) {
        displayOutput('#scenario-output', `✗ Ошибка: ${error.message}`, 'error');
    }
}

function setupRealScenarioEvents() {
    document.getElementById('sequential-requests').addEventListener('click', sequentialApiRequests);
    document.getElementById('upload-simulation').addEventListener('click', simulateFileUpload);
    document.getElementById('cache-requests').addEventListener('click', testCacheRequests);
}

// ИНИЦИАЛИЗАЦИЯ ВСЕХ ОБРАБОТЧИКОВ
document.addEventListener('DOMContentLoaded', function() {
    setupPromiseEvents();
    setupAsyncEvents();
    setupApiEvents();
    setupTimerEvents();
    setupErrorEvents();
    setupParallelEvents();
    setupRealScenarioEvents();
    
    displayOutput('#promise-output', 'Готов к работе! Нажмите любую кнопку для начала тестирования.', 'info');
    console.log('Все обработчики событий инициализированы');
});