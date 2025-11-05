const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database/library.db'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Тестирование подключения
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite подключение установлено успешно');
    
    // Создаем таблицы если их нет
    await sequelize.sync();
    console.log('✅ Таблицы синхронизированы');
  } catch (error) {
    console.error('❌ Ошибка подключения к SQLite:', error);
  }
};

module.exports = { sequelize, testConnection };