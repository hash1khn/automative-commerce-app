const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true 
      },
      price: { 
        type: Number, 
        required: true 
      }
    }
  ],
  totalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  shippingCharge: { type: Number, default: 5 },
  shippingAddress: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'shipped', 'delivered'], 
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'successful', 'failed'], 
    default: 'pending' 
  },
  paymentMethod: { type: String, default: 'card' },
  paymentDetails: {
    cardNumber: String, // Only store last 4 digits
    expiryDate: String,
    cardHolderName: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
