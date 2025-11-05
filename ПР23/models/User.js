const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, '../database.db');
const db = new sqlite3.Database(dbPath);

class User {
  static async create(email, password) {
    const password_hash = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (email, password_hash) VALUES (?, ?)`,
        [email, password_hash],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, email, role: 'user' });
        }
      );
    });
  }

  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async comparePassword(inputPassword, hash) {
    return await bcrypt.compare(inputPassword, hash);
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT id, email, role FROM users WHERE id = ?`, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

module.exports = User;
