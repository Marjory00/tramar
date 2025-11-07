
// Cart controller for shopping cart management
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    // Find cart by user ID
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price image'
    });

    // If no cart exists, return empty cart
    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [], totalAmount: 0 }
      });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        error: 'Please provide product ID and quantity'
      });
    }

    // Find product
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Check if product is in stock
    if (product.countInStock < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Product out of stock'
      });
    }

    // Find user's cart
    let cart = await Cart.findOne({ user: req.user._id });

    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [
          {
            product: productId,
            quantity,
            price: product.price
          }
        ],
        totalAmount: product.price * quantity
      });
    } else {
      // Check if product already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        cart.items[existingItemIndex].quantity += parseInt(quantity);
      } else {
        // Add new item to cart
        cart.items.push({
          product: productId,
          quantity,
          price: product.price
        });
      }

      // Recalculate total amount
      cart.totalAmount = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      // Save updated cart
      await cart.save();
    }

    // Return updated cart
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price image'
    });

    res.status(200).json({
      success: true,
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Validate input
    if (!quantity) {
      return res.status(400).json({
        success: false,
        error: 'Please provide quantity'
      });
    }

    // Find cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }

    // Check if product has enough stock
    const product = await Product.findById(cart.items[itemIndex].product);
    
    if (product.countInStock < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Product out of stock'
      });
    }

    // Update item quantity
    cart.items[itemIndex].quantity = quantity;

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Save updated cart
    await cart.save();

    // Return updated cart
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price image'
    });

    res.status(200).json({
      success: true,
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Find cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }

    // Remove item from cart
    cart.items.splice(itemIndex, 1);

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Save updated cart
    await cart.save();

    // Return updated cart
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price image'
    });

    res.status(200).json({
      success: true,
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    // Find and delete cart
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: { items: [], totalAmount: 0 }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};