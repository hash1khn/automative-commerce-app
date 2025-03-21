const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { simulateCardPayment } = require('../utils/paymentSimulator');
const {sendEmail} = require('../utils/emailHelper');

const getDiscount = (promoCode) => {
  const validPromoCodes = {
    DISCOUNT10: 0.1, // 10% discount
    SAVE20: 0.2,     // 20% discount
    FREESHIP: 5, 
    HARAMKHOR90: 0.9,    // $5 flat discount
  };
  return validPromoCodes[promoCode.toUpperCase()] || 0;
};

/**
 * @route   POST /api/orders/validate-promo
 * @desc    Validate promo code and return discount amount
 * @access  Private (Customer only)
 */
exports.validatePromoCode = async (req, res) => {
  try {
    const { promoCode } = req.body;

    // Validate promo code input
    if (!promoCode || typeof promoCode !== 'string') {
      return res.status(400).json({ message: 'Promo code is required and must be a string.' });
    }

    // Get discount value
    const discount = getDiscount(promoCode);

    // Check if the promo code is valid
    if (discount === 0) {
      return res.status(400).json({
        message: 'Invalid promo code.',
        discount: 0,
      });
    }

    // Determine discount type
    const discountType = discount < 1 ? 'percentage' : 'flat';

    // Return success response
    return res.status(200).json({
      message: 'Promo code applied successfully!',
      discount,
      discountType,
    });
  } catch (error) {
    console.error('Validate Promo Code Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
/**
 * @route   POST /api/orders/payment
 * @desc    Process payment (Only Credit/Debit Card)
 * @access  Private (Customer only)
 */
exports.processPayment = async (req, res) => {
  try {
    const { cartItems, totalAmount, shippingAddress, paymentDetails } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    if (!paymentDetails) {
      return res.status(400).json({ message: 'Payment details are required.' });
    }

    // ✅ Process Card Payment
    const paymentResult = simulateCardPayment(paymentDetails, totalAmount);

    if (!paymentResult.success) {
      return res.status(400).json({
        message: 'Payment failed.',
        error: paymentResult.message,
        errorCode: paymentResult.errorCode || 'PAYMENT_FAILED'
      });
    }

    // ✅ Prepare Payment Details (with required method)
    const paymentInfo = {
      method: 'card', // ✅ Required by schema
      cardType: paymentResult.cardType,
      last4: paymentResult.last4,
      cardHolderName: paymentDetails.cardHolderName
    };

    // ✅ Create Order after successful payment
    const order = new Order({
      user: req.user.id,
      items: cartItems.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice: totalAmount,
      taxAmount: (totalAmount * 5) / 100,
      shippingCharge: 5,
      shippingAddress,
      status: "processing",
      paymentStatus: "successful",
      transactionId: paymentResult.transactionId,
      paymentMethod: "card", // ✅ Required if in schema
      paymentDetails: paymentInfo,
      paymentTimestamp: paymentResult.timestamp || new Date().toISOString()
    });

    await order.save();

    // ✅ Deduct stock
    for (let item of cartItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    // ✅ Clear user's cart
    await Cart.findOneAndDelete({ user: req.user.id });

    // ✅ Send confirmation email
    await sendEmail({
      to: req.user.email,
      subject: 'Order Confirmation',
      text: `Thank you for your purchase! Your order ID is ${order._id}.

Order Summary:
--------------------
Total Price: $${order.totalPrice}
Shipping Address: ${order.shippingAddress}
Payment Method: Credit Card (${paymentInfo.cardType} ending in ${paymentInfo.last4})
Transaction ID: ${paymentResult.transactionId}

Items:
${order.items.map(item => `- ${item.product?.name || 'Product'} (Qty: ${item.quantity}) - $${item.price}`).join('\n')}

Thank you for shopping with us!`
    });

    return res.status(200).json({
      message: 'Payment successful. Order placed!',
      order,
      paymentStatus: "successful",
      transactionId: paymentResult.transactionId
    });
  } catch (error) {
    console.error('Payment Processing Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};



/**
 * @route   GET /api/orders
 * @desc    Get all orders for a user
 * @access  Private (Customer/Admin)
 */
/**
 * @route   GET /api/orders/get-user-orders
 * @desc    Get all orders for a user & count order statuses
 * @access  Private (Customer only)
 */
exports.getUserOrders = async (req, res) => {
  try {
    // Fetch all orders for the logged-in user
    const orders = await Order.find({ user: req.user.id }).populate('items.product');

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found.' });
    }

    // ✅ Count each order status
    const statusCounts = {
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    orders.forEach(order => {
      if (statusCounts[order.status] !== undefined) {
        statusCounts[order.status]++;
      }
    });

    return res.status(200).json({ 
      orders, 
      statusCounts 
    });

  } catch (error) {
    console.error('Get Orders Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


/**
 * @route   GET /api/orders/all
 * @desc    Get all orders (Admin only)
 * @access  Private (Admin)
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('items.product');

    return res.status(200).json(orders);
  } catch (error) {
    console.error('Get All Orders Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (Admin only)
 * @access  Private (Admin)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
