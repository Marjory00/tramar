// tramar/server.js (Main entry file for the Express server)

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { notFound, errorHandler } = require('./middleware/errorMiddleware'); // 🟢 FIX 1: Import error handlers

// Load environment variables from .env file
dotenv.config();

// --- Initialization ---
const app = express();

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully!'))
    // 🟢 Enhancement: Use process.exit(1) on failure to stop the app
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); 
    });

// --- Core Middleware ---

// 🟢 Enhancement: Configure CORS for better security/flexibility
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : '*', // Replace '*' with client URL in prod
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions)); 

// Body Parser Middleware: Must come AFTER the route where the raw body is needed (if handled here).
// Since the raw body for the webhook is handled in the router/middleware, we can safely put this here.
app.use(express.json()); 


// --- Routes ---

// Health Check / Root Route
app.get('/', (req, res) => {
    res.send(`API is running in ${process.env.NODE_ENV} mode...`);
});

// Import and use route files
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// --- Error Handling Middleware (Must be LAST) ---

// 🟢 FIX 2: Handle 404 Not Found Errors
app.use(notFound);

// 🟢 FIX 3: Central Error Handler (Catches errors thrown by asyncHandler)
app.use(errorHandler);


// --- Server Start ---

// Define the port from .env or default to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));