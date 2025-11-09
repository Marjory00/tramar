// tramar/server/middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler'); 

// --- Protect Middleware ---
// @desc Protects routes: checks for valid JWT token in headers
// @access Private
const protect = asyncHandler(async (req, res, next) => {
    let token;
    
    // Check for token in 'Authorization: Bearer <token>' header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        res.status(401); 
        throw new Error('Access denied. No token provided.');
    }

    try {
        // Verify token and get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user (without password field) to the request object
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized, user not found');
        }
        
        next();
    } catch (err) {
        // Catches jwt.verify errors (expired, invalid signature)
        res.status(401);
        throw new Error('Token is invalid or expired.');
    }
});

// --- Admin Middleware ---
// @desc Admin middleware: ensures the logged-in user has the 'admin' role
// @access Private/Admin
const admin = (req, res, next) => {
    // Relies on req.user being set by the 'protect' middleware
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403); // Forbidden
        throw new Error('Not authorized to access this route. Admin privileges required.');
    }
};

module.exports = { protect, admin };