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
  paymentMethod: { 
    type: String, 
    enum: ['card', 'upi', 'paypal'], 
    required: true 
  },
  transactionId: { 
    type: String,
    trim: true
  },
  paymentDetails: {
    // Card payment fields
    cardType: String,
    last4: String,
    cardHolderName: String,
    
    // PayPal payment fields
    email: String,
    
    // UPI payment fields
    upiId: String,
    referenceNumber: String,
    
    // Generic payment fields
    method: {
      type: String,
      enum: ['card', 'upi', 'paypal'],
      required: true
    }
  },
  paymentTimestamp: { 
    type: Date
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ transactionId: 1 });

module.exports = mongoose.model('Order', orderSchema);