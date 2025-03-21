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
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },  
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'successful', 'failed'], 
    default: 'pending' 
  },
  transactionId: { 
    type: String,
    trim: true
  },
  paymentMethod: {
    type: String,
    enum: ['card'],
    default: 'card' // defaulting since only card is used
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['card'],
      default: 'card' // defaulting as only card is supported
    },
    cardType: String,
    last4: String,
    cardHolderName: String
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

// Indexes for performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ transactionId: 1 });

module.exports = mongoose.model('Order', orderSchema);
