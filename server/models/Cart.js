// tramar/server/models/Cart.js

const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    // Link cart to a specific user
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        unique: true 
    },
    items: [
        {
            // The product ID
            product: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product', 
                required: true 
            },
            // Quantity of the product
            quantity: { 
                type: Number, 
                required: true, 
                min: 1, 
                default: 1 
            },
            // Price at time of adding to cart (Important for price change stability)
            price: { 
                type: Number, 
                required: true 
            }
        }
    ],
    // 🟢 FIX 1: Set totalAmount to allow null initially, but ensure calculation
    totalAmount: { 
        type: Number, 
        default: 0 
    }
}, {
    // 🟢 FIX 2: Use built-in timestamps for createdAt and updatedAt
    timestamps: true 
});


// 🟢 FIX 3: Add a pre-save hook to calculate totalAmount automatically
CartSchema.pre('save', function(next) {
    // Check if items array was modified
    if (this.isModified('items') || this.isNew) {
        // Recalculate total amount by summing up item price * quantity
        this.totalAmount = this.items.reduce((total, item) => {
            // Ensure price and quantity are numbers before multiplication
            const itemPrice = typeof item.price === 'number' ? item.price : 0;
            const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0;
            return total + (itemPrice * itemQuantity);
        }, 0);
        // Round to 2 decimal places to avoid floating point issues
        this.totalAmount = Math.round(this.totalAmount * 100) / 100;
    }
    next();
});

module.exports = mongoose.model('Cart', CartSchema);