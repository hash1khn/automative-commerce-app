const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * @route   POST /api/orders/checkout
 * @desc    Place an order from cart with discounts, tax, and shipping
 * @access  Private (Customer only)
 */
/**
 * @route   POST /api/orders/checkout
 * @desc    Place an order with a fixed 5% tax and a 10% promo code discount
 * @access  Private (Customer only)
 */
exports.placeOrder = async (req, res) => {
  try {
    const { promoCode, shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    // ✅ Apply 5% tax
    const taxRate = 5;
    const taxAmount = (cart.totalPrice * taxRate) / 100;

    // ✅ Apply promo code (10% discount) if valid
    let discount = 0;
    const validPromoCode = "DISCOUNT10"; // Fixed promo code for now

    if (promoCode && promoCode.toUpperCase() === validPromoCode) {
      discount = (cart.totalPrice * 10) / 100;
    }

    // ✅ Apply shipping charge (flat $5)
    const shippingCharge = 5;

    // ✅ Final total price
    const finalTotal = cart.totalPrice - discount + taxAmount + shippingCharge;

    // ✅ Deduct stock
    for (let item of cart.items) {
      let product = await Product.findById(item.product._id);
      product.stock -= item.quantity;
      await product.save();
    }

    // ✅ Create an order
    const order = new Order({
      user: req.user.id,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalPrice: finalTotal,
      discount,
      taxAmount,
      shippingCharge,
      shippingAddress,
    });

    await order.save();

    // ✅ Clear user's cart after order placement
    await Cart.findOneAndDelete({ user: req.user.id });

    return res.status(201).json({
      message: 'Order placed successfully',
      order,
      appliedDiscount: discount,
      taxAmount,
      shippingCharge,
      finalTotal
    });
  } catch (error) {
    console.error('Place Order Error:', error);
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
