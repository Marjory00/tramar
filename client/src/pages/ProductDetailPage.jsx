// tramar/client/src/pages/ProductDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';

// 🟢 NEW: Import Material UI components and Icons
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    CircularProgress,
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    List,
    ListItem,
    useTheme
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ListAltIcon from '@mui/icons-material/ListAlt'; // For Category
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices'; // For Compatibility Key
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'; // For Stock Alert

// Assuming StockAlertButton is updated to MUI as well
// Using a new MUI version of the Mock Stock Alert Button
const StockAlertButton = ({ productId, productName }) => {
    return (
        <Button 
            variant="contained" 
            color="warning" 
            fullWidth 
            sx={{ py: 1.5 }}
            startIcon={<NotificationsActiveIcon />}
        >
            Notify me when {productName} is back in stock
        </Button>
    );
};

// NOTE: This mock product data structure is used until we fetch from the API.
const mockProducts = [
    { 
        _id: '1', 
        name: 'Intel Core i7-14700K', 
        price: 399.99, 
        category: 'CPU', 
        countInStock: 15, 
        compatibilityKey: 'LGA 1700', 
        description: 'High-performance unlocked processor for gaming and content creation, featuring 20 cores (8 P-cores + 12 E-cores). Requires Z790 or Z690 motherboard.',
        image: 'https://via.placeholder.com/600x400?text=i7+14700K+CPU' 
    },
    { 
        _id: '2', 
        name: 'NVIDIA RTX 4080 GPU', 
        price: 1199.99, 
        category: 'GPU', 
        countInStock: 0, // Set to 0 to test the Stock Alert Button logic!
        compatibilityKey: 'PCIe 4.0', 
        description: 'Next-generation graphics card offering extreme performance for 4K gaming and demanding creative workloads. Features 16GB of GDDR6X VRAM.',
        image: 'https://via.placeholder.com/600x400?text=RTX+4080+GPU' 
    },
];

const ProductDetailPage = () => {
    const theme = useTheme();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    
    // Simulate fetching product details
    useEffect(() => {
        // In a real app, you'd make an API call: apiService.getProduct(id)
        const foundProduct = mockProducts.find(p => p._id === id);
        setProduct(foundProduct);
        setLoading(false);
    }, [id]);

    const addToCartHandler = () => {
        // Placeholder for adding to cart
        alert(`Added ${qty} x ${product.name} to the cart!`);
    };

    if (loading) {
        return (
            <Box textAlign="center" sx={{ py: 5 }}>
                <CircularProgress color="primary" size={50} />
                <Typography variant="srOnly">Loading Product...</Typography>
            </Box>
        );
    }

    if (!product) {
        return (
            <Container maxWidth="md" sx={{ my: 5 }}>
                <Alert severity="error" variant="filled">
                    Product Not Found. The requested item does not exist.
                </Alert>
                <Button component={RouterLink} to="/" variant="outlined" sx={{ mt: 3 }}>
                    Go Back Home
                </Button>
            </Container>
        );
    }

    // Determine the max quantity for the dropdown (up to 10)
    const maxQty = product.countInStock > 10 ? 10 : product.countInStock;

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Grid container spacing={4}>
                
                {/* Product Image (md=6) */}
                <Grid item xs={12} md={6}>
                    <Box 
                        component="img"
                        src={product.image} 
                        alt={product.name} 
                        sx={{ 
                            width: '100%', 
                            height: 'auto', 
                            borderRadius: theme.shape.borderRadius, 
                            boxShadow: 3 
                        }} 
                    />
                </Grid>

                {/* Product Details (md=6) */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        {product.name}
                    </Typography>
                    
                    <Typography variant="h5" color="primary" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
                        ${product.price.toFixed(2)}
                    </Typography>

                    {/* Description */}
                    <Typography variant="h6" component="h2" sx={{ mb: 1 }}>Description</Typography>
                    <Typography paragraph color="text.secondary">
                        {product.description}
                    </Typography>

                    {/* Key Specs */}
                    <Typography variant="h6" component="h2" sx={{ mt: 3, mb: 1 }}>Key Specs</Typography>
                    <List disablePadding dense>
                        <ListItem disableGutters>
                            <ListAltIcon color="action" sx={{ mr: 1.5 }} /> 
                            <Typography variant="body1">Category: **{product.category}**</Typography>
                        </ListItem>
                        <ListItem disableGutters>
                            <ElectricalServicesIcon color="action" sx={{ mr: 1.5 }} /> 
                            <Typography variant="body1">Compatibility Key: **{product.compatibilityKey}**</Typography>
                        </ListItem>
                    </List>
                    
                    {/* Status and Action Card */}
                    <Card variant="outlined" sx={{ mt: 4, p: 3, bgcolor: 'grey.50' }}>
                        <CardContent sx={{ p: 0 }}>
                            <Typography variant="h6" component="h3" gutterBottom>Status</Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                {product.countInStock > 0 ? (
                                    <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} />
                                ) : (
                                    <CancelOutlinedIcon color="error" sx={{ mr: 1 }} />
                                )}
                                <Typography 
                                    variant="body1" 
                                    color={product.countInStock > 0 ? 'success.main' : 'error.main'}
                                    fontWeight="bold"
                                >
                                    {product.countInStock > 0 
                                        ? `In Stock (${product.countInStock} available)` 
                                        : 'Out of Stock'}
                                </Typography>
                            </Box>

                            {/* Qty Selector and Add to Cart Button */}
                            {product.countInStock > 0 ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
                                    
                                    <FormControl sx={{ minWidth: 120 }}>
                                        <InputLabel id="qty-select-label">Qty</InputLabel>
                                        <Select
                                            labelId="qty-select-label"
                                            id="qty"
                                            value={qty}
                                            label="Qty"
                                            onChange={(e) => setQty(Number(e.target.value))}
                                        >
                                            {[...Array(maxQty).keys()].map(x => (
                                                <MenuItem key={x + 1} value={x + 1}>{x + 1}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Button 
                                        onClick={addToCartHandler} 
                                        variant="contained" 
                                        color="primary" 
                                        size="large"
                                        fullWidth
                                        sx={{ py: 1.5 }}
                                        startIcon={<ShoppingCartIcon />}
                                    >
                                        Add to Cart
                                    </Button>
                                </Box>
                            ) : (
                                // STOCK ALERT BUTTON INTEGRATION POINT
                                <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        This item is currently out of stock. Join the waitlist:
                                    </Typography>
                                    <StockAlertButton 
                                        productId={product._id} 
                                        productName={product.name}
                                    />
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductDetailPage;