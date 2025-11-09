// tramar/server/routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const { 
    createPaymentIntent,
    stripeWebhook
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// --- /api/payment/create-payment-intent ---
router.post(
    // @route POST /api/payment/create-payment-intent
    // @access Private
    '/create-payment-intent',
    protect,
    createPaymentIntent
);

// --- /api/payment/webhook ---
// Stripe webhook requires the raw body buffer to verify the signature.
// This route MUST NOT use the standard express.json() parser.
router.post(
    // @route POST /api/payment/webhook
    // @access Public (Stripe server-to-server)
    '/webhook',
    // 🟢 FIX 1: Using a JSON limit option is good practice, although not strictly necessary for functionality.
    express.raw({ type: 'application/json', limit: '5mb' }), 
    stripeWebhook
);

module.exports = router;