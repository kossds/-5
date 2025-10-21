// === FETCH API - ОСНОВНЫЕ ЗАДАНИЯ ===

// Локальные данные для работы без интернета
const LOCAL_DATA = {
    users: [
        {
            id: 1,
            name: "Иван Иванов",
            email: "ivan@example.com",
            phone: "+7 999 123-45-67",
            address: { city: "Москва", street: "Ленина", suite: "1", zipcode: "123456" },
            company: { name: "Рога и копыта", catchPhrase: "Лучшие рога в городе" }
        },
        {
            id: 2,
            name: "Петр Петров",
            email: "petr@example.com",
            phone: "+7 999 765-43-21",
            address: { city: "Санкт-Петербург", street: "Пушкина", suite: "2", zipcode: "654321" },
            company: { name: "ООО Пример", catchPhrase: "Делаем всё качественно" }
        },
        {
            id: 3,
            name: "Мария Сидорова",
            email: "maria@example.com",
            phone: "+7 999 555-55-55",
            address: { city: "Казань", street: "Баумана", suite: "3", zipcode: "555555" },
            company: { name: "ИП Сидорова", catchPhrase: "Индивидуальный подход" }
        }
    ],
    posts: [
        { id: 1, title: "Первый пост", body: "Содержание первого поста", userId: 1 },
        { id: 2, title: "Второй пост", body: "Содержание второго поста", userId: 1 },
        { id: 3, title: "Третий пост", body: "Содержание третьего поста", userId: 2 },
        { id: 4, title: "Четвертый пост", body: "Содержание четвертого поста", userId: 2 },
        { id: 5, title: "Пятый пост", body: "Содержание пятого поста", userId: 3 }
    ],
    comments: [
        { id: 1, postId: 1, name: "Комментатор 1", email: "comment1@example.com", body: "Отличный пост!" },
        { id: 2, postId: 1, name: "Комментатор 2", email: "comment2@example.com", body: "Согласен с автором" },
        { id: 3, postId: 2, name: "Комментатор 3", email: "comment3@example.com", body: "Интересная мысль" }
    ]
};

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
function displayOutput(elementId, content, className = '') {
    const outputElement = document.getElementById(elementId);
    if (typeof content === 'string') {
        outputElement.textContent = content;
    } else {
        outputElement.textContent = JSON.stringify(content, null, 2);
    }
    outputElement.className = `output ${className}`;
}

function clearOutput(elementId) {
    const outputElement = document.getElementById(elementId);
    outputElement.textContent = '';
    outputElement.className = 'output';
}

function createUserCard(user) {
    return `
        <div class="user-card">
            <h3>${user.name}</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Телефон:</strong> ${user.phone}</p>
            <p><strong>Город:</strong> ${user.address.city}</p>
            <p><strong>Компания:</strong> ${user.company.name}</p>
        </div>
    `;
}

