const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  getUsers,
  subscribeToAlert,   // <-- NEW: Import subscribe function
  unsubscribeFromAlert // <-- NEW: Import unsubscribe function
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private/Protected Routes
router.route('/profile').get(protect, getUserProfile); // User Profile

// ----------------------------------------------------
// --- NEW STOCK ALERT ROUTES ---
// ----------------------------------------------------

// Subscribe user to a product alert
router.post('/alerts/:productId', protect, subscribeToAlert); 

// Unsubscribe user from a product alert
router.delete('/alerts/:productId', protect, unsubscribeFromAlert);

// ----------------------------------------------------
// --- ADMIN ROUTES ---
// ----------------------------------------------------

// Admin feature: List all users
router.route('/').get(protect, admin, getUsers); 

module.exports = router;