'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('authors', [
      {
        name: 'Лев Толстой',
        bio: 'Русский писатель, мыслитель, философ.',
        birth_date: new Date('1828-09-09'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Федор Достоевский',
        bio: 'Русский писатель, мыслитель, философ и публицист.',
        birth_date: new Date('1821-11-11'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Антон Чехов',
        bio: 'Русский писатель, прозаик, драматург.',
        birth_date: new Date('1860-01-29'),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('authors', null, {});
  }
};