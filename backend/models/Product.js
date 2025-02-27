const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  rating: {
    type: Number,
    default: 0, // Rating starts at 0
    min: 0,
    max: 5,
  },
  images: [
    {
      type: String, // Store URLs or file paths
      required: true,
    },
  ],
}, {
  timestamps: true, // Automatically add createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Product', productSchema);
