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
    default: 0, 
    min: 0,
    max: 5,
  },
  images: [
    {
      type: String, 
      required: true,
    },
  ],
  stock: {
    type: Number,
    required: true,
    min: 0, // Ensure no negative stock
    default: 10, // Default stock value
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
