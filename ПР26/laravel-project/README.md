# Практическая работа №26: Анализ PHP и Laravel

## Анализ legacy-кода
См. подробный анализ в файле [legacy_analysis.txt](legacy_analysis.txt)

## Установка и запуск Laravel
1. Требования:
   - PHP 8.0+
   - Composer
   - Расширения: pdo, mbstring, tokenizer

2. Установка:
```bash
composer create-project laravel/laravel laravel_project
cd laravel_project
```

3. Запуск:
```bash
php artisan serve
```

## Созданные маршруты
- `/` - Главная страница
- `/hello` - Простой текстовый ответ
- `/greeting` - Blade-шаблон с передачей данных
- `/about` - Дополнительная страница

## Blade-шаблон
- Файл: `resources/views/greeting.blade.php`
- Особенности:
  - Прием данных из контроллера
  - Условная логика (@if)
  - Вывод динамических данных
  - Автоматическое экранирование для защиты от XSS

## Скриншоты
![Главная страница](screenshots/home.png)
![Страница /greeting](screenshots/greeting.png)