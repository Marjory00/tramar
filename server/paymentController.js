// tramar/server/controllers/paymentController.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const asyncHandler = require('express-async-handler'); // 🟢 FIX 1: Import asyncHandler

// --- Helper Functions ---

// Helper function to handle payment_intent.succeeded event
const handlePaymentIntentSucceeded = async (paymentIntent) => {
    try {
        // Get orderId from metadata
        const { orderId } = paymentIntent.metadata;

        if (!orderId) {
            console.error('No orderId found in payment metadata');
            return;
        }

        // Check if the order is already paid to avoid redundant DB writes
        const existingOrder = await Order.findById(orderId);
        if (!existingOrder) {
            console.error(`Order with ID ${orderId} not found for webhook processing.`);
            return;
        }
        if (existingOrder.isPaid) {
            console.log(`Order ${orderId} is already paid. Skipping update.`);
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
                    // Use Stripe's timestamp, or current time if needed
                    update_time: paymentIntent.created ? new Date(paymentIntent.created * 1000).toISOString() : new Date().toISOString(),
                    // receipt_email is more reliable than payer.email_address here
                    email_address: paymentIntent.receipt_email 
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        console.log(`Order ${orderId} marked as paid successfully.`);
    } catch (error) {
        // Log the error but DO NOT rethrow it, as this is an async background task.
        console.error('CRITICAL: Error updating order after payment webhook:', error);
    }
};

// @desc      Create payment intent with Stripe
// @route     POST /api/payment/create-payment-intent
// @access    Private
exports.createPaymentIntent = asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to access this order');
    }

    // Check if order is already paid
    if (order.isPaid) {
        res.status(400);
        throw new Error('Order is already paid');
    }

    // Check for COD payment method
    if (order.paymentMethod === 'cod') {
        res.status(400);
        throw new Error('Order placed with Cash on Delivery. Payment intent not needed.');
    }
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.totalPrice * 100), // Convert to cents
        currency: 'usd',
        metadata: { 
            orderId: order._id.toString(),
            userId: req.user._id.toString() // 🟢 Enhancement: Add user ID to metadata
        },
        automatic_payment_methods: {
            enabled: true,
        },
    });

    // 🟢 FIX 2: Simplified JSON response body
    res.status(200).json({
        clientSecret: paymentIntent.client_secret
    });
});

// @desc      Process webhook events from Stripe
// @route     POST /api/payment/webhook
// @access    Public
exports.stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error("STRIPE_WEBHOOK_SECRET is not set.");
        return res.status(500).send('Webhook secret missing.');
    }
    
    let event;

    try {
        // Ensure req.body is the raw buffer from the router middleware
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            webhookSecret
        );
    } catch (err) {
        // Failure in signature verification (400 Bad Request)
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            await handlePaymentIntentSucceeded(paymentIntentSucceeded);
            break;
        case 'payment_intent.payment_failed':
            const paymentIntentFailed = event.data.object;
            console.log(`Payment Intent Failed for Order ID: ${paymentIntentFailed.metadata.orderId}`);
            // Future feature: Handle failed payment (e.g., send user email)
            break;
        case 'checkout.session.completed':
            // 🟢 Enhancement: Handle checkout session events if using Stripe Checkout
            // const session = event.data.object;
            // if (session.payment_status === 'paid') { ... }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
};