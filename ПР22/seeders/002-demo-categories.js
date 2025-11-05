'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Роман',
        description: 'Крупное повествовательное произведение',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Рассказ',
        description: 'Небольшое повествовательное произведение',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Драма',
        description: 'Произведения драматического жанра',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};