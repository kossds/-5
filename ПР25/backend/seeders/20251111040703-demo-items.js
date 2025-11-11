'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Items', [
      {
        name: 'Товар 1',
        description: 'Первый тестовый товар',
        price: 100.50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Товар 2', 
        description: 'Второй тестовый товар',
        price: 200.75,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Товар 3',
        description: 'Третий тестовый товар',
        price: 300.00,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Items', null, {});
  }
};