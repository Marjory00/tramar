// tramar/server/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProduct, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth'); // Import middleware

// --- Public Routes (Read-Only Access) ---

router.route('/')
    // @route GET /api/products (Get all products, with filtering/pagination/search)
    // @access Public
    .get(getProducts);

router.route('/:id')
    // @route GET /api/products/:id (Get single product by ID)
    // @access Public
    .get(getProduct);

// --- Admin Routes (Create, Update, Delete) ---
// These routes require the user to be logged in AND have the 'admin' role.

// Chain for POST (Creation)
router.route('/')
    // @route POST /api/products (Create a new product)
    // @access Private/Admin
    .post(protect, admin, createProduct); 

// Chain for PUT and DELETE (Update and Deletion)
router.route('/:id')
    // @route PUT /api/products/:id (Update product by ID)
    // @access Private/Admin
    .put(protect, admin, updateProduct) 
    
    // @route DELETE /api/products/:id (Delete product by ID)
    // @access Private/Admin
    .delete(protect, admin, deleteProduct); 

module.exports = router;