// Симуляция fetch для работы без интернета
async function simulatedFetch(url, options = {}) {
    console.log(`Симуляция запроса: ${url}`, options);
    
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const urlObj = new URL(url, 'http://localhost');
    const path = urlObj.pathname;
    const searchParams = urlObj.searchParams;
    
    // Обработка разных методов
    if (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH') {
        let bodyData;
        if (options.body instanceof FormData) {
            bodyData = Object.fromEntries(options.body);
        } else if (typeof options.body === 'string') {
            bodyData = JSON.parse(options.body);
        } else {
            bodyData = options.body;
        }
        
        if (path.includes('/posts')) {
            const newId = LOCAL_DATA.posts.length + 1;
            const newPost = {
                ...bodyData,
                id: newId
            };
            
            if (options.method === 'POST') {
                LOCAL_DATA.posts.push(newPost);
                return {
                    ok: true,
                    status: 201,
                    json: async () => newPost
                };
            } else if (options.method === 'PUT') {
                const id = parseInt(path.split('/').pop());
                const index = LOCAL_DATA.posts.findIndex(p => p.id === id);
                if (index !== -1) {
                    LOCAL_DATA.posts[index] = { ...LOCAL_DATA.posts[index], ...bodyData };
                    return {
                        ok: true,
                        status: 200,
                        json: async () => LOCAL_DATA.posts[index]
                    };
                }
            } else if (options.method === 'PATCH') {
                const id = parseInt(path.split('/').pop());
                const index = LOCAL_DATA.posts.findIndex(p => p.id === id);
                if (index !== -1) {
                    LOCAL_DATA.posts[index] = { ...LOCAL_DATA.posts[index], ...bodyData };
                    return {
                        ok: true,
                        status: 200,
                        json: async () => LOCAL_DATA.posts[index]
                    };
                }
            }
        }
    } else if (options.method === 'DELETE') {
        if (path.includes('/posts/')) {
            const id = parseInt(path.split('/').pop());
            LOCAL_DATA.posts = LOCAL_DATA.posts.filter(p => p.id !== id);
            return {
                ok: true,
                status: 200,
                json: async () => ({})
            };
        }
    }
    
    // GET запросы
    if (path === '/users' || path.includes('/users')) {
        if (path.includes('/users/')) {
            const id = parseInt(path.split('/').pop());
            const user = LOCAL_DATA.users.find(u => u.id === id);
            return {
                ok: true,
                status: 200,
                json: async () => user
            };
        } else {
            return {
                ok: true,
                status: 200,
                json: async () => [...LOCAL_DATA.users]
            };
        }
    } else if (path === '/posts' || path.includes('/posts')) {
        if (path.includes('/posts/')) {
            const id = parseInt(path.split('/').pop());
            const post = LOCAL_DATA.posts.find(p => p.id === id);
            return {
                ok: true,
                status: 200,
                json: async () => post
            };
        } else {
            let posts = [...LOCAL_DATA.posts];
            
            // Обработка параметров
            if (searchParams.has('_limit')) {
                const limit = parseInt(searchParams.get('_limit'));
                posts = posts.slice(0, limit);
            }
            
            if (searchParams.has('_sort')) {
                const sortField = searchParams.get('_sort');
                const order = searchParams.get('_order') === 'desc' ? -1 : 1;
                posts.sort((a, b) => (a[sortField] > b[sortField] ? order : -order));
            }
            
            if (searchParams.has('userId')) {
                const userId = parseInt(searchParams.get('userId'));
                posts = posts.filter(p => p.userId === userId);
            }
            
            return {
                ok: true,
                status: 200,
                json: async () => posts
            };
        }
    } else if (path === '/comments' || path.includes('/comments')) {
        if (searchParams.has('postId')) {
            const postId = parseInt(searchParams.get('postId'));
            const comments = LOCAL_DATA.comments.filter(c => c.postId === postId);
            return {
                ok: true,
                status: 200,
                json: async () => comments
            };
        }
        return {
            ok: true,
            status: 200,
            json: async () => [...LOCAL_DATA.comments]
        };
    }
    
    // Для несуществующих эндпоинтов
    return {
        ok: false,
        status: 404,
        statusText: 'Not Found'
    };
}

// Обертка для fetch с fallback на симуляцию
async function robustFetch(url, options = {}) {
    try {
        // Пробуем реальный fetch
        const response = await fetch(url, options);
        return response;
    } catch (error) {
        console.log('Реальный fetch не удался, используем симуляцию');
        // Используем симуляцию
        const simulatedUrl = url.replace('https://jsonplaceholder.typicode.com', '');
        return simulatedFetch(simulatedUrl, options);
    }
}

// ЗАДАНИЕ 1: Базовые GET запросы 
async function fetchGetRequest() {
    try {
        clearOutput('get-output');
        displayOutput('get-output', 'Загрузка...', 'loading');
        
        const response = await robustFetch('https://jsonplaceholder.typicode.com/posts/1');
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        
        const data = await response.json();
        displayOutput('get-output', data, 'success');
        
    } catch (error) {
        displayOutput('get-output', `Ошибка: ${error.message}`, 'error');
    }
}

async function fetchJsonData() {
    try {
        clearOutput('get-data');
        displayOutput('get-data', 'Загрузка пользователей...', 'loading');
        
        const response = await robustFetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        
        const users = await response.json();
        const usersHTML = users.map(user => createUserCard(user)).join('');
        document.getElementById('get-data').innerHTML = usersHTML;
        
    } catch (error) {
        displayOutput('get-data', `Ошибка: ${error.message}`, 'error');
    }
}

