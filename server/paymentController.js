
// Payment controller for Stripe payment integration
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

// @desc    Create payment intent with Stripe
// @route   POST /api/payment/create-payment-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authorized to access this order' 
      });
    }

    // Check if order is already paid
    if (order.isPaid) {
      return res.status(400).json({ 
        success: false, 
        error: 'Order is already paid' 
      });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'usd',
      // Verify your integration in this guide by including this parameter
      metadata: { orderId: order._id.toString() },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Process webhook events from Stripe
// @route   POST /api/payment/webhook
// @access  Public
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentIntentSucceeded(paymentIntent);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};

// Helper function to handle payment_intent.succeeded event
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  try {
    // Get orderId from metadata
    const { orderId } = paymentIntent.metadata;

    if (!orderId) {
      console.error('No orderId found in payment metadata');
      return;
    }

    // Update order
    await Order.findByIdAndUpdate(
      orderId,
      {
        isPaid: true,
        paidAt: Date.now(),
        paymentResult: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: paymentIntent.receipt_email
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    console.log(`Order ${orderId} marked as paid`);
  } catch (error) {
    console.error('Error updating order after payment:', error);
  }
};