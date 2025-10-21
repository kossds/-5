// Тесты для Fetch API функций
class FetchAPITests {
    constructor() {
        this.tests = [];
        this.results = [];
    }
    
    // Вспомогательные методы для тестирования
    async runTests() {
        console.log('Запуск тестов Fetch API...');
        
        for (const test of this.tests) {
            try {
                await test.func.call(this);
                this.results.push({ name: test.name, status: 'PASS' });
                console.log(`✅ ${test.name}`);
            } catch (error) {
                this.results.push({ 
                    name: test.name, 
                    status: 'FAIL', 
                    error: error.message 
                });
                console.log(`❌ ${test.name}: ${error.message}`);
            }
        }
        
        this.displayResults();
    }
    
    displayResults() {
        const passed = this.results.filter(r => r.status === 'PASS').length;
        const failed = this.results.filter(r => r.status === 'FAIL').length;
        
        console.log(`\n=== РЕЗУЛЬТАТЫ ТЕСТОВ ===`);
        console.log(`Пройдено: ${passed}`);
        console.log(`Провалено: ${failed}`);
        console.log(`Общее: ${this.tests.length}`);
        
        this.results.forEach(result => {
            if (result.status === 'FAIL') {
                console.log(`Провален: ${result.name} - ${result.error}`);
            }
        });
    }
    
    addTest(name, testFunction) {
        this.tests.push({ name, func: testFunction });
    }
    
    // Тестовые функции
    async testFetchGetRequest() {
        // Мокаем fetch
        const originalFetch = window.fetch;
        let fetchCalled = false;
        
        window.fetch = async (url) => {
            fetchCalled = true;
            if (url === 'https://jsonplaceholder.typicode.com/posts/1') {
                return {
                    ok: true,
                    status: 200,
                    json: async () => ({ id: 1, title: 'Test Post' })
                };
            }
            throw new Error('URL не совпадает');
        };
        
        try {
            await fetchGetRequest();
            if (!fetchCalled) {
                throw new Error('Fetch не был вызван');
            }
        } finally {
            window.fetch = originalFetch;
        }
    }
    
    async testFetchPostRequest() {
        const originalFetch = window.fetch;
        let fetchCalled = false;
        
        window.fetch = async (url, options) => {
            fetchCalled = true;
            
            if (url !== 'https://jsonplaceholder.typicode.com/posts') {
                throw new Error('Неверный URL для POST запроса');
            }
            
            if (options.method !== 'POST') {
                throw new Error('Метод должен быть POST');
            }
            
            if (options.headers['Content-Type'] !== 'application/json') {
                throw new Error('Content-Type должен быть application/json');
            }
            
            return {
                ok: true,
                status: 201,
                json: async () => JSON.parse(options.body)
            };
        };
        
        try {
            await fetchPostRequest();
            if (!fetchCalled) {
                throw new Error('Fetch не был вызван для POST запроса');
            }
        } finally {
            window.fetch = originalFetch;
        }
    }
    
    async testFetchWithErrorHandling() {
        const originalFetch = window.fetch;
        
        window.fetch = async () => {
            return {
                ok: false,
                status: 404,
                statusText: 'Not Found'
            };
        };
        
        try {
            await fetchWithError();
            // Если не выброшено исключение, тест провален
            throw new Error('Ожидалась ошибка, но её не было');
        } catch (error) {
            // Ожидаемое поведение
        } finally {
            window.fetch = originalFetch;
        }
    }
    
    async testFetchWithTimeout() {
        const originalFetch = window.fetch;
        const originalAbortController = window.AbortController;
        
        let abortCalled = false;
        
        window.AbortController = class MockAbortController {
            constructor() {
                this.signal = { aborted: false };
                this.abort = () => {
                    abortCalled = true;
                    this.signal.aborted = true;
                };
            }
        };
        
        window.fetch = async () => {
            // Имитируем долгий запрос
            await new Promise(resolve => setTimeout(resolve, 4000));
            return { ok: true };
        };
        
        try {
            await fetchWithTimeout();
            if (!abortCalled) {
                throw new Error('AbortController не был вызван');
            }
        } finally {
            window.fetch = originalFetch;
            window.AbortController = originalAbortController;
        }
    }
    
    async testCreateFetchCache() {
        const cachedFetch = createFetchCache();
        let fetchCount = 0;
        const originalFetch = window.fetch;
        
        window.fetch = async () => {
            fetchCount++;
            return {
                ok: true,
                json: async () => ({ data: 'test' })
            };
        };
        
        try {
            // Первый вызов
            await cachedFetch('https://test.com/api');
            // Второй вызов - должен быть из кэша
            await cachedFetch('https://test.com/api');
            
            if (fetchCount !== 1) {
                throw new Error(`Кэширование не работает. Fetch вызван ${fetchCount} раз вместо 1`);
            }
        } finally {
            window.fetch = originalFetch;
        }
    }
    
    async testFetchWithRetry() {
        let attemptCount = 0;
        const originalFetch = window.fetch;
        
        window.fetch = async () => {
            attemptCount++;
            if (attemptCount < 3) {
                return { ok: false, status: 500 };
            }
            return {
                ok: true,
                json: async () => ({ success: true })
            };
        };
        
        try {
            await fetchWithRetry('https://test.com/api', {}, 3);
            if (attemptCount !== 3) {
                throw new Error(`Было ${attemptCount} попыток вместо 3`);
            }
        } finally {
            window.fetch = originalFetch;
        }
    }
    
    // Запуск всех тестов
    setupAllTests() {
        this.addTest('GET запрос', () => this.testFetchGetRequest());
        this.addTest('POST запрос', () => this.testFetchPostRequest());
        this.addTest('Обработка ошибок', () => this.testFetchWithErrorHandling());
        this.addTest('Таймаут запроса', () => this.testFetchWithTimeout());
        this.addTest('Кэширование запросов', () => this.testCreateFetchCache());
        this.addTest('Повторные попытки', () => this.testFetchWithRetry());
    }
}

// Запуск тестов при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const testRunner = new FetchAPITests();
    testRunner.setupAllTests();
    
    // Добавляем кнопку для запуска тестов
    const testButton = document.createElement('button');
    testButton.textContent = 'Запустить тесты';
    testButton.style.margin = '20px 0';
    testButton.style.padding = '10px 20px';
    testButton.style.backgroundColor = '#27ae60';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '5px';
    testButton.style.cursor = 'pointer';
    
    testButton.addEventListener('click', () => {
        testRunner.runTests();
    });
    
    document.querySelector('.container').appendChild(testButton);
});