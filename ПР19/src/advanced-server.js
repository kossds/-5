const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

const PORT = 3001; // Используем другой порт, чтобы не конфликтовать с основным сервером

// База данных (временное хранилище)
let products = [
    { id: 1, name: 'Ноутбук', price: 50000, category: 'Электроника' },
    { id: 2, name: 'Смартфон', price: 30000, category: 'Электроника' },
    { id: 3, name: 'Книга', price: 500, category: 'Книги' }
];

let orders = [];

// MIME-типы для статических файлов
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

// Middleware для логирования
function logger(req, res, next) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${req.headers['user-agent']}`);
    next();
}

// Middleware для парсинга JSON тела запроса
function parseJSONBody(req, res, next) {
    if (['POST', 'PUT'].includes(req.method)) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                if (body) {
                    req.body = JSON.parse(body);
                }
                next();
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Неверный формат JSON' }));
            }
        });
    } else {
        next();
    }
}

// Создаем HTTP сервер
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    req.pathname = parsedUrl.pathname;
    req.query = parsedUrl.query;
    req.method = req.method;

    // Устанавливаем заголовки CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Обработка preflight запросов
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Цепочка middleware
    const middlewares = [logger, parseJSONBody];
    
    function runMiddleware(index) {
        if (index < middlewares.length) {
            middlewares[index](req, res, () => runMiddleware(index + 1));
        } else {
            handleRequest(req, res);
        }
    }
    
    runMiddleware(0);
});

// Основной обработчик запросов
function handleRequest(req, res) {
    const { pathname, method } = req;

    // Обработка статических файлов из папки public
    if (isStaticFileRequest(pathname)) {
        serveStaticFile(req, res, pathname);
        return;
    }

    // Маршрутизация API
    if (pathname === '/') {
        handleRoot(req, res);
    } else if (pathname === '/api/products' && method === 'GET') {
        handleGetProducts(req, res);
    } else if (pathname === '/api/products' && method === 'POST') {
        handleCreateProduct(req, res);
    } else if (pathname.startsWith('/api/products/') && method === 'GET') {
        handleGetProduct(req, res, pathname);
    } else if (pathname.startsWith('/api/products/') && method === 'PUT') {
        handleUpdateProduct(req, res, pathname);
    } else if (pathname.startsWith('/api/products/') && method === 'DELETE') {
        handleDeleteProduct(req, res, pathname);
    } else if (pathname === '/api/orders' && method === 'GET') {
        handleGetOrders(req, res);
    } else if (pathname === '/api/orders' && method === 'POST') {
        handleCreateOrder(req, res);
    } else if (pathname === '/api/stats') {
        handleStats(req, res);
    } else if (pathname === '/api/search') {
        handleSearch(req, res);
    } else {
        handleNotFound(req, res);
    }
}

// Проверяем, является ли запрос запросом статического файла
function isStaticFileRequest(pathname) {
    const staticExtensions = ['.html', '.css', '.js', '.png', '.jpg', '.gif', '.svg', '.json'];
    const ext = path.extname(pathname).toLowerCase();
    return staticExtensions.includes(ext) || pathname === '/' || pathname === '/client.html' || pathname === '/index.html' || pathname === '/advanced-client.html';
}

// Обслуживание статических файлов
function serveStaticFile(req, res, pathname) {
    let filePath = pathname;
    
    // Если запрос к корню, отдаем index.html
    if (pathname === '/') {
        filePath = '/index.html';
    }
    
    // Формируем полный путь к файлу
    const fullPath = path.join(__dirname, 'public', filePath);
    
    // Проверяем существование файла
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Файл не найден
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <head><title>404 - Not Found</title></head>
                        <body>
                            <h1>404 - Файл не найден</h1>
                            <p>Запрошенный файл ${pathname} не существует</p>
                            <p>Доступные файлы:</p>
                            <ul>
                                <li><a href="/index.html">index.html</a></li>
                                <li><a href="/client.html">client.html</a></li>
                                <li><a href="/advanced-client.html">advanced-client.html</a></li>
                                <li><a href="/styles.css">styles.css</a></li>
                            </ul>
                        </body>
                    </html>
                `);
            } else {
                // Другая ошибка сервера
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`<h1>500 - Ошибка сервера</h1><p>${err.message}</p>`);
            }
            return;
        }
        
        // Определяем Content-Type
        const ext = path.extname(fullPath).toLowerCase();
        const contentType = mimeTypes[ext] || 'text/plain';
        
        // Отдаем файл
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

// Обработчики маршрутов API
function handleRoot(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        message: 'Добро пожаловать на продвинутый сервер Node.js!',
        endpoints: [
            'GET /api/products - получить все товары',
            'GET /api/products/:id - получить товар по ID',
            'POST /api/products - создать новый товар',
            'PUT /api/products/:id - обновить товар',
            'DELETE /api/products/:id - удалить товар',
            'GET /api/orders - получить все заказы',
            'POST /api/orders - создать новый заказ',
            'GET /api/stats - статистика',
            'GET /api/search?q=... - поиск товаров'
        ],
        staticFiles: [
            'GET / - главная страница (index.html)',
            'GET /client.html - базовый клиент',
            'GET /advanced-client.html - продвинутый клиент',
            'GET /styles.css - стили'
        ]
    }));
}

