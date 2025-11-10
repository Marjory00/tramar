import axios from 'axios';

// Create a base Axios instance
const api = axios.create({
    // baseURL: '/api' ensures requests go to http://localhost:5000/api 
    // (via the proxy setting in client/package.json during development)
    baseURL: '/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- 1. Request Interceptor: Add JWT Token ---
api.interceptors.request.use(config => {
    // Retrieve the token, assuming it's managed via localStorage in the AuthContext logic
    const token = localStorage.getItem('token'); 
    
    // Check if a token exists and add it to the Authorization header
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});


// --- 2. Response Interceptor: Handle Authentication Errors ---
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response ? error.response.status : null;
        
        if (status === 401) {
            console.error('API Error 401: Unauthorized/Token Expired. Logging out...');
            
            // ✅ FIX: Implement automatic token removal and redirect on 401 
            // This is the crucial logout logic needed for a complete authentication flow.
            localStorage.removeItem('token');
            // If you have a user context (AuthContext), you would call a logout function here.
            
            // Redirect the user to the login page (or refresh if using React Router for history push)
            // window.location.href is a simple, effective redirect for this interceptor.
            window.location.href = '/login'; 
        }
        
        // Pass the error back to the caller
        return Promise.reject(error);
    }
);

// ------------------------------------
// --- ⚙️ Export Base API for Flexibility (e.g., file uploads) ---
// ------------------------------------
export { api };

// ------------------------------------
// --- 👤 User/Auth Service ---
// ------------------------------------
export const register = (userData) => api.post('/users/register', userData);
export const login = (credentials) => api.post('/users/login', credentials);

// getProfile uses the interceptor, so no need to pass the token manually here
export const getProfile = () => api.get('/users/profile');

// ------------------------------------
// --- 🚨 Stock Alert Service (NEW) ---
// ------------------------------------
/**
 * Subscribes the currently logged-in user to a stock alert for a product.
 * @param {string} productId - The ID of the product to subscribe to.
 */
export const subscribeToStockAlert = (productId) => api.post(`/users/alerts/${productId}`);

/**
 * Unsubscribes the currently logged-in user from a stock alert for a product.
 * @param {string} productId - The ID of the product to unsubscribe from.
 */
export const unsubscribeFromStockAlert = (productId) => api.delete(`/users/alerts/${productId}`);


// ------------------------------------
// --- 📦 Product Service (Admin & Public) ---
// ------------------------------------
// Public: Get all products
export const getProducts = () => api.get('/products'); 
// Public: Get a single product
export const getProductById = (id) => api.get(`/products/${id}`);

// Admin: Create a new product (Requires 'admin' role via interceptor)
export const createProduct = (productData) => api.post('/products', productData); 

// Admin: Update an existing product (CRU**D**)
export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData); 

// Admin: Delete a product
export const deleteProduct = (id) => api.delete(`/products/${id}`); 


// --- Specialized PC Builder Service ---
/**
 * Checks compatibility between two PC components.
 * @param {string} part1Id 
 * @param {string} part2Id 
 */
export const checkPartCompatibility = (part1Id, part2Id) => 
    api.get(`/products/compatibility?part1Id=${part1Id}&part2Id=${part2Id}`);


// ------------------------------------
// --- 🛒 Cart Service (Shopping Cart Feature) ---
// ------------------------------------
// Get the user's cart
export const getCart = () => api.get('/cart');
// Add item to cart (Note: Backend handles logic if product already exists)
export const addToCart = (productId, quantity) => api.post('/cart', { productId, quantity });
// Remove a specific item from the cart
export const removeFromCart = (itemId) => api.delete(`/cart/${itemId}`); 


// ------------------------------------
// --- 💳 Payment Service (Stripe Integration) ---
// ------------------------------------
// Endpoint to create a Stripe Payment Intent client secret
export const createPaymentIntent = (orderId) => api.post('/payment/create-payment-intent', { orderId });