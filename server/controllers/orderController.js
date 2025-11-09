// tramar/server/controllers/orderController.js (Assuming this is the path)

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose'); // Import Mongoose for transaction support

// --- Helper Functions ---

const handleExpressError = (res, error) => {
    // Utility to ensure correct status code is sent on error
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
};

// @desc      Create new order
// @route     POST /api/orders
// @access    Private
exports.createOrder = async (req, res) => {
    // 🟢 FIX 1: Begin a session for atomicity (Requires MongoDB Replica Set/Sharded Cluster)
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { 
            orderItems, 
            shippingAddress, 
            paymentMethod 
        } = req.body;

        // 1. Validate input
        if (!orderItems || orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items provided');
        }
        
        // 2. Recalculate prices (Best practice: never trust client-side prices)
        const itemsToProcess = [];
        let itemsPrice = 0;

        for (const item of orderItems) {
            const product = await Product.findById(item.product).session(session);

            if (!product) {
                res.status(404);
                throw new Error(`Product with ID ${item.product} not found.`);
            }

            if (product.countInStock < item.quantity) {
                res.status(400);
                throw new Error(`Product "${product.name}" is out of stock or requested quantity exceeds available stock.`);
            }

            // Use the current price from the database, not the one from req.body
            itemsToProcess.push({
                name: product.name,
                quantity: item.quantity,
                image: product.image,
                price: product.price, // Use DB price
                product: product._id
            });
            itemsPrice += product.price * item.quantity;
        }

        // Calculate final prices based on server-verified itemsPrice
        const taxPrice = Number((itemsPrice * 0.15).toFixed(2));
        const shippingPrice = itemsPrice > 100 ? 0.00 : 10.00;
        const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));
        
        // 3. Create order
        const order = new Order({
            user: req.user._id,
            orderItems: itemsToProcess, // Use server-verified itemsToProcess
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        const createdOrder = await order.save({ session });

        // 4. Update product stock (within transaction)
        for (const item of itemsToProcess) {
            await Product.updateOne(
                { _id: item.product },
                { $inc: { countInStock: -item.quantity } },
                { session }
            );
        }

        // 5. Clear user's cart (within transaction)
        await Cart.findOneAndDelete({ user: req.user._id }, { session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json(createdOrder);
        
    } catch (error) {
        // 6. Abort transaction on any error
        await session.abortTransaction();
        session.endSession();
        handleExpressError(res, error);
    }
};

// @desc      Get order by ID
// @route     GET /api/orders/:id
// @access    Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            'user', 
            'name email'
        );

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        // Check if order belongs to user or if user is admin
        if (
            order.user._id.toString() !== req.user._id.toString() && 
            req.user.role !== 'admin'
        ) {
            res.status(401);
            throw new Error('Not authorized to view this order');
        }

        // 🟢 FIX 2: Simplified response
        res.status(200).json(order);
    } catch (error) {
        handleExpressError(res, error);
    }
};

// @desc      Update order to paid
// @route     PUT /api/orders/:id/pay
// @access    Private
exports.updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }
        
        // 🟢 FIX 3: Authorization check (only owner can mark as paid via client success)
        if (order.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this order');
        }

        if (order.isPaid) {
            res.status(400);
            throw new Error('Order is already paid');
        }

        // Update order
        order.isPaid = true;
        order.paidAt = Date.now();
        // Assume req.body contains payment details from a service like PayPal/Stripe
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer ? req.body.payer.email_address : 'N/A' // Handle potential nesting
        };

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } catch (error) {
        handleExpressError(res, error);
    }
};

// @desc      Update order to delivered
// @route     PUT /api/orders/:id/deliver
// @access    Private/Admin
exports.updateOrderToDelivered = async (req, res) => {
    try {
        // 🟢 FIX 4: Explicit Admin Check for this route
        if (req.user.role !== 'admin') {
            res.status(403); // Forbidden
            throw new Error('Access denied. Only administrators can mark orders as delivered.');
        }
        
        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        if (order.isDelivered) {
            res.status(400);
            throw new Error('Order is already delivered');
        }
        
        if (!order.isPaid) {
            res.status(400);
            throw new Error('Cannot deliver an unpaid order');
        }

        // Update order
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } catch (error) {
        handleExpressError(res, error);
    }
};

// @desc      Get logged in user orders
// @route     GET /api/orders/myorders
// @access    Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });

        // 🟢 FIX 5: Simplified response
        res.status(200).json(orders);
    } catch (error) {
        handleExpressError(res, error);
    }
};

// @desc      Get all orders
// @route     GET /api/orders
// @access    Private/Admin
exports.getOrders = async (req, res) => {
    try {
        // Assuming a middleware handles the admin check before this controller runs.
        // If not, add an explicit check here similar to updateOrderToDelivered.
        const orders = await Order.find({}).populate('user', 'id name');

        // 🟢 FIX 6: Simplified response
        res.status(200).json(orders);
    } catch (error) {
        handleExpressError(res, error);
    }
};