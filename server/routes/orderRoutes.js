// tramar/server/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getOrderById, 
    updateOrderToPaid, 
    updateOrderToDelivered,
    getMyOrders,
    getOrders
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// --- /api/orders ---
router.route('/')
    // @route POST /api/orders (Create a new order)
    // @access Private (User must be logged in to create an order)
    .post(protect, createOrder) 
    
    // @route GET /api/orders (Get ALL orders for ADMIN view)
    // @access Private/Admin
    .get(protect, admin, getOrders); // Requires both protection and admin role

// --- /api/orders/myorders ---
router.route('/myorders')
    // @route GET /api/orders/myorders (Get orders belonging to the logged-in user)
    // @access Private
    .get(protect, getMyOrders);

// --- /api/orders/:id ---
router.route('/:id')
    // @route GET /api/orders/:id (Get single order by ID)
    // @access Private (User must be owner OR admin, check handled in controller)
    .get(protect, getOrderById);

// --- /api/orders/:id/pay ---
router.route('/:id/pay')
    // @route PUT /api/orders/:id/pay (Mark order as paid)
    // @access Private
    .put(protect, updateOrderToPaid);

// --- /api/orders/:id/deliver ---
router.route('/:id/deliver')
    // @route PUT /api/orders/:id/deliver (Mark order as delivered)
    // @access Private/Admin
    .put(protect, admin, updateOrderToDelivered); // Requires both protection and admin role

module.exports = router;