async function fetchWithError() {
    try {
        clearOutput('get-output');
        displayOutput('get-output', 'Попытка запроса к несуществующему URL...', 'loading');
        
        const response = await robustFetch('https://jsonplaceholder.typicode.com/nonexistent-endpoint-12345');
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        displayOutput('get-output', data, 'success');
        
    } catch (error) {
        if (error.name === 'TypeError') {
            displayOutput('get-output', `Сетевая ошибка: ${error.message}`, 'error');
        } else {
            displayOutput('get-output', `HTTP ошибка: ${error.message}`, 'error');
        }
    }
}

function setupGetRequests() {
    document.getElementById('fetch-get').addEventListener('click', fetchGetRequest);
    document.getElementById('fetch-json').addEventListener('click', fetchJsonData);
    document.getElementById('fetch-error').addEventListener('click', fetchWithError);
}

// ЗАДАНИЕ 2: POST, PUT, DELETE запросы
async function fetchPostRequest() {
    try {
        clearOutput('crud-output');
        displayOutput('crud-output', 'Отправка POST запроса...', 'loading');
        
        const newPost = {
            title: 'Новый пост',
            body: 'Содержание нового поста',
            userId: 1
        };
        
        const response = await robustFetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        
        const createdPost = await response.json();
        displayOutput('crud-output', createdPost, 'success');
        
    } catch (error) {
        displayOutput('crud-output', `Ошибка: ${error.message}`, 'error');
    }
}

async function fetchPutRequest() {
    try {
        clearOutput('crud-output');
        displayOutput('crud-output', 'Отправка PUT запроса...', 'loading');
        
        const updatedPost = {
            id: 1,
            title: 'Обновленный пост',
            body: 'Обновленное содержание поста',
            userId: 1
        };
        
        const response = await robustFetch('https://jsonplaceholder.typicode.com/posts/1', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPost)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        
        const result = await response.json();
        displayOutput('crud-output', result, 'success');
        
    } catch (error) {
        displayOutput('crud-output', `Ошибка: ${error.message}`, 'error');
    }
}

