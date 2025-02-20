// /src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  signup,
  verifyEmail,
  login,
} = require('../controllers/authController');

// POST /api/auth/signup
router.post('/signup', signup);

// GET /api/auth/verify-email
router.get('/verify-email', verifyEmail);

// POST /api/auth/login
router.post('/login', login);

module.exports = router;
