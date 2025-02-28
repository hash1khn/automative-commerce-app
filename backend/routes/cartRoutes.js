const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

// Cart Routes
router.post('/add-to-cart', authenticateJWT, addToCart);
router.get('/get-cart', authenticateJWT, getCart);
router.put('/update-cart', authenticateJWT, updateCartItem);
router.delete('/remove-from-cart', authenticateJWT, removeFromCart);
router.delete('/clear', authenticateJWT, clearCart);

module.exports = router;
