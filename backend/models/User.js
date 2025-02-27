const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: false, // Optional field
    match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'], // Basic international format validation
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: ['customer', 'admin'], // Only "customer" or "admin" allowed
    default: 'customer', // Default is customer
  },
  verified: {
    type: Boolean,
    default: false, // Email verification flag
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps automatically
});

module.exports = mongoose.model('User', userSchema);
