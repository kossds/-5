const { Author, Category, Book } = require('../models');

const initializeData = async () => {
  try {
    // Создаем авторов
    const authors = await Author.bulkCreate([
      {
        name: 'Лев Толстой',
        bio: 'Русский писатель, мыслитель, философ.',
        birth_date: new Date('1828-09-09')
      },
      {
        name: 'Федор Достоевский',
        bio: 'Русский писатель, мыслитель, философ и публицист.',
        birth_date: new Date('1821-11-11')
      },
      {
        name: 'Антон Чехов',
        bio: 'Русский писатель, прозаик, драматург.',
        birth_date: new Date('1860-01-29')
      },
      {
        name: 'Александр Пушкин',
        bio: 'Русский поэт, драматург и прозаик.',
        birth_date: new Date('1799-06-06')
      }
    ]);

    // Создаем категории
    const categories = await Category.bulkCreate([
      {
        name: 'Роман',
        description: 'Крупное повествовательное произведение'
      },
      {
        name: 'Рассказ',
        description: 'Небольшое повествовательное произведение'
      },
      {
        name: 'Драма',
        description: 'Произведения драматического жанра'
      },
      {
        name: 'Поэзия',
        description: 'Стихотворные произведения'
      }
    ]);

    // Создаем книги
    await Book.bulkCreate([
      {
        title: 'Война и мир',
        isbn: '978-5-389-07464-1',
        description: 'Роман-эпопея, описывающий русское общество в эпоху войн против Наполеона',
        published_year: 1869,
        author_id: 1,
        category_id: 1
      },
      {
        title: 'Анна Каренина',
        isbn: '978-5-389-05387-5',
        description: 'Роман о трагической любви замужней женщины',
        published_year: 1877,
        author_id: 1,
        category_id: 1
      },
      {
        title: 'Преступление и наказание',
        isbn: '978-5-389-04855-0',
        description: 'Роман о духовном возрождении человека через страдание',
        published_year: 1866,
        author_id: 2,
        category_id: 1
      },
      {
        title: 'Вишневый сад',
        isbn: '978-5-389-07123-7',
        description: 'Пьеса о гибели дворянских гнезд',
        published_year: 1904,
        author_id: 3,
        category_id: 3
      },
      {
        title: 'Евгений Онегин',
        isbn: '978-5-389-04532-0',
        description: 'Роман в стихах, классика русской литературы',
        published_year: 1833,
        author_id: 4,
        category_id: 4
      }
    ]);

    console.log('✅ Тестовые данные успешно созданы');
  } catch (error) {
    console.error('❌ Ошибка при создании тестовых данных:', error);
  }
};

module.exports = initializeData;