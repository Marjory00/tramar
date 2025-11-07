const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protects routes: checks for valid JWT token in headers
exports.protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Expected format: "Bearer <token>"
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
  }

  try {
    // Verify token and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user (without password field) to the request object
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Token is invalid or expired.' });
  }
};

// Admin middleware: ensures the logged-in user has the 'admin' role
exports.admin = (req, res, next) => {
  // We rely on req.user being set by the 'protect' middleware
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, error: 'Not authorized as admin.' });
  }
};