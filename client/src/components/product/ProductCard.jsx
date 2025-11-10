import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Import necessary MUI Icons
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Import Material UI components and styling utilities
import { 
    Card, 
    CardMedia, 
    CardContent, 
    CardActions, 
    Typography, 
    Button, 
    Box, 
    useTheme // Keeping useTheme for full access to palette and shadows
} from '@mui/material';

// 🔴 CONSTANT: Custom color for the Add Button (from previous request)
const ADD_BUTTON_COLOR = '#c24d2c';

const ProductCard = ({ product }) => {
    const theme = useTheme();
    const inStock = product.countInStock > 0;
    
    // System font stack for consistent typography (from previous version)
    const systemFontStack = [
        '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'
    ].join(',');

    // Mock function to simulate adding a product to the cart (from previous version)
    const handleAddToCart = () => {
        console.log(`Product ${product.name} (ID: ${product._id}) added to cart!`);
    };
    
    // The path from the mock data already includes the public path prefix
    const imagePath = product.image; 

    return (
        <Card 
            elevation={4} // Consistent elevation
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { 
                    boxShadow: theme.shadows[10], // Increased shadow on hover
                    transform: 'translateY(-5px)', // Subtle lift effect
                },
            }}
        >
            {/* 🖼️ Product Image Area - Implemented new styling for consistent look */}
            <CardMedia
                component="img"
                image={imagePath} 
                alt={product.name}
                sx={{ 
                    pt: 2, // Padding at the top for spacing
                    height: 200, 
                    objectFit: 'contain', // Prevents distortion while fitting
                }}
            />
            
            <CardContent sx={{ flexGrow: 1 }}>
                {/* Product Name (Link to Detail Page) */}
                <Typography 
                    gutterBottom 
                    variant="subtitle1" // Slightly smaller than h6 to fit better
                    component={RouterLink} 
                    to={`/product/${product._id}`}
                    noWrap // Prevents long names from disrupting layout
                    title={product.name}
                    sx={{ 
                        textDecoration: 'none', 
                        color: theme.palette.text.primary, // Using primary text color
                        fontWeight: 'bold',
                        display: 'block', // Ensures link takes up full width
                        fontFamily: systemFontStack
                    }}
                >
                    {product.name}
                </Typography>
                
                {/* Category/Compatibility (Added back for context) */}
                {product.category && (
                    <Typography variant="caption" color="text.secondary" display="block">
                        {product.category}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 0.5 }}>
                    {/* Price */}
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                        ${product.price.toFixed(2)}
                    </Typography>

                    {/* Stock Status */}
                    <Typography variant="body2" color={inStock ? 'success.main' : 'error.main'} sx={{ fontWeight: 'bold' }}>
                        {inStock ? `${product.countInStock} In Stock` : 'Out of Stock'}
                    </Typography>
                </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                {/* View Details Button */}
                <Button 
                    size="small" 
                    variant="outlined"
                    color="primary" 
                    startIcon={<VisibilityIcon />} 
                    component={RouterLink}
                    to={`/product/${product._id}`}
                >
                    Details
                </Button>
                
                {/* Add to Cart Button - Applied custom color from previous request */}
                <Button 
                    size="small" 
                    variant="contained"
                    disabled={!inStock}
                    onClick={handleAddToCart}
                    startIcon={<AddShoppingCartIcon />}
                    sx={{
                        backgroundColor: ADD_BUTTON_COLOR,
                        '&:hover': {
                            backgroundColor: '#a64228', // Darkened version of #c24d2c
                        },
                        '&:disabled': {
                            backgroundColor: theme.palette.action.disabledBackground,
                            color: theme.palette.action.disabled
                        }
                    }}
                >
                    {inStock ? 'Add' : 'Sold Out'}
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;