// Cart context for shopping cart management
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

// Define the name for the local storage cart key (for unauthenticated users)
const LOCAL_CART_KEY = 'localCart'; 

// Create context
export const CartContext = createContext();

// Utility to calculate total amount from items
const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

export const CartProvider = ({ children }) => {
    // cart now defaults to loading from local storage
    const [cart, setCart] = useState(() => {
        const localData = localStorage.getItem(LOCAL_CART_KEY);
        try {
            const savedCart = localData ? JSON.parse(localData) : { items: [], totalAmount: 0 };
            // Ensure the total is recalculated in case of local storage corruption
            return {
                ...savedCart,
                totalAmount: calculateTotal(savedCart.items)
            };
        } catch (e) {
            console.error("Failed to parse local cart:", e);
            return { items: [], totalAmount: 0 };
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Destructure `isAuthenticated` from AuthContext for cleaner logic
    const { user, isAuthenticated } = useContext(AuthContext); 
    const isClient = typeof window !== 'undefined';

    // --- Core Fix: Memoize fetchCart to prevent useEffect loop ---
    // Since fetchCart is used in useEffect, it must be memoized using useCallback
    const fetchCart = useCallback(async () => {
        if (!user || !user.token) return;

        try {
            setLoading(true);
            setError(null);
            
            // 🟢 Pass the token directly in the function for cleaner execution
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.get('/api/cart', config);
            
            // 🟢 The response structure might be different, assume it returns the full cart data
            const serverCart = data.data || { items: [], totalAmount: 0 }; 
            
            setCart({
                items: serverCart.items || [],
                totalAmount: calculateTotal(serverCart.items || []) // Recalculate total on client side
            });
            
            setLoading(false);
            
            // 🟢 Cleanup local storage after successfully loading the server cart
            if (isClient) {
                localStorage.removeItem(LOCAL_CART_KEY);
            }
            
        } catch (err) {
            setLoading(false);
            console.error("Error fetching cart:", err);
            // 🟢 Improved error handling message
            setError(
                err.response?.data?.error || 
                'Failed to load cart from server. Please try again.'
            );
        }
    }, [user, isClient]); // Only depends on user and client check

    // 1. Initial Load & User Change Effect
    useEffect(() => {
        if (isAuthenticated && user) {
            // 🟢 When logged in, load cart from API
            fetchCart();
        } else {
            // 🟢 When logged out, ensure state reflects local storage
            const localData = localStorage.getItem(LOCAL_CART_KEY);
            const savedCart = localData ? JSON.parse(localData) : { items: [], totalAmount: 0 };
            setCart({
                ...savedCart,
                totalAmount: calculateTotal(savedCart.items)
            });
        }
    }, [isAuthenticated, user, fetchCart]);

    // 2. Local Storage Persistence Effect (for unauthenticated users)
    useEffect(() => {
        // Only persist if not authenticated to prevent overwriting the server cart
        if (!isAuthenticated && isClient) {
            localStorage.setItem(LOCAL_CART_KEY, JSON.stringify({ items: cart.items, totalAmount: cart.totalAmount }));
        }
        // This effect should ideally only track cart.items changes
    }, [cart.items, isAuthenticated, isClient]);


    // --- CRUD Operations ---

    // 🟢 Utility to handle server updates and automatically re-fetch
    const handleServerUpdate = async (apiCall) => {
        if (!user || !user.token) {
            setError('Please log in to manage your cart.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            };
            
            // Execute the provided API call
            const { data } = await apiCall(config);

            // Assuming the API returns the updated cart structure
            const newItems = data.data?.items || [];
            
            setCart({
                items: newItems,
                totalAmount: calculateTotal(newItems)
            });
            
        } catch (err) {
            console.error("Cart update failed:", err);
            setError(err.response?.data?.error || 'Cart operation failed.');
        } finally {
            setLoading(false);
        }
    };
    
    // 🟢 Utility to handle local updates (for unauthenticated users)
    const handleLocalUpdate = (updateFn) => {
        const newItems = updateFn(cart.items);
        setCart({
            items: newItems,
            totalAmount: calculateTotal(newItems)
        });
        setError(null); // Clear errors on local update attempt
    };
    
    // Add item to cart
    const addToCart = async (product) => {
        if (isAuthenticated) {
            await handleServerUpdate((config) => 
                axios.post('/api/cart', { productId: product._id, quantity: 1 }, config)
            );
        } else {
            handleLocalUpdate(items => {
                const existingItem = items.find(item => item._id === product._id);
                if (existingItem) {
                    return items.map(item =>
                        item._id === product._id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    // 🟢 Important: Local cart items should mimic the structure needed for the server
                    return [...items, { 
                        ...product, 
                        _id: product._id, 
                        quantity: 1 
                    }];
                }
            });
        }
    };

    // Update cart item quantity
    const updateCartItemQuantity = async (itemId, quantity) => {
        if (quantity <= 0) {
            return removeFromCart(itemId);
        }

        if (isAuthenticated) {
            await handleServerUpdate((config) => 
                axios.put(`/api/cart/${itemId}`, { quantity }, config)
            );
        } else {
            handleLocalUpdate(items => 
                items.map(item =>
                    item._id === itemId ? { ...item, quantity } : item
                )
            );
        }
    };

    // Remove item from cart
    const removeFromCart = async (itemId) => {
        if (isAuthenticated) {
            await handleServerUpdate((config) => 
                axios.delete(`/api/cart/${itemId}`, config)
            );
        } else {
            handleLocalUpdate(items => 
                items.filter(item => item._id !== itemId)
            );
        }
    };

    // Clear cart
    const clearCart = async () => {
        if (isAuthenticated) {
            await handleServerUpdate((config) => 
                axios.delete('/api/cart', config)
            );
        } else {
            setCart({ items: [], totalAmount: 0 });
            if (isClient) {
                localStorage.removeItem(LOCAL_CART_KEY);
            }
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                error,
                addToCart,
                updateCartItemQuantity,
                removeFromCart,
                clearCart,
                fetchCart // Kept for manual refresh if needed
            }}
        >
            {children}
        </CartContext.Provider>
    );
};