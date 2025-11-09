// tramar/server/models/UserModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AlertSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    dateSubscribed: {
        type: Date,
        default: Date.now,
    }
}, { _id: false }); // Do not create an _id for the subdocument

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        // 🟢 Enhancement: Add email validation
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    // 'select: false' prevents the password from being returned by default queries
    password: { 
        type: String, 
        required: true, 
        minlength: 6, // 🟢 Enhancement: Enforce minimum length
        select: false 
    }, 
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    // 🟢 Enhancement: Include the alerts array (from userController fix)
    alerts: [AlertSchema], 
    
}, {
    // 🟢 FIX 1: Use built-in timestamps for createdAt and updatedAt
    timestamps: true 
});

// --- Middleware: Hashing Password ---
// Middleware to hash password before saving a new user or updating password
UserSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// --- Instance Method: Password Comparison ---
// Instance method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    // Compare the entered password with the hashed password stored in the document
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);