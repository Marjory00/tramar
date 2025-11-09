// tramar/server/controllers/productController.js (Assuming this is the path)

const Product = require('../models/Product');

// Utility function for consistent error responses
const handleExpressError = (res, error) => {
    // Check if a status code was already set (e.g., 400, 404)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
};

// @desc      Get all products with searching, filtering, and pagination
// @route     GET /api/products
// @access    Public
exports.getProducts = async (req, res) => {
    try {
        let query;
        
        // 1. Copy req.query and define fields to exclude for advanced query options
        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
        
        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);
        
        // 2. Advanced Filtering (gt, gte, etc.)
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        
        // Start building the query
        query = Product.find(JSON.parse(queryStr));

        // 3. Search functionality (Applied before selection/sorting)
        if (req.query.search) {
            // 🟢 FIX 1: Use $or for searching across multiple fields (e.g., name and description)
            // Note: If you want to use $text, ensure you have a text index defined on your Product model.
            const searchRegex = new RegExp(req.query.search, 'i'); // Case-insensitive
            query = query.find({
                $or: [
                    { name: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } },
                    // Add other searchable fields like category here if needed
                ]
            });
        }
        
        // 4. Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }
        
        // 5. Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }
        
        // 6. Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        
        // 🟢 FIX 2: Get total count based on *filtered* query, not total documents.
        // Create a count query based on the current filter/search chain (before skip/limit)
        const totalProductsQuery = Product.find(JSON.parse(queryStr));
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            totalProductsQuery.find({
                $or: [{ name: { $regex: searchRegex } }, { description: { $regex: searchRegex } }]
            });
        }
        const total = await totalProductsQuery.countDocuments();
        const endIndex = startIndex + limit; // Calculate endIndex based on skip + limit
        
        query = query.skip(startIndex).limit(limit);
        
        // Executing query
        const products = await query;
        
        // Pagination result
        const pagination = {};
        
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }
        
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }
        
        res.status(200).json({
            count: products.length,
            total, // Added total number of filtered documents
            pagination,
            data: products
        });
    } catch (error) {
        handleExpressError(res, error);
    }
};

// @desc      Get single product
// @route     GET /api/products/:id
// @access    Public
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            res.status(404);
            throw new Error(`Product not found with ID of ${req.params.id}`);
        }
        
        // 🟢 FIX 3: Simplified response
        res.status(200).json(product);
    } catch (error) {
        // Handle Mongoose CastError (e.g., invalid ObjectId)
        if (error.name === 'CastError') {
            res.status(404);
            error.message = `Resource not found with id of ${req.params.id}`;
        }
        handleExpressError(res, error);
    }
};

// @desc      Create new product
// @route     POST /api/products
// @access    Private/Admin
exports.createProduct = async (req, res) => {
    try {
        // Assuming user is set by the protect middleware
        req.body.user = req.user.id;
        
        const product = await Product.create(req.body);
        
        // 🟢 FIX 4: Simplified response
        res.status(201).json(product);
    } catch (error) {
        handleExpressError(res, error);
    }
};

// @desc      Update product
// @route     PUT /api/products/:id
// @access    Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        
        if (!product) {
            res.status(404);
            throw new Error(`Product not found with ID of ${req.params.id}`);
        }
        
        // 🟢 FIX 5: Simplified approach using findByIdAndUpdate
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json(updatedProduct);
    } catch (error) {
        if (error.name === 'CastError') {
            res.status(404);
            error.message = `Resource not found with id of ${req.params.id}`;
        }
        handleExpressError(res, error);
    }
};

// @desc      Delete product
// @route     DELETE /api/products/:id
// @access    Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            res.status(404);
            throw new Error(`Product not found with ID of ${req.params.id}`);
        }
        
        // 🟢 FIX 6: Use Mongoose method on the document for middleware execution
        await product.deleteOne(); 
        
        // 🟢 FIX 7: Standard delete success response
        res.status(200).json({});
    } catch (error) {
        if (error.name === 'CastError') {
            res.status(404);
            error.message = `Resource not found with id of ${req.params.id}`;
        }
        handleExpressError(res, error);
    }
};