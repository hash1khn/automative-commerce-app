const Product = require('../models/Product');

/**
 * @route   POST /api/products
 * @desc    Create a new product (Admin Only)
 * @access  Private (Admin)
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, stock, images } = req.body;
    
    if (!name || !price || !description || !images || images.length === 0) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const product = new Product({
      name,
      price,
      description,
      images, // These are just the URLs now
      stock,
    });
    
    await product.save();
    return res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Create Product Error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
// In your controller file
exports.handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Return the URL of the uploaded file
    // If you're using Cloudinary, this might be req.file.path
    return res.status(200).json({ url: req.file.path });
  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
};
  

/**
 * @route   GET /api/products
 * @desc    Get all products (Public)
 * @access  Public
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().select('name price images stock averageRating').sort({ createdAt: -1 }); // Sort by latest products first
    return res.status(200).json(products);
  } catch (error) {
    console.error('Get All Products Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * @route   GET /api/products/:id
 * @desc    Get product details by ID (Public)
 * @access  Public
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error('Get Product By ID Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update an existing product (Admin Only)
 * @access  Private (Admin)
 */
exports.updateProduct = async (req, res) => {
    try {
      const { name, price, description, rating,stock } = req.body;
      let product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }
  
      // Update text fields
      if (name) product.name = name;
      if (price !== undefined) product.price = price;
      if (description) product.description = description;
      if (rating !== undefined) product.rating = rating;
      if (stock !== undefined) product.stock = stock;
  
      // ✅ If new images are uploaded, delete old ones and replace
      if (req.files && req.files.length > 0) {
        // Delete old images from Cloudinary
        for (let imgUrl of product.images) {
          const publicId = imgUrl.split('/').pop().split('.')[0]; // Extract publicId
          await cloudinary.uploader.destroy(publicId);
        }
  
        // Save new images
        const newImages = req.files.map(file => file.path);
        product.images = newImages;
      }
  
      await product.save();
      return res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
      console.error('Update Product Error:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product (Admin Only)
 * @access  Private (Admin)
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found or already deleted.' });
    }
    return res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * @route   GET /api/products/search
 * @desc    Search and filter products (Without Category)
 * @access  Public
 */
exports.searchProducts = async (req, res) => {
  try {
    const { keyword, minPrice, maxPrice, sort, page, limit } = req.query;

    let filter = {};

    // 🔍 Search by keyword (name or description)
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } }, // Case-insensitive name search
        { description: { $regex: keyword, $options: 'i' } } // Case-insensitive description search
      ];
    }

    // 🔍 Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // 🏷 Pagination (Defaults: page 1, limit 10)
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const skip = (currentPage - 1) * itemsPerPage;

    // 🔄 Sorting (Options: newest, price_low, price_high)
    let sortOption = { createdAt: -1 }; // Default: Newest first
    if (sort === 'price_low') {
      sortOption = { price: 1 };
    } else if (sort === 'price_high') {
      sortOption = { price: -1 };
    }

    // 🔍 Execute Query
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(itemsPerPage);

    // Count total matching products for pagination
    const totalProducts = await Product.countDocuments(filter);

    return res.status(200).json({
      products,
      currentPage,
      totalPages: Math.ceil(totalProducts / itemsPerPage),
      totalProducts,
    });
  } catch (error) {
    console.error('Search Products Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

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


