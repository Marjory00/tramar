// tramar/server/controllers/userController.js (Assuming this is the path)

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    // Token valid for 30 days
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Standard response structure for user data
const formatUserData = (user, includeToken = true) => {
    const data = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        // Assuming 'address' is a field, but only available if loaded (e.g., in profile route)
        address: user.address || {}, 
    };
    if (includeToken) {
        data.token = generateToken(user._id);
    }
    return data;
};

// @desc      Register a new user
// @route     POST /api/users/register
// @access    Public
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 1. Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            // 🟢 FIX 1: Use standard Express error response structure and status code (400)
            res.status(400);
            throw new Error('User already exists');
        }

        // 2. Create new user
        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            // 🟢 FIX 2: Use cleaner helper function for response
            res.status(201).json(formatUserData(user));
        } else {
            res.status(400);
            throw new Error('Invalid user data received');
        }
    } catch (error) {
        // Handle explicit status codes set above, or default to 500
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc      Login user
// @route     POST /api/users/login
// @access    Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user by email and explicitly select the password field
        // The .select('+password') is correct and necessary if 'password' is set to select: false in the schema.
        const user = await User.findOne({ email }).select('+password');

        // 2. Check if user exists and password matches
        if (user && (await user.matchPassword(password))) {
            // 🟢 FIX 3: Use cleaner helper function for response
            res.json(formatUserData(user));
        } else {
            // 🟢 FIX 4: Use standard Express status code (401 Unauthorized)
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc      Get user profile
// @route     GET /api/users/profile
// @access    Private (requires protection middleware to set req.user)
exports.getUserProfile = async (req, res) => {
    // req.user is set by the protect middleware
    try {
        const user = await User.findById(req.user._id).select('-password'); // Exclude password field
        
        if (user) {
            // 🟢 FIX 5: Use cleaner helper function and explicitly exclude token
            res.json(formatUserData(user, false));
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc      Update user profile
// @route     PUT /api/users/profile
// @access    Private
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Update fields
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.address = req.body.address || user.address;
            
            // Password logic relies on Mongoose pre-save hook for hashing
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            
            // 🟢 FIX 6: Use cleaner helper function for response
            res.json(formatUserData(updatedUser));
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({ message: error.message });
    }
};