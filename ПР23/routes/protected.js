const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const router = express.Router();

router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Доступ к профилю разрешён', user: req.user });
});

router.get('/admin', authenticateToken, requireRole('admin'), (req, res) => {
  res.json({ message: 'Доступ к админке разрешён' });
});

module.exports = router;