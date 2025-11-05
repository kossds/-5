const Author = require('./Author');
const Book = require('./Book');
const Category = require('./Category');

// Связи между моделями
Author.hasMany(Book, {
  foreignKey: 'author_id',
  as: 'books'
});

Book.belongsTo(Author, {
  foreignKey: 'author_id',
  as: 'author'
});

Category.hasMany(Book, {
  foreignKey: 'category_id',
  as: 'books'
});

Book.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category'
});

module.exports = {
  Author,
  Book,
  Category
};