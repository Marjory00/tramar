// tramar/server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    getUsers,
    subscribeToAlert, 
    unsubscribeFromAlert 
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

// --- Public Routes ---
// For registration and authentication (login)
router.post('/register', registerUser); // @route POST /api/users/register
router.post('/login', loginUser);       // @route POST /api/users/login

// --- Protected Routes (Profile & Admin List) ---

router.route('/')
    // @route GET /api/users (Admin feature: List all users)
    // @access Private/Admin
    .get(protect, admin, getUsers); 
    // 🟢 FIX 1: Grouped the Admin GET route onto the base '/' route

router.route('/profile')
    // @route GET /api/users/profile (Get logged-in user profile)
    // @access Private
    .get(protect, getUserProfile); 

// --- Stock Alert Routes ---

// @route POST /api/users/alerts/:productId (Subscribe to alert)
// @access Private
router.post('/alerts/:productId', protect, subscribeToAlert); 

// @route DELETE /api/users/alerts/:productId (Unsubscribe from alert)
// @access Private
router.delete('/alerts/:productId', protect, unsubscribeFromAlert);

module.exports = router;