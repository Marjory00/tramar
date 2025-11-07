// Main entry file for the Express server
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app and connect to MongoDB
const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors()); // Enable CORS for client-server communication
app.use(express.json()); // Allows parsing of JSON request body

// --- Routes ---
// Import and use route files
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes')); // Includes Auth and Profile
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// Define the port from .env or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));