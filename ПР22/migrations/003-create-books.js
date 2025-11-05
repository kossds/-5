'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('books', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isbn: {
        type: Sequelize.STRING,
        unique: true
      },
      description: {
        type: Sequelize.TEXT
      },
      published_year: {
        type: Sequelize.INTEGER
      },
      author_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'authors',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Создание индексов для оптимизации
    await queryInterface.addIndex('books', ['author_id']);
    await queryInterface.addIndex('books', ['category_id']);
    await queryInterface.addIndex('books', ['title']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('books');
  }
};