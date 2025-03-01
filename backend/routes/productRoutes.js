const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require('../controllers/productController');

const { authenticateJWT,adminCheck } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public Routes
router.get('/get-all-products', getAllProducts);
router.get('/:id', getProductById);

// Admin-only Routes
router.post('/add-product', authenticateJWT, adminCheck,upload.array('images', 5), createProduct);
router.put('/update-product/:id', authenticateJWT, adminCheck,upload.array('images', 5), updateProduct);
router.delete('/delete-product/:id', authenticateJWT, adminCheck, deleteProduct);
router.get('/search', searchProducts);

module.exports = router;
