// tramar/server/models/Order.js

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [
        {
            // Note: Data is stored directly on the order for historical integrity (denormalization)
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product' // Reference allows populating if needed, but the core data is here
            }
        }
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true,
        // 🟢 Enhancement: Added 'cod' (Cash on Delivery) as a common enum option
        enum: ['stripe', 'paypal', 'cod'] 
    },
    // 🟢 FIX 1: Made paymentResult non-required since it's only set after payment.
    paymentResult: { 
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String }
    },
    // 🟢 FIX 2: Added itemsPrice field (cost of goods before tax/shipping)
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    }
}, {
    // 🟢 FIX 3: Use built-in timestamps to manage createdAt and updatedAt automatically
    timestamps: true 
});

module.exports = mongoose.model('Order', OrderSchema);