require('dotenv').config();

module.exports = {
  development: {
    storage: './database/sqlite.dev.db',
    dialect: 'sqlite',
    operatorsAliases: 0,
    logging: console.log,
  },
  test: {
    storage: './database/sqlite.test.db',
    dialect: 'sqlite',
    operatorsAliases: 0,
    logging: false,
  },
  production: {
    storage: process.env.SQLITE_DB_PATH || './database/sqlite.prod.db',
    dialect: 'sqlite',
    operatorsAliases: 0,
    logging: false,
  }
};