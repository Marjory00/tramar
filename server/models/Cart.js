const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  // Link cart to a specific user
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1, default: 1 },
      price: { type: Number, required: true } // Store price at time of adding to cart
    }
  ],
  totalAmount: { type: Number, required: true, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', CartSchema);