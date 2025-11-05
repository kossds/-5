'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('books', [
      {
        title: 'Война и мир',
        isbn: '978-5-389-07464-1',
        description: 'Роман-эпопея, описывающий русское общество в эпоху войн против Наполеона',
        published_year: 1869,
        author_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Анна Каренина',
        isbn: '978-5-389-05387-5',
        description: 'Роман о трагической любви замужней женщины',
        published_year: 1877,
        author_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Преступление и наказание',
        isbn: '978-5-389-04855-0',
        description: 'Роман о духовном возрождении человека через страдание',
        published_year: 1866,
        author_id: 2,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Вишневый сад',
        isbn: '978-5-389-07123-7',
        description: 'Пьеса о гибели дворянских гнезд',
        published_year: 1904,
        author_id: 3,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('books', null, {});
  }
};