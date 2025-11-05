const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Путь к файлу базы данных
const dbPath = path.join(__dirname, 'database.sqlite');

// Создаем подключение к базе данных
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка подключения к SQLite:', err.message);
  } else {
    console.log('✅ Подключение к SQLite установлено');
    initializeDatabase();
  }
});

// Инициализация базы данных
function initializeDatabase() {
  // Создаем таблицу авторов
  db.run(`CREATE TABLE IF NOT EXISTS authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    bio TEXT,
    birth_date TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`);

  // Создаем таблицу категорий
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`);

  // Создаем таблицу книг
  db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    isbn TEXT UNIQUE,
    description TEXT,
    published_year INTEGER,
    author_id INTEGER,
    category_id INTEGER,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES authors (id),
    FOREIGN KEY (category_id) REFERENCES categories (id)
  )`);

  // Заполняем начальными данными
  setTimeout(() => {
    insertInitialData();
  }, 100);
}

// Вставка начальных данных
function insertInitialData() {
  // Проверяем, есть ли уже данные
  db.get('SELECT COUNT(*) as count FROM authors', (err, result) => {
    if (err) return;

    if (result.count === 0) {
      console.log('🔄 Заполнение базы начальными данными...');

      // Вставляем авторов
      const authors = [
        ['Лев Толстой', 'Русский писатель, мыслитель, философ.', '1828-09-09'],
        ['Федор Достоевский', 'Русский писатель, мыслитель, философ и публицист.', '1821-11-11'],
        ['Антон Чехов', 'Русский писатель, прозаик, драматург.', '1860-01-29']
      ];

      authors.forEach(author => {
        db.run('INSERT INTO authors (name, bio, birth_date, created_at, updated_at) VALUES (?, ?, ?, datetime("now"), datetime("now"))', author);
      });

      // Вставляем категории
      const categories = [
        ['Роман', 'Крупное повествовательное произведение'],
        ['Рассказ', 'Небольшое повествовательное произведение'],
        ['Драма', 'Произведения драматического жанра']
      ];

      categories.forEach(category => {
        db.run('INSERT INTO categories (name, description, created_at, updated_at) VALUES (?, ?, datetime("now"), datetime("now"))', category);
      });

      // Вставляем книги (после небольшой задержки чтобы авторы и категории создались)
      setTimeout(() => {
        const books = [
          ['Война и мир', '978-5-389-07464-1', 'Роман-эпопея, описывающий русское общество в эпоху войн против Наполеона', 1869, 1, 1],
          ['Анна Каренина', '978-5-389-05387-5', 'Роман о трагической любви замужней женщины', 1877, 1, 1],
          ['Преступление и наказание', '978-5-389-04855-0', 'Роман о духовном возрождении человека через страдание', 1866, 2, 1],
          ['Вишневый сад', '978-5-389-07123-7', 'Пьеса о гибели дворянских гнезд', 1904, 3, 3]
        ];

        books.forEach(book => {
          db.run('INSERT INTO books (title, isbn, description, published_year, author_id, category_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))', book);
        });

        console.log('✅ Начальные данные добавлены');
      }, 500);
    }
  });
}

module.exports = db;