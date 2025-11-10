// tramar/client/src/pages/CartPage.jsx

import React, { useState } from 'react';
// 🟢 Import Material UI components
import { 
    Container, 
    Typography, 
    Grid, 
    Box, 
    Divider,
    Button, 
    Card, 
    CardContent,
    useTheme
} from '@mui/material';

// 🟢 Import Material Icons (SettingsIcon is correctly imported)
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete'; 
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsIcon from '@mui/icons-material/Settings';

// --- Mock Data and Functions for Demo ---

// Initial Mock Cart
const initialMockCartItems = [
    { id: 101, name: 'Intel Core i9-14900K CPU', price: 589.99, quantity: 1, image: 'cpu_i9.jpg' },
    { id: 205, name: 'NVIDIA RTX 4080 GPU', price: 1199.99, quantity: 1, image: 'gpu_4080.jpg' },
    { id: 310, name: 'Corsair Vengeance DDR5 64GB', price: 219.99, quantity: 2, image: 'ram_ddr5.jpg' },
];

const calculateSummary = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 1000 ? 0.00 : 25.00; // Free shipping over $1000
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
};

// --- Cart Item Component (Now receives update handlers) ---

const CartItem = ({ item, updateQuantity, removeItem }) => (
    <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="space-between"
        p={2}
        mb={2}
        borderBottom="1px solid"
        borderColor="grey.200"
    >
        {/* Item Info */}
        <Box display="flex" alignItems="center" flexGrow={1}>
            <Box sx={{ width: 60, height: 60, bgcolor: 'grey.100', borderRadius: 1, mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SettingsIcon color="action" />
            </Box>
            <Box>
                <Typography variant="subtitle1" fontWeight="bold">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">${item.price.toFixed(2)} each</Typography>
            </Box>
        </Box>

        {/* Quantity Controls (Now functional) */}
        <Box display="flex" alignItems="center" mx={3}>
            <Button 
                size="small" 
                variant="outlined" 
                sx={{ minWidth: 30, p: 0 }}
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1} // Disable when quantity is 1
            >
                <KeyboardArrowDownIcon />
            </Button>
            <Typography variant="body1" sx={{ px: 2 }}>{item.quantity}</Typography>
            <Button 
                size="small" 
                variant="outlined" 
                sx={{ minWidth: 30, p: 0 }}
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
                <KeyboardArrowUpIcon />
            </Button>
        </Box>

        {/* Total Price and Remove Button (Now functional) */}
        <Box display="flex" alignItems="center">
            <Typography variant="h6" sx={{ minWidth: 100, textAlign: 'right' }}>
                ${(item.price * item.quantity).toFixed(2)}
            </Typography>
            <Button 
                size="small" 
                color="error" 
                sx={{ ml: 2 }}
                onClick={() => removeItem(item.id)} // Functionality added
            >
                <DeleteIcon />
            </Button>
        </Box>
    </Box>
);

// --- Main Cart Page Component ---

const CartPage = () => {
    const theme = useTheme();
    const [cart, setCart] = useState(initialMockCartItems);
    const { subtotal, shipping, total } = calculateSummary(cart);
    
    const isEmpty = cart.length === 0;

    // Handler to change item quantity
    const handleUpdateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return; // Prevent quantity from dropping below 1
        setCart(prevCart => 
            prevCart.map(item => 
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // Handler to remove item
    const handleRemoveItem = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            
            {/* --- Header --- */}
            <Box display="flex" alignItems="center" mb={4}>
                <ShoppingCartIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h3" component="h1" fontWeight="bold">
                    Shopping Cart
                </Typography>
            </Box>
            
            <Divider sx={{ mb: 4 }} />

            <Grid container spacing={4}>
                
                {/* --- Cart Items List Area --- */}
                <Grid item xs={12} md={8}>
                    <Typography variant="h5" gutterBottom>
                        Your Items ({cart.length})
                    </Typography>

                    {isEmpty ? (
                        <Box sx={{ p: 5, border: `2px dashed ${theme.palette.grey[400]}`, borderRadius: 1, minHeight: 300, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Your cart is empty!
                            </Typography>
                            <Typography variant="body1" color="text.hint">
                                Start building your dream PC or browse our components to add items.
                            </Typography>
                            <Button variant="contained" color="primary" sx={{ mt: 3 }}>
                                Start Shopping
                            </Button>
                        </Box>
                    ) : (
                        <Card variant="outlined" sx={{ borderRadius: 1, p: 1 }}>
                            {cart.map(item => (
                                <CartItem 
                                    key={item.id} 
                                    item={item} 
                                    updateQuantity={handleUpdateQuantity} 
                                    removeItem={handleRemoveItem}
                                />
                            ))}
                        </Card>
                    )}
                </Grid>
                
                {/* --- Cart Summary / Checkout Area --- */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h5" gutterBottom>
                        Order Summary
                    </Typography>
                    
                    {/* FIX: Removed theme.spacing(2) from top sticky position to avoid lint warning; theme is available in CartPage scope anyway. */}
                    <Card elevation={5} sx={{ borderRadius: 1, p: 3, position: 'sticky', top: 20 }}>
                        <CardContent sx={{ p: 0 }}>
                            {/* Subtotal */}
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body1" color="text.secondary">Subtotal:</Typography>
                                <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
                            </Box>
                            
                            {/* Shipping */}
                            <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography variant="body1" color="text.secondary">Shipping:</Typography>
                                <Typography variant="body1" color={shipping === 0 ? 'success.main' : 'text.primary'}>
                                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                                </Typography>
                            </Box>
                            
                            <Divider sx={{ mb: 2 }} />

                            {/* Total */}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h5" fontWeight="bold">Total:</Typography>
                                <Typography variant="h4" color="primary" fontWeight="bold">${total.toFixed(2)}</Typography>
                            </Box>

                            {/* Checkout Button */}
                            <Button 
                                variant="contained" 
                                color="secondary" 
                                fullWidth 
                                size="large" 
                                disabled={isEmpty}
                                sx={{ mt: 3, py: 1.5 }}
                            >
                                Proceed to Checkout
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CartPage;