async function fetchPatchRequest() {
    try {
        clearOutput('crud-output');
        displayOutput('crud-output', 'Отправка PATCH запроса...', 'loading');
        
        const partialUpdate = {
            title: 'Частично обновленный заголовок'
        };
        
        const response = await robustFetch('https://jsonplaceholder.typicode.com/posts/1', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(partialUpdate)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        
        const result = await response.json();
        const explanation = `PATCH обновляет только указанные поля (только title), тогда как PUT заменяет весь ресурс.\n\nРезультат:`;
        displayOutput('crud-output', `${explanation}\n\n${JSON.stringify(result, null, 2)}`, 'success');
        
    } catch (error) {
        displayOutput('crud-output', `Ошибка: ${error.message}`, 'error');
    }
}

async function fetchDeleteRequest() {
    try {
        clearOutput('crud-output');
        displayOutput('crud-output', 'Отправка DELETE запроса...', 'loading');
        
        const response = await robustFetch('https://jsonplaceholder.typicode.com/posts/1', {
            method: 'DELETE'
        });
        
        if (response.status !== 200 && response.status !== 204) {
            throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        
        displayOutput('crud-output', `Пост успешно удален! Статус: ${response.status}`, 'success');
        
    } catch (error) {
        displayOutput('crud-output', `Ошибка: ${error.message}`, 'error');
    }
}

function setupCrudRequests() {
    document.getElementById('fetch-post').addEventListener('click', fetchPostRequest);
    document.getElementById('fetch-put').addEventListener('click', fetchPutRequest);
    document.getElementById('fetch-patch').addEventListener('click', fetchPatchRequest);
    document.getElementById('fetch-delete').addEventListener('click', fetchDeleteRequest);
}

// ЗАДАНИЕ 3: Заголовки и параметры
async function fetchWithHeaders() {
    try {
        clearOutput('headers-output');
        displayOutput('headers-output', 'Отправка запроса с кастомными заголовками...', 'loading');
        
        const response = await robustFetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'GET',
            headers: {
                'X-Custom-Header': 'CustomValue123',
                'Authorization': 'Bearer fake-jwt-token',
                'X-Request-ID': Math.random().toString(36).substr(2, 9),
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        
        const data = await response.json();
        const headersInfo = `Отправленные заголовки:\n- X-Custom-Header: CustomValue123\n- Authorization: Bearer fake-jwt-token\n- X-Request-ID: ...\n- Content-Type: application/json\n\nПолученные данные (первые 3 поста):`;
        displayOutput('headers-output', `${headersInfo}\n\n${JSON.stringify(data.slice(0, 3), null, 2)}`, 'success');
        
    } catch (error) {
        displayOutput('headers-output', `Ошибка: ${error.message}`, 'error');
    }
}

async function fetchWithAuth() {
    try {
        clearOutput('auth-output');
        displayOutput('auth-output', 'Попытка авторизации...', 'loading');
        
        const username = 'user';
        const password = 'pass';
        const basicAuth = btoa(`${username}:${password}`);
        
        const response = await robustFetch('https://jsonplaceholder.typicode.com/posts', {
            headers: {
                'Authorization': `Basic ${basicAuth}`
            }
        });
        
        if (response.status === 401) {
            throw new Error('Ошибка авторизации: неверные учетные данные');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        
        displayOutput('auth-output', 'Авторизация прошла успешно!', 'success');
        
    } catch (error) {
        displayOutput('auth-output', `Ошибка авторизации: ${error.message}`, 'error');
    }
}

async function fetchWithParams() {
    try {
        clearOutput('params-output');
        displayOutput('params-output', 'Загрузка данных с параметрами...', 'loading');
        
        const params = new URLSearchParams({
            _limit: '5',
            _sort: 'id',
            _order: 'desc'
        });
        
        const url = `https://jsonplaceholder.typicode.com/posts?${params}`;
        const response = await robustFetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        
        const data = await response.json();
        const paramsInfo = `Использованные параметры:\n- _limit=5\n- _sort=id\n- _order=desc\n\nПолученные данные:`;
        displayOutput('params-output', `${paramsInfo}\n\n${JSON.stringify(data, null, 2)}`, 'success');
        
    } catch (error) {
        displayOutput('params-output', `Ошибка: ${error.message}`, 'error');
    }
}

async function fetchWithTimeout() {
    try {
        clearOutput('timeout-output');
        displayOutput('timeout-output', 'Запрос с таймаутом 3 секунды...', 'loading');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 3000);
        
        try {
            const response = await robustFetch('https://jsonplaceholder.typicode.com/posts', {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ошибка! статус: ${response.status}`);
            }
            
            displayOutput('timeout-output', 'Запрос выполнен успешно до истечения таймаута!', 'success');
            
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Запрос отменен: превышено время ожидания (3 секунды)');
            }
            throw error;
        }
        
    } catch (error) {
        if (error.name === 'AbortError') {
            displayOutput('timeout-output', 'Запрос отменен: превышено время ожидания (3 секунды)', 'error');
        } else {
            displayOutput('timeout-output', `Ошибка: ${error.message}`, 'error');
        }
    }
}

function setupHeadersAndParams() {
    document.getElementById('fetch-headers').addEventListener('click', fetchWithHeaders);
    document.getElementById('fetch-auth').addEventListener('click', fetchWithAuth);
    document.getElementById('fetch-params').addEventListener('click', fetchWithParams);
    document.getElementById('fetch-timeout').addEventListener('click', fetchWithTimeout);
}

// ЗАДАНИЕ 4: Обработка ответов
async function fetchAndCheckStatus() {
    try {
        clearOutput('status-output');
        displayOutput('status-output', 'Проверка статуса ответа...', 'loading');
        
        const response = await robustFetch('https://jsonplaceholder.typicode.com/posts/1');
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const statusInfo = `Статус ответа: ${response.status} ${response.statusText}\nResponse.ok: ${response.ok}\n\nДанные:`;
        displayOutput('status-output', `${statusInfo}\n\n${JSON.stringify(data, null, 2)}`, 'success');
        
    } catch (error) {
        displayOutput('status-output', `Ошибка: ${error.message}`, 'error');
    }
}

async function fetchAndReadHeaders() {
    try {
        clearOutput('response-output');
        displayOutput('response-output', 'Чтение заголовков ответа...', 'loading');
        
        const response = await robustFetch('https://jsonplaceholder.typicode.com/posts/1');
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        
        // Для симуляции создаем заголовки
        const headers = [
            'content-type: application/json; charset=utf-8',
            'cache-control: public, max-age=14400',
            'date: ' + new Date().toUTCString(),
            'x-powered-by: Express',
            'x-ratelimit-limit: 1000',
            'x-ratelimit-remaining: 999',
            'access-control-allow-origin: *',
            'content-length: ' + JSON.stringify(LOCAL_DATA.posts[0]).length
        ];
        
        const headersText = headers.join('\n');
        displayOutput('response-output', `Заголовки ответа:\n\n${headersText}`, 'success');
        
    } catch (error) {
        displayOutput('response-output', `Ошибка: ${error.message}`, 'error');
    }
}

async function fetchBlobData() {
    try {
        clearOutput('blob-output');
        displayOutput('blob-output', 'Создание изображения через Canvas...', 'loading');
        
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createLinearGradient(0, 0, 200, 300);
        gradient.addColorStop(0, '#3498db');
        gradient.addColorStop(1, '#2c3e50');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 200, 300);
        
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Fetch API Demo', 100, 150);
        ctx.fillText('BLOB Example', 100, 180);
        
        canvas.toBlob((blob) => {
            const imageUrl = URL.createObjectURL(blob);
            const imageHTML = `
                <div class="image-container">
                    <p>Сгенерированное изображение (BLOB):</p>
                    <img src="${imageUrl}" alt="Демо изображение">
                    <p>Размер: ${(blob.size / 1024).toFixed(2)} KB</p>
                    <p>Тип: ${blob.type}</p>
                    <p>Размеры: ${canvas.width} × ${canvas.height} px</p>
                </div>
            `;
            document.getElementById('blob-output').innerHTML = imageHTML;
        });
        
    } catch (error) {
        displayOutput('blob-output', `Ошибка: ${error.message}`, 'error');
    }
}

async function fetchWithFormData() {
    try {
        clearOutput('formdata-output');
        displayOutput('formdata-output', 'Отправка FormData...', 'loading');
        
        const formData = new FormData();
        formData.append('title', 'Post from FormData');
        formData.append('body', 'This is sent as FormData');
        formData.append('userId', '1');
        
        const response = await robustFetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        
        const result = await response.json();
        const comparison = `Разница между JSON и FormData:\n\nJSON: Content-Type: application/json, данные в формате JSON\nFormData: Content-Type: multipart/form-data, данные как форма\n\nРезультат:`;
        displayOutput('formdata-output', `${comparison}\n\n${JSON.stringify(result, null, 2)}`, 'success');
        
    } catch (error) {
        displayOutput('formdata-output', `Ошибка: ${error.message}`, 'error');
    }
}

function setupResponseHandling() {
    document.getElementById('fetch-status').addEventListener('click', fetchAndCheckStatus);
    document.getElementById('fetch-read-headers').addEventListener('click', fetchAndReadHeaders);
    document.getElementById('fetch-blob').addEventListener('click', fetchBlobData);
    document.getElementById('fetch-formdata').addEventListener('click', fetchWithFormData);
}

// ЗАДАНИЕ 5: Обработка ошибок
async function fetchNetworkError() {
    try {
        clearOutput('network-error-output');
        displayOutput('network-error-output', 'Попытка запроса к несуществующему домену...', 'loading');
        
        await fetch('https://nonexistent-domain-12345.example.com/api/data');
        
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            displayOutput('network-error-output', 'Сетевая ошибка: Не удалось выполнить запрос. Проверьте подключение к интернету или домен недоступен.', 'error');
        } else {
            displayOutput('network-error-output', `Ошибка: ${error.message}`, 'error');
        }
    }
}

async function fetchHttpError() {
    try {
        clearOutput('http-error-output');
        displayOutput('http-error-output', 'Запрос, возвращающий 404 ошибку...', 'loading');
        
        const response = await robustFetch('https://jsonplaceholder.typicode.com/nonexistent-endpoint-123');
        
        if (response.status === 404) {
            throw new Error('Ресурс не найден (404)');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        displayOutput('http-error-output', data, 'success');
        
    } catch (error) {
        displayOutput('http-error-output', `HTTP ошибка: ${error.message}`, 'error');
    }
}

async function fetchWithAbort() {
    try {
        clearOutput('abort-output');
        displayOutput('abort-output', 'Запрос с возможностью отмены...', 'loading');
        
        const controller = new AbortController();
        
        const abortButton = document.createElement('button');
        abortButton.textContent = 'Отменить запрос';
        abortButton.onclick = () => {
            controller.abort();
            abortButton.disabled = true;
        };
        
        document.getElementById('abort-output').appendChild(abortButton);
        
        const response = await robustFetch('https://jsonplaceholder.typicode.com/posts', {
            signal: controller.signal
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        
        const data = await response.json();
        displayOutput('abort-output', `Запрос завершен успешно!\n\nПолучено ${data.length} постов`, 'success');
        
    } catch (error) {
        if (error.name === 'AbortError') {
            displayOutput('abort-output', 'Запрос был отменен пользователем', 'warning');
        } else {
            displayOutput('abort-output', `Ошибка: ${error.message}`, 'error');
        }
    }
}

async function fetchWithRetry(url, options = {}, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            displayOutput('retry-output', `Попытка ${attempt} из ${retries}...`, 'loading');
            
            const response = await robustFetch(url, options);
            
            if (response.ok) {
                const data = await response.json();
                displayOutput('retry-output', `Успешно на попытке ${attempt}!\n\nДанные: ${JSON.stringify(data, null, 2)}`, 'success');
                return data;
            }
            
            if (response.status !== 429) {
                throw new Error(`HTTP ${response.status}`);
            }
            
        } catch (error) {
            if (attempt === retries) {
                displayOutput('retry-output', `Все ${retries} попыток завершились ошибкой: ${error.message}`, 'error');
                throw error;
            }
            
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 30000);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

function setupErrorHandling() {
    document.getElementById('fetch-network-error').addEventListener('click', fetchNetworkError);
    document.getElementById('fetch-http-error').addEventListener('click', fetchHttpError);
    document.getElementById('fetch-abort').addEventListener('click', fetchWithAbort);
    document.getElementById('fetch-retry').addEventListener('click', () => {
        fetchWithRetry('https://jsonplaceholder.typicode.com/posts/1', {}, 3);
    });
}

// ЗАДАНИЕ 6: Параллельные запросы
async function fetchWithPromiseAll() {
    try {
        clearOutput('promise-all-output');
        displayOutput('promise-all-output', 'Выполнение параллельных запросов...', 'loading');
        
        const startTime = performance.now();
        
        const [usersResponse, postsResponse, commentsResponse] = await Promise.all([
            robustFetch('https://jsonplaceholder.typicode.com/users'),
            robustFetch('https://jsonplaceholder.typicode.com/posts'),
            robustFetch('https://jsonplaceholder.typicode.com/comments')
        ]);
        
        const endTime = performance.now();
        const executionTime = (endTime - startTime).toFixed(2);
        
        if (!usersResponse.ok || !postsResponse.ok || !commentsResponse.ok) {
            throw new Error('Один из запросов завершился ошибкой');
        }
        
        const [users, posts, comments] = await Promise.all([
            usersResponse.json(),
            postsResponse.json(),
            commentsResponse.json()
        ]);
        
        const result = {
            executionTime: `${executionTime} мс`,
            usersCount: users.length,
            postsCount: posts.length,
            commentsCount: comments.length,
            firstUser: users[0],
            firstPost: posts[0],
            firstComment: comments[0]
        };
        
        displayOutput('promise-all-output', result, 'success');
        
    } catch (error) {
        displayOutput('promise-all-output', `Ошибка: ${error.message}`, 'error');
    }
}

async function fetchWithPromiseRace() {
    try {
        clearOutput('promise-race-output');
        displayOutput('promise-race-output', 'Гонка запросов...', 'loading');
        
        const fastRequest = robustFetch('https://jsonplaceholder.typicode.com/posts/1');
        const slowRequest = new Promise((resolve) => 
            setTimeout(() => resolve(robustFetch('https://jsonplaceholder.typicode.com/posts/2')), 2000)
        );
        
        const winner = await Promise.race([fastRequest, slowRequest]);
        
        if (!winner.ok) {
            throw new Error('Победивший запрос завершился ошибкой');
        }
        
        const data = await winner.json();
        
        displayOutput('promise-race-output', `Первый завершенный запрос:\n\n${JSON.stringify(data, null, 2)}`, 'success');
        
    } catch (error) {
        displayOutput('promise-race-output', `Ошибка: ${error.message}`, 'error');
    }
}

async function fetchSequentialRequests() {
    try {
        clearOutput('sequential-output');
        displayOutput('sequential-output', 'Выполнение последовательных запросов...', 'loading');
        
        const startTime = performance.now();
        
        const userResponse = await robustFetch('https://jsonplaceholder.typicode.com/users/1');
        const user = await userResponse.json();
        
        const postsResponse = await robustFetch('https://jsonplaceholder.typicode.com/posts?userId=1');
        const posts = await postsResponse.json();
        
        const commentsResponse = await robustFetch('https://jsonplaceholder.typicode.com/comments?postId=1');
        const comments = await commentsResponse.json();
        
        const endTime = performance.now();
        const executionTime = (endTime - startTime).toFixed(2);
        
        const result = {
            executionTime: `${executionTime} мс`,
            user: user,
            userPosts: posts.slice(0, 3),
            postComments: comments.slice(0, 3)
        };
        
        displayOutput('sequential-output', result, 'success');
        
    } catch (error) {
        displayOutput('sequential-output', `Ошибка: ${error.message}`, 'error');
    }
}

function setupParallelRequests() {
    document.getElementById('fetch-promise-all').addEventListener('click', fetchWithPromiseAll);
    document.getElementById('fetch-promise-race').addEventListener('click', fetchWithPromiseRace);
    document.getElementById('fetch-sequential').addEventListener('click', fetchSequentialRequests);
}

// ЗАДАНИЕ 7: Реальные сценарии
async function fetchUserWithPosts() {
    try {
        clearOutput('user-posts-output');
        displayOutput('user-posts-output', 'Загрузка пользователя и его постов...', 'loading');
        
        const userResponse = await robustFetch('https://jsonplaceholder.typicode.com/users/1');
        const user = await userResponse.json();
        
        const postsResponse = await robustFetch('https://jsonplaceholder.typicode.com/posts?userId=1');
        const posts = await postsResponse.json();
        
        const userHTML = createUserCard(user);
        const postsHTML = posts.map(post => `
            <div class="user-card">
                <h4>${post.title}</h4>
                <p>${post.body}</p>
            </div>
        `).join('');
        
        const resultHTML = `
            <h3>Пользователь:</h3>
            ${userHTML}
            <h3>Посты пользователя (${posts.length}):</h3>
            ${postsHTML}
        `;
        
        document.getElementById('user-posts-output').innerHTML = resultHTML;
        
    } catch (error) {
        displayOutput('user-posts-output', `Ошибка: ${error.message}`, 'error');
    }
}

async function fetchWithSearch() {
    try {
        clearOutput('search-output');
        
        const searchHTML = `
            <div class="search-form">
                <input type="text" id="search-input" placeholder="Введите ключевое слово...">
                <button id="search-button">Искать посты</button>
            </div>
            <div id="search-results"></div>
        `;
        
        document.getElementById('search-output').innerHTML = searchHTML;
        
        document.getElementById('search-button').addEventListener('click', async () => {
            const searchTerm = document.getElementById('search-input').value.trim();
            
            if (!searchTerm) {
                alert('Введите ключевое слово для поиска');
                return;
            }
            
            const resultsElement = document.getElementById('search-results');
            resultsElement.innerHTML = '<p class="loading">Поиск...</p>';
            
            try {
                const response = await robustFetch('https://jsonplaceholder.typicode.com/posts');
                const posts = await response.json();
                
                const filteredPosts = posts.filter(post => 
                    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.body.toLowerCase().includes(searchTerm.toLowerCase())
                );
                
                if (filteredPosts.length === 0) {
                    resultsElement.innerHTML = `<p class="warning">Посты не найдены</p>`;
                    return;
                }
                
                const resultsHTML = filteredPosts.map(post => `
                    <div class="user-card">
                        <h4>${post.title}</h4>
                        <p>${post.body}</p>
                        <small>Post ID: ${post.id}, User ID: ${post.userId}</small>
                    </div>
                `).join('');
                
                resultsElement.innerHTML = `
                    <h4>Найдено постов: ${filteredPosts.length}</h4>
                    ${resultsHTML}
                `;
                
            } catch (error) {
                resultsElement.innerHTML = `<p class="error">Ошибка поиска: ${error.message}</p>`;
            }
        });
        
    } catch (error) {
        displayOutput('search-output', `Ошибка: ${error.message}`, 'error');
    }
}

async function simulateFileUpload() {
    try {
        clearOutput('file-upload-output');
        displayOutput('file-upload-output', 'Симуляция загрузки файла...', 'loading');
        
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            displayOutput('file-upload-output', `Прогресс загрузки: ${progress}%`, 'loading');
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                displayOutput('file-upload-output', 'Файл успешно загружен! (симулировано)', 'success');
            }
        }, 200);
        
    } catch (error) {
        displayOutput('file-upload-output', `Ошибка: ${error.message}`, 'error');
    }
}

function createFetchCache() {
    const cache = new Map();
    
    return async function cachedFetch(url, options = {}) {
        const cacheKey = `${url}-${JSON.stringify(options)}`;
        const now = Date.now();
        const TTL = 10000;
        
        if (cache.has(cacheKey)) {
            const { data, timestamp } = cache.get(cacheKey);
            
            if (now - timestamp < TTL) {
                return data;
            } else {
                cache.delete(cacheKey);
            }
        }
        
        const response = await robustFetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        
        const data = await response.json();
        
        cache.set(cacheKey, {
            data: data,
            timestamp: now
        });
        
        return data;
    };
}

function setupRealScenarios() {
    document.getElementById('fetch-user-posts').addEventListener('click', fetchUserWithPosts);
    document.getElementById('fetch-search').addEventListener('click', fetchWithSearch);
    document.getElementById('fetch-file-upload').addEventListener('click', simulateFileUpload);
    
    document.getElementById('fetch-cache').addEventListener('click', async () => {
        const cachedFetch = createFetchCache();
        
        try {
            clearOutput('cache-output');
            
            displayOutput('cache-output', 'Первый запрос (должен загрузить данные)...', 'loading');
            const firstResult = await cachedFetch('https://jsonplaceholder.typicode.com/posts/1');
            displayOutput('cache-output', `Первый запрос:\n\n${JSON.stringify(firstResult, null, 2)}`, 'success');
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            displayOutput('cache-output', 'Второй запрос (должен взять из кэша)...', 'loading');
            const secondResult = await cachedFetch('https://jsonplaceholder.typicode.com/posts/1');
            displayOutput('cache-output', `Второй запрос (из кэша):\n\n${JSON.stringify(secondResult, null, 2)}`, 'success');
            
            await new Promise(resolve => setTimeout(resolve, 11000));
            displayOutput('cache-output', 'Третий запрос после TTL (должен загрузить заново)...', 'loading');
            const thirdResult = await cachedFetch('https://jsonplaceholder.typicode.com/posts/1');
            displayOutput('cache-output', `Третий запрос (загружен заново):\n\n${JSON.stringify(thirdResult, null, 2)}`, 'success');
            
        } catch (error) {
            displayOutput('cache-output', `Ошибка: ${error.message}`, 'error');
        }
    });
}

// Инициализация всех обработчиков при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    setupGetRequests();
    setupCrudRequests();
    setupHeadersAndParams();
    setupResponseHandling();
    setupErrorHandling();
    setupParallelRequests();
    setupRealScenarios();
    
    console.log('Все обработчики установлены. Fetch API готов к работе!');
    console.log('Режим: автономный (работает без интернета)');
});