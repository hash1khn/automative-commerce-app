// /src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/userController');

// Get logged-in user profile
router.get('/me', authenticateJWT, getProfile);

// Update user profile
router.put('/update-user', authenticateJWT, updateProfile);

module.exports = router;
