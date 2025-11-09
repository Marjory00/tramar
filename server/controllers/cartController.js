// tramar/server/controllers/cartController.js (Assuming this is the path)

const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Utility function to populate and return the cart consistently
const getPopulatedCart = async (cartId) => {
    return Cart.findById(cartId).populate({
        path: 'items.product',
        select: 'name price image countInStock' // Added countInStock for client-side checks
    });
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
    try {
        // Find cart by user ID
        const cart = await Cart.findOne({ user: req.user._id });

        // If no cart exists, return an empty cart structure
        if (!cart) {
            return res.status(200).json({ items: [], totalAmount: 0 });
        }

        // Return the cart, populated with product details
        const populatedCart = await getPopulatedCart(cart._id);

        // 🟢 FIX 1: Simplified response structure (removing success: true/false)
        res.status(200).json(populatedCart);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addItemToCart = async (req, res) => {
    const { productId, quantity: qty } = req.body;
    const quantity = parseInt(qty); // Ensure quantity is an integer

    try {
        // 1. Input Validation
        if (!productId || !quantity || quantity <= 0) {
            res.status(400);
            throw new Error('Please provide a valid product ID and quantity');
        }

        // 2. Find Product and check stock
        const product = await Product.findById(productId);
        
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }
        
        let cart = await Cart.findOne({ user: req.user._id });

        // 3. Handle Stock Check
        if (cart) {
            const existingItem = cart.items.find(item => item.product.toString() === productId);
            let totalRequestedQty = quantity;
            
            if (existingItem) {
                totalRequestedQty += existingItem.quantity;
            }

            if (product.countInStock < totalRequestedQty) {
                res.status(400);
                throw new Error(`Insufficient stock. Only ${product.countInStock} available.`);
            }
        } else if (product.countInStock < quantity) {
            // Case for new cart
            res.status(400);
            throw new Error(`Insufficient stock. Only ${product.countInStock} available.`);
        }

        // 4. Update or Create Cart
        if (!cart) {
            // Create a new cart
            cart = await Cart.create({
                user: req.user._id,
                items: [{ product: productId, quantity, price: product.price }],
                // totalAmount will be calculated by the model's pre-save hook (best practice)
            });
        } else {
            const existingItemIndex = cart.items.findIndex(
                item => item.product.toString() === productId
            );

            if (existingItemIndex !== -1) {
                // Update quantity of existing item
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item to cart
                cart.items.push({
                    product: productId,
                    quantity,
                    price: product.price
                });
            }
            
            // 🟢 FIX 2: Recalculate totalAmount BEFORE save if no Mongoose middleware is used.
            // *NOTE: If you use a Mongoose pre-save hook in your Cart model to handle totalAmount 
            // calculation, you can remove this manual calculation.*
            cart.totalAmount = cart.items.reduce(
                (total, item) => total + (item.price * item.quantity),
                0
            );

            await cart.save();
        }

        // 5. Return updated populated cart
        const updatedCart = await getPopulatedCart(cart._id);
        res.status(200).json(updatedCart);

    } catch (error) {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
    const { itemId } = req.params;
    const { quantity: qty } = req.body;
    const quantity = parseInt(qty);

    try {
        if (!quantity || quantity <= 0) {
            res.status(400);
            throw new Error('Please provide a valid quantity');
        }

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            res.status(404);
            throw new Error('Cart not found');
        }

        const itemIndex = cart.items.findIndex(
            item => item._id.toString() === itemId
        );

        if (itemIndex === -1) {
            res.status(404);
            throw new Error('Item not found in cart');
        }

        // 🟢 FIX 3: Re-fetch product only if quantity is changing and check stock against NEW quantity
        const productId = cart.items[itemIndex].product;
        const product = await Product.findById(productId);
        
        if (!product) {
            res.status(404);
            throw new Error('Product referenced in cart no longer exists.');
        }

        if (product.countInStock < quantity) {
            res.status(400);
            throw new Error(`Insufficient stock. Only ${product.countInStock} available for ${product.name}.`);
        }

        // Update item quantity
        cart.items[itemIndex].quantity = quantity;

        // Save updated cart (Mongoose pre-save hook should handle totalAmount)
        cart.totalAmount = cart.items.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );
        await cart.save();

        // Return updated populated cart
        const updatedCart = await getPopulatedCart(cart._id);
        res.status(200).json(updatedCart);
        
    } catch (error) {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeCartItem = async (req, res) => {
    const { itemId } = req.params;

    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            res.status(404);
            throw new Error('Cart not found');
        }

        const itemIndex = cart.items.findIndex(
            item => item._id.toString() === itemId
        );

        if (itemIndex === -1) {
            res.status(404);
            throw new Error('Item not found in cart');
        }

        // Remove item from cart
        cart.items.splice(itemIndex, 1);

        // If cart is now empty, consider deleting it (optional optimization)
        if (cart.items.length === 0) {
             await Cart.deleteOne({ _id: cart._id });
             return res.status(200).json({ items: [], totalAmount: 0 });
        }
        
        // Save and return updated cart
        cart.totalAmount = cart.items.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );
        await cart.save();
        
        const updatedCart = await getPopulatedCart(cart._id);
        res.status(200).json(updatedCart);
        
    } catch (error) {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
    try {
        // Find and delete cart
        await Cart.findOneAndDelete({ user: req.user._id });

        // Return empty cart structure
        res.status(200).json({ items: [], totalAmount: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};