function handleGetProducts(req, res) {
    // Поддержка фильтрации по категории
    const category = req.query.category;
    let filteredProducts = products;
    
    if (category) {
        filteredProducts = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(filteredProducts));
}

function handleGetProduct(req, res, pathname) {
    const productId = parseInt(pathname.split('/')[3]);
    const product = products.find(p => p.id === productId);
    
    if (product) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(product));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Товар не найден' }));
    }
}

function handleCreateProduct(req, res) {
    const productData = req.body;
    
    if (!productData.name || !productData.price || !productData.category) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Название, цена и категория обязательны' }));
        return;
    }
    
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: productData.name,
        price: parseFloat(productData.price),
        category: productData.category,
        description: productData.description || ''
    };
    
    products.push(newProduct);
    
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newProduct));
}

function handleUpdateProduct(req, res, pathname) {
    const productId = parseInt(pathname.split('/')[3]);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Товар не найден' }));
        return;
    }
    
    const productData = req.body;
    const updatedProduct = { ...products[productIndex], ...productData };
    
    // Обновляем числовые поля
    if (productData.price) {
        updatedProduct.price = parseFloat(productData.price);
    }
    
    products[productIndex] = updatedProduct;
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updatedProduct));
}

function handleDeleteProduct(req, res, pathname) {
    const productId = parseInt(pathname.split('/')[3]);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Товар не найден' }));
        return;
    }
    
    products.splice(productIndex, 1);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Товар удален' }));
}

function handleGetOrders(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(orders));
}

function handleCreateOrder(req, res) {
    const orderData = req.body;
    
    if (!orderData.productId || !orderData.quantity) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'ID товара и количество обязательны' }));
        return;
    }
    
    const product = products.find(p => p.id === parseInt(orderData.productId));
    if (!product) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Товар не найден' }));
        return;
    }
    
    const newOrder = {
        id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
        productId: parseInt(orderData.productId),
        productName: product.name,
        quantity: parseInt(orderData.quantity),
        totalPrice: product.price * parseInt(orderData.quantity),
        customerName: orderData.customerName || 'Аноним',
        timestamp: new Date().toISOString()
    };
    
    orders.push(newOrder);
    
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newOrder));
}

function handleStats(req, res) {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    const categories = [...new Set(products.map(p => p.category))];
    const categoryStats = categories.map(category => {
        const categoryProducts = products.filter(p => p.category === category);
        const categoryOrders = orders.filter(o => 
            products.some(p => p.id === o.productId && p.category === category)
        );
        return {
            category,
            productCount: categoryProducts.length,
            orderCount: categoryOrders.length,
            revenue: categoryOrders.reduce((sum, order) => sum + order.totalPrice, 0)
        };
    });
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        totalProducts,
        totalOrders,
        totalRevenue,
        categories: categoryStats
    }));
}

function handleSearch(req, res) {
    const query = req.query.q;
    
    if (!query) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Параметр поиска (q) обязателен' }));
        return;
    }
    
    const searchResults = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
    );
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        query,
        results: searchResults,
        count: searchResults.length
    }));
}

function handleNotFound(req, res) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Маршрут не найден' }));
}

// Запуск сервера
server.listen(PORT, () => {
    console.log(`Продвинутый сервер запущен на http://localhost:${PORT}`);
    console.log('Доступные endpoints:');
    console.log('GET  / - информация о API');
    console.log('GET  /api/products - получить все товары');
    console.log('GET  /api/products?category=... - фильтр по категории');
    console.log('GET  /api/products/:id - получить товар по ID');
    console.log('POST /api/products - создать товар');
    console.log('PUT  /api/products/:id - обновить товар');
    console.log('DELETE /api/products/:id - удалить товар');
    console.log('GET  /api/orders - получить все заказы');
    console.log('POST /api/orders - создать заказ');
    console.log('GET  /api/stats - статистика');
    console.log('GET  /api/search?q=... - поиск товаров');
    console.log('\nСтатические файлы:');
    console.log('GET  / - главная страница (index.html)');
    console.log('GET  /client.html - базовый клиент');
    console.log('GET  /advanced-client.html - продвинутый клиент');
    console.log('GET  /styles.css - стили');
    
    // Проверяем наличие файлов в папке public
    const publicPath = path.join(__dirname, 'public');
    fs.readdir(publicPath, (err, files) => {
        if (err) {
            console.log('Ошибка чтения папки public:', err.message);
        } else {
            console.log('\nФайлы в папке public:');
            files.forEach(file => {
                console.log(`  - ${file}`);
            });
        }
    });
});