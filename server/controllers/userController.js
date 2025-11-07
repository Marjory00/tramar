
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Please enter all fields' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, error: 'User already exists' });
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400).json({ success: false, error: 'Invalid user data' });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  // Use .select('+password') to retrieve the password hash for comparison
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid email or password' });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/users/profile
// @access  Private (Requires JWT via 'protect' middleware)
exports.getUserProfile = async (req, res) => {
  // req.user is populated by the 'protect' middleware
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    res.status(404).json({ success: false, error: 'User not found' });
  }
};

// @desc    Admin: Get all users
// @route   GET /api/users
// @access  Private/Admin (Requires 'protect' and 'admin' middleware)
exports.getUsers = async (req, res) => {
  const users = await User.find({});
  res.json({ success: true, count: users.length, data: users });
};