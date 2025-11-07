const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  getUsers 
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private/Protected Routes
router.route('/profile').get(protect, getUserProfile); // User Registration Feature

// Admin Routes (Admin Dashboard Access)
router.route('/').get(protect, admin, getUsers); // Admin feature: List all users

module.exports = router;