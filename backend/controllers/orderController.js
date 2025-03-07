const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { simulateCardPayment } = require('../utils/paymentSimulator');
const sendEmail =require('../utils/emailHelper');

/**
 * @route   POST /api/orders/validate-promo
 * @desc    Validate promo code and return discount amount
 * @access  Private (Customer only)
 */
exports.validatePromoCode = async (req, res) => {
  try {
    const { promoCode, subtotal } = req.body;

    if (!subtotal || subtotal <= 0) {
      return res.status(400).json({ message: 'Invalid subtotal amount.' });
    }

    // ✅ Apply promo code (10% discount) if valid
    let discount = 0;
    const validPromoCode = "DISCOUNT10";
    if (promoCode && promoCode.toUpperCase() === validPromoCode) {
      discount = (subtotal * 10) / 100;
    }

    return res.status(200).json({
      message: discount > 0 ? 'Promo code applied successfully!' : 'Invalid promo code.',
      discount
    });
  } catch (error) {
    console.error('Validate Promo Code Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * @route   POST /api/orders/payment
 * @desc    Process payment and create order
 * @access  Private (Customer only)
 */
exports.processPayment = async (req, res) => {
  try {
    const { cartItems, totalAmount, shippingAddress, cardDetails } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    // ✅ Simulate payment processing
    const paymentResult = simulateCardPayment(cardDetails, totalAmount);

    if (!paymentResult.success) {
      return res.status(400).json({ message: 'Payment failed.', error: paymentResult.message });
    }

    // ✅ Create order after successful payment
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
      shippingAddress: shippingAddress, // Now a single field
      status: "paid",
      paymentStatus: "successful",
      paymentDetails: {
        cardNumber: cardDetails.cardNumber.slice(-4),
        expiryDate: cardDetails.expiryDate,
        cardHolderName: cardDetails.cardHolderName
      }
    });

    await order.save();

    // ✅ Deduct stock after successful payment
    for (let item of cartItems) {
      let product = await Product.findById(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    // ✅ Clear user's cart
    await Cart.findOneAndDelete({ user: req.user.id });

    // ✅ Send Order Confirmation Email
    await sendEmail({
      to: req.user.email,
      subject: 'Order Confirmation',
      text: `Thank you for your purchase! Your order ID is ${order._id}.

Order Summary:
--------------------
Total Price: $${order.totalPrice}
Shipping Address: ${order.shippingAddress}

Items:
${order.items.map(item => `- ${item.product.name} (Qty: ${item.quantity}) - $${item.price}`).join('\n')}

Thank you for shopping with us!`,
    });

    return res.status(200).json({
      message: 'Payment successful. Order placed!',
      order,
      paymentStatus: "successful"
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
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found.' });
    }

    return res.status(200).json(orders);
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
