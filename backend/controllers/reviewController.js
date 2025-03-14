const Product = require('../models/Product');

/**
 * @route   POST /api/products/:id/review
 * @desc    Add a product review
 * @access  Private (Only users who purchased the product)
 */
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Check if user has already reviewed
    const existingReview = product.reviews.find(r => r.user.toString() === userId);
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product.' });
    }

    // Add review
    product.reviews.push({ user: userId, rating, comment });

    // Calculate new average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.averageRating = totalRating / product.reviews.length;

    await product.save();

    return res.status(201).json({ message: 'Review added successfully', product });
  } catch (error) {
    console.error('Add Review Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


