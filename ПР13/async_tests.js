// Тесты для асинхронных операций
class AsyncTests {
    constructor() {
        this.tests = [];
        this.results = [];
    }

    describe(name, fn) {
        this.tests.push({ name, fn });
    }

    async run() {
        console.log('🚀 Запуск тестов асинхронных операций...\n');
        
        for (const test of this.tests) {
            try {
                await test.fn();
                console.log(`✓ ${test.name}`);
                this.results.push({ name: test.name, status: 'passed' });
            } catch (error) {
                console.log(`✗ ${test.name}`);
                console.log(`  Ошибка: ${error.message}`);
                this.results.push({ name: test.name, status: 'failed', error: error.message });
            }
        }
        
        this.printSummary();
    }

    printSummary() {
        console.log('\n📊 Результаты тестирования:');
        const passed = this.results.filter(r => r.status === 'passed').length;
        const failed = this.results.filter(r => r.status === 'failed').length;
        
        console.log(`✓ Пройдено: ${passed}`);
        console.log(`✗ Провалено: ${failed}`);
        console.log(`📈 Общий результат: ${passed}/${this.tests.length}`);
        
        if (failed > 0) {
            console.log('\nПодробности ошибок:');
            this.results.filter(r => r.status === 'failed').forEach(test => {
                console.log(`  - ${test.name}: ${test.error}`);
            });
        }
    }

    // Вспомогательные методы для тестирования
    expect(value) {
        return {
            toBe: (expected) => {
                if (value !== expected) {
                    throw new Error(`Ожидалось ${expected}, получено ${value}`);
                }
            },
            toBeGreaterThan: (min) => {
                if (value <= min) {
                    throw new Error(`Ожидалось значение больше ${min}, получено ${value}`);
                }
            },
            toBeLessThan: (max) => {
                if (value >= max) {
                    throw new Error(`Ожидалось значение меньше ${max}, получено ${value}`);
                }
            },
            toContain: (item) => {
                if (!value.includes(item)) {
                    throw new Error(`Ожидалось, что массив содержит ${item}`);
                }
            }
        };
    }

    async testAsyncOperation(operation, timeout = 5000) {
        return Promise.race([
            operation(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Таймаут операции')), timeout)
            )
        ]);
    }
}

// Создаем экземпляр тестов
const tests = new AsyncTests();

// Тесты для базовых промисов
tests.describe('createBasicPromise должен разрешаться при shouldResolve=true', async () => {
    const result = await tests.testAsyncOperation(() => createBasicPromise(true));
    tests.expect(result).toContain('Успех');
});

tests.describe('createBasicPromise должен отклоняться при shouldResolve=false', async () => {
    try {
        await tests.testAsyncOperation(() => createBasicPromise(false));
        throw new Error('Промис должен был быть отклонен');
    } catch (error) {
        tests.expect(error).toContain('Ошибка');
    }
});

// Тесты для задержек
tests.describe('delayWithPromise должен создавать корректную задержку', async () => {
    const startTime = Date.now();
    await tests.testAsyncOperation(() => delayWithPromise(100));
    const duration = Date.now() - startTime;
    tests.expect(duration).toBeGreaterThan(90);
    tests.expect(duration).toBeLessThan(200);
});

// Тесты для работы с API
tests.describe('fetchUsers должен получать данные пользователей', async () => {
    // Мокаем fetch для тестов
    const originalFetch = window.fetch;
    window.fetch = jest.fn(() => 
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ id: 1, name: 'Test User' }])
        })
    );

    try {
        await tests.testAsyncOperation(fetchUsers);
        // Если не произошло ошибки, тест пройден
    } finally {
        window.fetch = originalFetch;
    }
});

// Тесты для обработки ошибок
tests.describe('retryWithBackoff должен повторять попытки', async () => {
    let attempts = 0;
    const failingOperation = () => {
        attempts++;
        if (attempts < 3) {
            return Promise.reject('Временная ошибка');
        }
        return Promise.resolve('Успех');
    };

    const result = await tests.testAsyncOperation(() => retryWithBackoff(failingOperation, 3));
    tests.expect(result).toBe('Успех');
    tests.expect(attempts).toBe(3);
});

// Тесты для параллельных операций
tests.describe('Promise.all должен ждать все промисы', async () => {
    const startTime = Date.now();
    const promises = [
        delayWithPromise(100),
        delayWithPromise(50),
        delayWithPromise(75)
    ];
    
    await tests.testAsyncOperation(() => Promise.all(promises));
    const duration = Date.now() - startTime;
    tests.expect(duration).toBeGreaterThan(90);
});

tests.describe('Promise.race должен возвращать первый завершенный', async () => {
    const promises = [
        delayWithPromise(100).then(() => 'медленный'),
        delayWithPromise(10).then(() => 'быстрый')
    ];
    
    const result = await tests.testAsyncOperation(() => Promise.race(promises));
    tests.expect(result).toBe('быстрый');
});

// Тесты для кэширования
tests.describe('createRequestCache должен кэшировать запросы', async () => {
    let fetchCount = 0;
    const originalFetch = window.fetch;
    
    window.fetch = jest.fn(() => {
        fetchCount++;
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: 'test' })
        });
    });

    try {
        const cachedRequest = createRequestCache();
        const url = 'https://example.com/data';
        
        // Первый запрос
        await tests.testAsyncOperation(() => cachedRequest(url));
        
        // Второй запрос - должен быть из кэша
        await tests.testAsyncOperation(() => cachedRequest(url));
        
        tests.expect(fetchCount).toBe(1);
    } finally {
        window.fetch = originalFetch;
    }
});

// Запуск тестов при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Создаем кнопку для запуска тестов
    const testButton = document.createElement('button');
    testButton.textContent = 'Запустить тесты';
    testButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        background-color: #27ae60;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
    `;
    
    testButton.addEventListener('click', () => {
        tests.run();
    });
    
    document.body.appendChild(testButton);
});

// Mock функция для Jest (если Jest не доступен)
if (typeof jest === 'undefined') {
    window.jest = {
        fn: (implementation) => implementation || (() => {})
    };
}

console.log('🧪 Тесты асинхронных операций загружены. Нажмите кнопку "Запустить тесты" в правом верхнем углу.');