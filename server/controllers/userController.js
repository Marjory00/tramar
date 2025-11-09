// tramar/server/controllers/userController.js (Revised)

const User = require('../models/UserModel'); 
const Product = require('../models/ProductModel'); 
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler'); // For simplifying error handling

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Helper function for consistent user response data
const formatUserData = (user, includeToken = true) => {
    const data = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        alerts: user.alerts, 
    };
    if (includeToken) {
        data.token = generateToken(user._id);
    }
    return data;
};

// @desc      Register a new user
// @route     POST /api/users/register
// @access    Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please enter all fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password });

    if (user) {
        // 🟢 FIX 1: Simplified response body
        res.status(201).json(formatUserData(user));
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc      Authenticate user & get token (Login)
// @route     POST /api/users/login
// @access    Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    // The .select('+password') is correct and necessary if 'password' is set to select: false in the schema.
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        // 🟢 FIX 2: Simplified response body
        res.json(formatUserData(user));
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc      Get logged in user profile
// @route     GET /api/users/profile
// @access    Private
const getUserProfile = asyncHandler(async (req, res) => {
    // Exclude password from the final object
    const user = await User.findById(req.user._id).select('-password'); 

    if (user) {
        // 🟢 FIX 3: Simplified response body, no token needed for profile fetch
        res.json(formatUserData(user, false)); 
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc      Admin: Get all users
// @route     GET /api/users
// @access    Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    // We assume a middleware handles the Private/Admin check before this point.
    const users = await User.find({}).select('-password');
    // 🟢 FIX 4: Simplified response body
    res.json(users); 
});


// ----------------------------------------------------
// --- STOCK ALERT SYSTEM FUNCTIONS ---
// ----------------------------------------------------

// @desc      Subscribe user to a product stock alert
// @route     POST /api/users/alerts/:productId
// @access    Private
const subscribeToAlert = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    if (!productId) {
        res.status(400);
        throw new Error('Product ID is required.');
    }
    
    // Check for invalid Product ID format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400);
        throw new Error('Invalid Product ID format.');
    }

    // 1. Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found.');
    }
    
    // 2. Find the user
    const user = await User.findById(userId);

    if (user) {
        // 3. Check if the user is already subscribed
        const isSubscribed = user.alerts.some(alert => alert.product.toString() === productId);

        if (isSubscribed) {
            res.status(400);
            throw new Error(`Already subscribed to alerts for ${product.name}.`);
        }

        // 4. Add the product ID to the user's alerts array
        user.alerts.push({ product: productId, dateSubscribed: Date.now() });
        await user.save();
        
        // 🟢 FIX 5: Simplified success response
        res.status(201).json({ 
            message: `Successfully subscribed to alerts for ${product.name}.`,
            alerts: user.alerts 
        });
    } else {
        res.status(404);
        throw new Error('User not found.');
    }
});

// @desc      Unsubscribe user from a product stock alert
// @route     DELETE /api/users/alerts/:productId
// @access    Private
const unsubscribeFromAlert = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    // 1. Find the user
    const user = await User.findById(userId);

    if (user) {
        // 2. Filter out the product from the user's alerts array
        const initialAlertCount = user.alerts.length;
        user.alerts = user.alerts.filter(alert => alert.product.toString() !== productId);
        
        // 3. Check if an alert was actually removed
        if (user.alerts.length === initialAlertCount) {
             res.status(404);
             throw new Error('Not subscribed to this product alert.');
        }

        await user.save();

        // 🟢 FIX 6: Simplified success response
        res.json({ 
            message: 'Successfully unsubscribed from the product alert.',
            alerts: user.alerts 
        });
    } else {
        res.status(404);
        throw new Error('User not found.');
    }
});


module.exports = {
    generateToken,
    registerUser,
    loginUser,
    getUserProfile,
    getUsers,
    subscribeToAlert,
    unsubscribeFromAlert,
};