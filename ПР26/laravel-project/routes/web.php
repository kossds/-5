<?php
// Главная страница
Route::get('/', function () {
    return '<h1>Главная страница</h1><p>Добро пожаловать в Laravel!</p>';
});

// Простой маршрут
Route::get('/hello', function () {
    return 'Hello World!'; // Возвращает простую строку
});

// Маршрут с шаблоном Blade
Route::get('/greeting', function () {
    // Передача данных в шаблон
    return view('greeting', ['name' => 'Студент']);
});

// Дополнительный маршрут для демонстрации 3+ маршрутов
Route::get('/about', function () {
    return '<h2>Об этом приложении</h2><p>Учебный проект по Laravel</p>';
});