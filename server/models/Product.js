// tramar/server/models/Product.js

const mongoose = require('mongoose');

// --- Compatibility Sub-Schema (for embedded technical attributes) ---
const CompatibilitySchema = new mongoose.Schema({
    // Common fields
    manufacturer: { type: String, trim: true },
    modelNumber: { type: String, trim: true },
    
    // Core technical keys for Compatibility Checker logic
    // Example: For CPU/Motherboard pairing
    socketType: { 
        type: String, 
        trim: true, 
        enum: ['AM4', 'AM5', 'LGA1700', 'LGA1200', 'N/A'],
        default: 'N/A' // 🟢 FIX 1: Set default to N/A for clean initialization
    }, 
    
    // Example: For RAM/Motherboard pairing
    memoryType: { 
        type: String, 
        trim: true, 
        enum: ['DDR4', 'DDR5', 'N/A'],
        default: 'N/A' // 🟢 FIX 1: Set default to N/A
    },
    
    // Example: For PSU/GPU/CPU power check
    powerDraw: { type: Number, default: 0, min: 0 }, // Power draw in Watts
    
    // Example: For Case/GPU/Cooler fitting
    dimensionKey: { type: String, trim: true }, // e.g., 'ATX', 'mATX', 'ITX' for Motherboards/Cases
    
    // General Compatibility Tag (useful for complex exclusions or specific warnings)
    compatibilityKey: { type: String, trim: true }
}, { _id: false }); // 🟢 Enhancement: Exclude _id for the subdocument as it's not strictly necessary

// --- Product Schema (Main Document) ---
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, index: true }, // Indexed for search
    description: { type: String, required: true },
    
    // Pricing and Inventory
    price: { type: Number, required: true, default: 0, min: 0 },
    countInStock: { type: Number, required: true, default: 0, min: 0 },
    
    // Media
    image: { 
        type: String, 
        required: true, 
        default: 'placeholder.jpg' 
    }, 
    
    // Classification
    category: { type: String, required: true, index: true }, // Indexed for category filtering
    brand: { type: String, trim: true, index: true }, // Indexed for brand filtering
    
    // Compatibility Attributes (Embed the sub-schema for technical details)
    techSpecs: {
        type: CompatibilitySchema,
        required: true, 
        // 🟢 FIX 2: Ensure an empty object/sub-document is created if nothing is passed
        default: () => ({}), 
    },

    // Simplified rating/review logic
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
    
    // Link to the user who created the product (useful for admin/creator tracking)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // Assuming products must be created by a user (admin)
    }
}, {
    // 🟢 FIX 3: Use built-in timestamps for createdAt and updatedAt
    timestamps: true 
});

// Create a composite index for fast querying by category and stock availability
ProductSchema.index({ category: 1, countInStock: -1 });

// 🟢 Enhancement: Add a pre-delete hook to handle related models (e.g., reviews, carts)
// If you had a separate Review model, this is where you'd delete associated reviews.
// Example (assuming a separate Review model exists):
/*
ProductSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    await this.model('Review').deleteMany({ product: this._id });
    next();
});
*/

module.exports = mongoose.model('Product', ProductSchema);