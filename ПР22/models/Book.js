const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  isbn: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isISBN: true
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  published_year: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1000,
      max: new Date().getFullYear()
    }
  },
  author_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'authors',
      key: 'id'
    }
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'categories',
      key: 'id'
    }
  }
}, {
  tableName: 'books',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Статические методы
Book.findAllBooks = async function(page = 1, limit = 10, filters = {}) {
  const offset = (page - 1) * limit;
  const Author = require('./Author');
  const Category = require('./Category');
  
  const whereClause = {};
  if (filters.author_id) whereClause.author_id = filters.author_id;
  if (filters.category_id) whereClause.category_id = filters.category_id;
  if (filters.title) whereClause.title = { [Op.like]: `%${filters.title}%` };

  return await this.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: offset,
    include: [
      { model: Author, as: 'author' },
      { model: Category, as: 'category' }
    ],
    order: [['title', 'ASC']]
  });
};

Book.findBookById = async function(id) {
  const Author = require('./Author');
  const Category = require('./Category');
  
  return await this.findByPk(id, {
    include: [
      { model: Author, as: 'author' },
      { model: Category, as: 'category' }
    ]
  });
};

Book.createBook = async function(bookData) {
  return await this.create(bookData);
};

Book.updateBook = async function(id, bookData) {
  const book = await this.findByPk(id);
  if (!book) {
    throw new Error('Книга не найдена');
  }
  return await book.update(bookData);
};

Book.deleteBook = async function(id) {
  const book = await this.findByPk(id);
  if (!book) {
    throw new Error('Книга не найдена');
  }
  return await book.destroy();
};

module.exports = Book;