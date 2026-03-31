const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password required' });

  // Single admin user from env (no DB lookup needed for portfolio)
  const adminEmail    = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email !== adminEmail)
    return res.status(401).json({ success: false, message: 'Invalid credentials' });

  // Password in .env is plain text — direct compare
  // If you want to use a hashed password, run: node -e "require('bcryptjs').hash('yourpass',10).then(console.log)"
  const isMatch = password === adminPassword;
  if (!isMatch)
    return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  res.json({ success: true, token });
});

// GET /api/auth/verify
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

module.exports = router;
