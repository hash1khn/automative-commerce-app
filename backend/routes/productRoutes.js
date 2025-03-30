const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  addReview,
  handleImageUpload,
} = require('../controllers/productController');

const { authenticateJWT,adminCheck } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public Routes
router.get('/get-all-products', getAllProducts);
router.get('/:id', getProductById);

// Admin-only Routes
router.post('/add-product', authenticateJWT, adminCheck, createProduct);
router.put('/update-product/:id', authenticateJWT, adminCheck,upload.array('images', 5), updateProduct);
router.delete('/delete-product/:id', authenticateJWT, adminCheck, deleteProduct);
router.get('/search', searchProducts);
router.post('/:id/review',authenticateJWT,addReview);
router.post('/upload', upload.single('file'), handleImageUpload);


module.exports = router;
