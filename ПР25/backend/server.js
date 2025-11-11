require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const { Sequelize } = require('sequelize');

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: frontendUrl,
  credentials: true
}));

// Initialize SQLite database
const dbPath = process.env.SQLITE_DB_PATH || './database/sqlite.prod.db';
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, dbPath),
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

// Test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite database connected successfully');
    
    // Sync models with database
    await sequelize.sync({ force: false });
    console.log('Database synchronized');
    
  } catch (error) {
    console.error('SQLite connection error:', error);
    process.exit(1);
  }
};

// Import models
const Item = require('./models/Item')(sequelize, Sequelize.DataTypes);

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Backend is running with SQLite',
    environment: process.env.NODE_ENV,
    database: 'SQLite',
    timestamp: new Date().toISOString()
  });
});

// API routes
const itemRoutes = require('./src/routes/items')(Item);
app.use('/api/items', itemRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`Database file: ${path.resolve(__dirname, dbPath)}`);
  });
});