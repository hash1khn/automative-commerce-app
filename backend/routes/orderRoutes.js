const express = require('express');
const router = express.Router();
const { authenticateJWT, adminCheck } = require('../middleware/authMiddleware');
const {
  validatePromoCode,
  processPayment,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

router.post('/validate-promo', authenticateJWT, validatePromoCode);
router.post('/payment', authenticateJWT, processPayment);
router.get('/get-user-orders', authenticateJWT, getUserOrders);
router.get('/all-orders', authenticateJWT, adminCheck, getAllOrders);
router.put('/:id/update-order-status', authenticateJWT, adminCheck, updateOrderStatus);

module.exports = router;
