
// Routes for cart management
const express = require('express');
const router = express.Router();
const { 
  getCart, 
  addItemToCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart 
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.route('/')
  .get(protect, getCart)
  .post(protect, addItemToCart)
  .delete(protect, clearCart);

router.route('/:itemId')
  .put(protect, updateCartItem)
  .delete(protect, removeCartItem);

module.exports = router;