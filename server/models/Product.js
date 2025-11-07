const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  image: { type: String, default: 'no-image.jpg' },
  category: { type: String, required: true },
  countInStock: { type: Number, required: true, default: 0 },
  // Simplified rating/review logic
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);