const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * @route   POST /api/cart/add
 * @desc    Add a product to the cart (Stock Validation)
 * @access  Private (Customer only)
 */
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: 'Invalid product or quantity.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // ✅ Check if stock is available
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available.' });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [],
        totalPrice: 0,
      });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      // ✅ Check stock before increasing quantity
      if (cart.items[itemIndex].quantity + quantity > product.stock) {
        return res.status(400).json({ message: 'Exceeding available stock.' });
      }
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    // ✅ Calculate total price dynamically
    cart.totalPrice = await calculateCartTotal(cart.items);
    await cart.save();

    return res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error('Add to Cart Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * @route   GET /api/cart
 * @desc    Get the user's cart
 * @access  Private (Customer only)
 */
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ message: 'Cart is empty.' });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Get Cart Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * @route   PUT /api/cart/update
 * @desc    Update item quantity in the cart (Check Stock)
 * @access  Private (Customer only)
 */
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: 'Invalid product or quantity.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      // ✅ Check stock before updating quantity
      if (quantity > product.stock) {
        return res.status(400).json({ message: 'Not enough stock available.' });
      }

      cart.items[itemIndex].quantity = quantity;
      cart.totalPrice = await calculateCartTotal(cart.items);
      await cart.save();

      return res.status(200).json({ message: 'Cart updated successfully', cart });
    } else {
      return res.status(404).json({ message: 'Product not found in cart.' });
    }
  } catch (error) {
    console.error('Update Cart Item Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * @route   DELETE /api/cart/remove
 * @desc    Remove a product from the cart
 * @access  Private (Customer only)
 */
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    cart.totalPrice = await calculateCartTotal(cart.items);

    await cart.save();
    return res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    console.error('Remove from Cart Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * @route   DELETE /api/cart/clear
 * @desc    Clear the user's cart
 * @access  Private (Customer only)
 */
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    return res.status(200).json({ message: 'Cart cleared successfully.' });
  } catch (error) {
    console.error('Clear Cart Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * @desc    Helper function to calculate total price dynamically
 */
const calculateCartTotal = async (cartItems) => {
  let total = 0;
  for (let item of cartItems) {
    const product = await Product.findById(item.product);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  return total;
};
