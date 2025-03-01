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
  totalPrice: { 
    type: Number, 
    required: true 
  },
  discount: { 
    type: Number, 
    default: 0 
  },
  taxAmount: { 
    type: Number, 
    default: 0 
  },
  shippingCharge: { 
    type: Number, 
    default: 5 
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  status: { 
    type: String, 
    enum: ['pending', 'shipped', 'delivered'], 
    default: 'pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Order', orderSchema);
