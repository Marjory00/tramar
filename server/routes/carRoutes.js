// tramar/server/routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const { 
    getCart, 
    addItemToCart, 
    updateCartItem, 
    removeCartItem, 
    clearCart 
} = require('../controllers/cartController');
// 🟢 Ensure the path is correct based on your file structure (assuming it's just 'auth.js')
const { protect } = require('../middleware/auth'); 

// --- /api/cart ---
// Routes for fetching the cart, adding items, and clearing the entire cart
router.route('/')
    // @route GET /api/cart
    // @access Private
    .get(protect, getCart) 
    
    // @route POST /api/cart (To add a new item or increment quantity of existing item)
    // @access Private
    .post(protect, addItemToCart) 
    
    // @route DELETE /api/cart (To clear the entire cart)
    // @access Private
    .delete(protect, clearCart);

// --- /api/cart/:itemId ---
// Routes for modifying a specific cart item (using the unique Mongoose subdocument ID)
router.route('/:itemId')
    // @route PUT /api/cart/:itemId (To update the quantity of a specific cart item)
    // @access Private
    .put(protect, updateCartItem)
    
    // @route DELETE /api/cart/:itemId (To remove a specific cart item)
    // @access Private
    .delete(protect, removeCartItem);

module.exports = router;