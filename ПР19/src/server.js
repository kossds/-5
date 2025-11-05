const http = require('http');
const url = require('url');
const querystring = require('querystring');

const PORT = 3000;

// База данных (временное хранилище)
let users = [
    { id: 1, name: 'Иван Иванов', email: 'ivan@example.com' },
    { id: 2, name: 'Петр Петров', email: 'petr@example.com' }
];

// Создаем HTTP сервер
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // Устанавливаем заголовки CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Обработка preflight запросов
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    console.log(`${new Date().toISOString()} - ${method} ${pathname}`);

    // Маршрутизация
    if (pathname === '/') {
        handleRoot(req, res);
    } else if (pathname === '/api/users' && method === 'GET') {
        handleGetUsers(req, res);
    } else if (pathname === '/api/users' && method === 'POST') {
        handleCreateUser(req, res);
    } else if (pathname.startsWith('/api/users/') && method === 'GET') {
        handleGetUser(req, res, pathname);
    } else if (pathname.startsWith('/api/users/') && method === 'PUT') {
        handleUpdateUser(req, res, pathname);
    } else if (pathname.startsWith('/api/users/') && method === 'DELETE') {
        handleDeleteUser(req, res, pathname);
    } else if (pathname === '/api/info') {
        handleInfo(req, res);
    } else {
        handleNotFound(req, res);
    }
});

// Обработчики маршрутов
function handleRoot(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        message: 'Добро пожаловать на сервер Node.js!',
        endpoints: [
            'GET /api/users - получить всех пользователей',
            'GET /api/users/:id - получить пользователя по ID',
            'POST /api/users - создать нового пользователя',
            'PUT /api/users/:id - обновить пользователя',
            'DELETE /api/users/:id - удалить пользователя',
            'GET /api/info - информация о сервере'
        ]
    }));
}

function handleGetUsers(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
}

function handleGetUser(req, res, pathname) {
    const userId = parseInt(pathname.split('/')[3]);
    const user = users.find(u => u.id === userId);
    
    if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Пользователь не найден' }));
    }
}

function handleCreateUser(req, res) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            const userData = JSON.parse(body);
            
            if (!userData.name || !userData.email) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Имя и email обязательны' }));
                return;
            }
            
            const newUser = {
                id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                name: userData.name,
                email: userData.email
            };
            
            users.push(newUser);
            
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Неверный формат JSON' }));
        }
    });
}

function handleUpdateUser(req, res, pathname) {
    const userId = parseInt(pathname.split('/')[3]);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Пользователь не найден' }));
        return;
    }
    
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            const userData = JSON.parse(body);
            const updatedUser = { ...users[userIndex], ...userData };
            users[userIndex] = updatedUser;
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updatedUser));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Неверный формат JSON' }));
        }
    });
}

function handleDeleteUser(req, res, pathname) {
    const userId = parseInt(pathname.split('/')[3]);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Пользователь не найден' }));
        return;
    }
    
    users.splice(userIndex, 1);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Пользователь удален' }));
}

function handleInfo(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        server: 'Node.js HTTP Server',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        totalUsers: users.length
    }));
}

function handleNotFound(req, res) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Маршрут не найден' }));
}

// Запуск сервера
server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log('Доступные endpoints:');
    console.log('GET  / - информация о API');
    console.log('GET  /api/users - получить всех пользователей');
    console.log('GET  /api/users/:id - получить пользователя по ID');
    console.log('POST /api/users - создать пользователя');
    console.log('PUT  /api/users/:id - обновить пользователя');
    console.log('DELETE /api/users/:id - удалить пользователя');
    console.log('GET  /api/info - информация о сервере');
});