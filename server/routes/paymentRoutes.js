
// Routes for payment management
const express = require('express');
const router = express.Router();
const { 
  createPaymentIntent,
  stripeWebhook
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Protected routes
router.post(
  '/create-payment-intent',
  protect,
  createPaymentIntent
);

// Stripe webhook - needs raw body
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

module.exports = router;