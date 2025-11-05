const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Author = sequelize.define('Author', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  bio: {
    type: DataTypes.TEXT
  },
  birth_date: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'authors',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Статические методы
Author.getAllAuthors = async function(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  
  return await this.findAndCountAll({
    limit: parseInt(limit),
    offset: offset,
    order: [['name', 'ASC']]
  });
};

Author.getAuthorWithBooks = async function(authorId) {
  const Book = require('./Book');
  
  return await this.findByPk(authorId, {
    include: [{
      model: Book,
      as: 'books'
    }]
  });
};

Author.createAuthor = async function(authorData) {
  return await this.create(authorData);
};

module.exports = Author;