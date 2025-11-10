// tramar/client/src/components/product/ProductCard.jsx (Example)

import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ProductCard = ({ product }) => {
    const inStock = product.countInStock > 0;
    
    // 🎯 FIX 1: Ensure the path handles the public URL structure correctly.
    // The path from the data: './images/products/part11.jpg'
    // The root path for the public folder is just '/'
    // We should strip the leading '.' if present, or just use the whole string.
    
    // For simplicity with CRA/Vite, using the full path as provided by mock data is safest:
    const imagePath = product.image; 

    return (
        <Card 
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                transition: '0.3s',
                '&:hover': { boxShadow: 6 },
            }}
        >
            {/* 🖼️ FIX 2: Check the CardMedia component */}
            <CardMedia
                component="img"
                // The 'src' attribute receives the corrected path, e.g., './images/products/part11.jpg'
                // This path is relative to the base URL (which points to the 'public' folder).
                image={imagePath} 
                alt={product.name}
                sx={{ 
                    // Set a consistent height for all images
                    pt: 2,
                    height: 200, 
                    objectFit: 'contain', // Prevents distortion while fitting
                }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                {/* Product Name (Link to Detail Page) */}
                <Typography 
                    gutterBottom 
                    variant="h6" 
                    component={RouterLink} 
                    to={`/product/${product._id}`}
                    sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 'bold' }}
                >
                    {product.name}
                </Typography>
                
                {/* Price */}
                <Typography variant="h5" color="primary.dark" sx={{ mt: 1, fontWeight: 'medium' }}>
                    ${product.price.toFixed(2)}
                </Typography>

                {/* Stock Status */}
                <Typography variant="caption" color={inStock ? 'success.main' : 'error.main'} sx={{ fontWeight: 'bold', display: 'block' }}>
                    {inStock ? 'In Stock' : 'Out of Stock'}
                </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Button 
                    size="small" 
                    color="primary" 
                    startIcon={<VisibilityIcon />} 
                    component={RouterLink}
                    to={`/product/${product._id}`}
                >
                    Details
                </Button>
                <Button 
                    size="small" 
                    color="secondary" 
                    variant="contained"
                    disabled={!inStock}
                    startIcon={<AddShoppingCartIcon />}
                    // onClick={() => handleAddToCart(product._id)} // Future feature
                >
                    Add
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;