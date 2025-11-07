const express = require('express');
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public Routes (Product Listings Feature)
router.route('/').get(getProducts);
router.route('/:id').get(getProduct);

// Admin Dashboard Routes (Product Management)
router.route('/')
  .post(protect, admin, createProduct); // Create product (Admin only)
router.route('/:id')
  .put(protect, admin, updateProduct)   // Update product (Admin only)
  .delete(protect, admin, deleteProduct); // Delete product (Admin only)

module.exports = router;