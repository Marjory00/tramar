// tramar/client/src/pages/HomePage.jsx

import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Import necessary MUI Icons
import BoltIcon from '@mui/icons-material/Bolt'; // For CTA
import BuildIcon from '@mui/icons-material/Build'; // For Compatibility Feature
import SpeedIcon from '@mui/icons-material/Speed'; // For Performance
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'; // NEW ICON for Community
import CategoryIcon from '@mui/icons-material/Category'; // For Shop by Component
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'; // For New Arrivals
import DiscountIcon from '@mui/icons-material/Discount'; // For Deals
import NewspaperIcon from '@mui/icons-material/Newspaper'; // For News

// Import Material UI components and styling utilities
import { 
    Container, 
    Grid, 
    Card, 
    CardContent, 
    Typography, 
    Button, 
    Box, 
    CircularProgress, 
    useTheme,
    Link 
} from '@mui/material';

import ProductCard from '../components/product/ProductCard';
// import { getProducts } from '../services/apiService'; // Will be used later

// --- Universal Asset Path Prefix ---
const publicPath = process.env.PUBLIC_URL;

// --- Mock Data for Showcase ---
const allMockProducts = [
    { _id: '1', name: 'Intel Core i7-14700K', price: 399.99, category: 'CPU', countInStock: 15, compatibilityKey: 'LGA 1700', image: `${publicPath}/images/products/part1.jpg` },
    { _id: '2', name: 'NVIDIA RTX 4080 GPU', price: 1199.99, category: 'GPU', countInStock: 2, compatibilityKey: 'PCIe 4.0', image: `${publicPath}/images/products/part2.jpg` },
    { _id: '3', name: 'Asus ROG Z790-E Motherboard', price: 349.99, category: 'Motherboard', countInStock: 0, compatibilityKey: 'LGA 1700', image: `${publicPath}/images/products/part3.jpg` },
    { _id: '4', name: 'Corsair Vengeance 32GB DDR5', price: 109.99, category: 'RAM', countInStock: 30, compatibilityKey: 'DDR5', image: `${publicPath}/images/products/part4.jpg` },
];
const newArrivals = [
    { _id: '7', name: 'Radeon RX 7900 XT', price: 899.99, category: 'GPU', countInStock: 12, compatibilityKey: 'PCIe 4.0', image: `${publicPath}/images/products/part7.jpg` },
    { _id: '8', name: 'Lian Li O11 Dynamic EVO', price: 169.99, category: 'Case', countInStock: 25, compatibilityKey: 'Mid Tower', image: `${publicPath}/images/products/part8.jpg` },
    { _id: '9', name: 'Arctic Liquid Freezer III', price: 115.00, category: 'Cooler', countInStock: 50, compatibilityKey: 'LGA 1700', image: `${publicPath}/images/products/part9.jpg` },
];

const HomePage = () => {
    const [products] = useState(allMockProducts.slice(0, 4));
    const [loading] = useState(false);
    const theme = useTheme();

    // System font stack for clean look, if theme doesn't define one
    const systemFontStack = [
        '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'
    ].join(',');
    
    // Ensure we have a dark background color for contrast
    const darkBgColor = theme.palette.custom?.darkBg || theme.palette.grey[900];

    return (
        <Box component="div" className="homepage-content">
            
            {/* 1. Hero Section - Primary Landing CTA (Improved Impact) */}
            <Box
                className="hero-section"
                sx={{
                    background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${publicPath}/images/hero-bg.jpg) center center no-repeat`,
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed', // Added subtle parallax for design flair
                    color: 'white', 
                    textAlign: 'center',
                    minHeight: { xs: 500, md: 650 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 0, // Removed bottom margin, will use padding on next section
                }}
            >
                <Container maxWidth="md" sx={{ py: 8 }}>
                    <Typography 
                        variant="h1" 
                        component="h1" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 900, 
                            fontSize: { xs: '3rem', sm: '4rem', md: '5rem' }, 
                            textShadow: '2px 2px 8px rgba(0, 0, 0, 1)',
                            fontFamily: systemFontStack 
                        }}
                    >
                        Build Smarter. Game Faster.
                    </Typography>
                    <Typography 
                        variant="h5" 
                        paragraph 
                        sx={{ 
                            fontWeight: 400, 
                            fontSize: { xs: '1.2rem', sm: '1.5rem' }, 
                            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
                            fontFamily: systemFontStack 
                        }}
                    >
                        The only platform with automatic Compatibility Checking. Get it right, the first time.
                    </Typography>
                    <Button 
                        component={RouterLink} 
                        to="/builder" 
                        variant="contained" 
                        color="secondary"
                        size="large" 
                        sx={{ 
                            mt: 4, 
                            boxShadow: theme.shadows[15],
                            fontWeight: 700,
                            py: 2,
                            px: 6,
                            borderRadius: 1,
                            fontSize: '1.1rem',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            '&:hover': {
                                backgroundColor: theme.palette.secondary.dark,
                                transform: 'scale(1.05)', // Better hover effect
                                boxShadow: theme.shadows[20],
                            }
                        }}
                        startIcon={<BoltIcon sx={{ fontSize: '1.8rem' }} />}
                    >
                        Launch PC Builder
                    </Button>
                </Container>
            </Box>

            {/* --- Section 2: Core Builder Features (Direct Value Proposition) --- */}
            <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: theme.palette.background.default }}>
                <Container maxWidth="lg">
                    <Typography 
                        variant="h3" 
                        component="h2" 
                        align="center" 
                        gutterBottom 
                        sx={{ mb: 6, fontWeight: 700, color: theme.palette.text.primary, fontFamily: systemFontStack }}
                    >
                        How Tramar Elevates Your Build
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        
                        {/* Feature 1: Compatibility */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card elevation={6} sx={{ height: '100%', p: 3, borderTop: `4px solid ${theme.palette.success.main}` }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <BuildIcon color="success" sx={{ fontSize: 50, mb: 2 }} />
                                    <Typography variant="h6" component="h5" fontWeight="bold" gutterBottom sx={ {fontFamily: systemFontStack} }>
                                        Real-Time Compatibility
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={ {fontFamily: systemFontStack} }>
                                        Our intelligent validator checks component fit, power, and socket type instantly, guaranteeing a functional PC.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        {/* Feature 2: Performance Prediction */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card elevation={6} sx={{ height: '100%', p: 3, borderTop: `4px solid ${theme.palette.info.main}` }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <SpeedIcon color="info" sx={{ fontSize: 50, mb: 2 }} />
                                    <Typography variant="h6" component="h5" fontWeight="bold" gutterBottom sx={ {fontFamily: systemFontStack} }>
                                        Performance Scoring
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={ {fontFamily: systemFontStack} }>
                                        View predicted framerates and benchmarks to optimize your parts list before you purchase.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Feature 3: Community Builds (Icon Replaced) */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card elevation={6} sx={{ height: '100%', p: 3, borderTop: `4px solid ${theme.palette.primary.main}` }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    {/* Replaced FavoriteBorderIcon with PeopleAltIcon */}
                                    <PeopleAltIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                                    <Typography variant="h6" component="h5" fontWeight="bold" gutterBottom sx={ {fontFamily: systemFontStack} }>
                                        Curated Community Plans
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={ {fontFamily: systemFontStack} }>
                                        Access thousands of validated public builds, clone them, or share your own optimal configuration.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* --- Section 3: Shop by Component (Improved Styling) --- */}
            <Box sx={{ py: { xs: 4, md: 8 }, bgcolor: theme.palette.grey[50] }}>
                <Container maxWidth="lg">
                    <Typography 
                        variant="h4" 
                        component="h2" 
                        align="center" 
                        gutterBottom 
                        sx={{ mb: 5, fontWeight: 700, color: theme.palette.text.primary, fontFamily: systemFontStack }}
                    >
                        <CategoryIcon color="primary" sx={{ mr: 1, fontSize: 35 }} /> Shop by Component
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mb: 6 }} justifyContent="center">
                        {['CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'PSU', 'Case', 'Cooler'].map(category => (
                            // Responsive layout: 2 per row on small, 3 on tablet, 4 on desktop
                            <Grid item xs={6} sm={4} md={3} key={category}>
                                <Card 
                                    elevation={0} // Flat look
                                    sx={{ 
                                        p: 2, 
                                        backgroundColor: darkBgColor, 
                                        transition: 'background-color 0.3s, transform 0.2s',
                                        height: '100%',
                                        textAlign: 'center', 
                                        borderRadius: 1, // Subtle rounding
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.main, 
                                            transform: 'scale(1.03)',
                                            boxShadow: theme.shadows[4]
                                        }
                                    }}
                                >
                                    <Link 
                                        component={RouterLink}
                                        to={`/products?category=${category}`} 
                                        style={{ textDecoration: 'none' }} 
                                    >
                                        <Typography 
                                            variant="subtitle1" 
                                            sx={{ color: 'white', fontWeight: 'bold', fontFamily: systemFontStack }}
                                        >
                                            {category}
                                        </Typography>
                                    </Link>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* --- Section 4: Featured Deals (Renamed & Promoted) --- */}
            <Box sx={{ py: { xs: 5, md: 8 } }}>
                <Container maxWidth="lg">
                    <Typography 
                        variant="h4" 
                        component="h2" 
                        gutterBottom 
                        sx={{ mb: 4, fontWeight: 700, color: theme.palette.text.primary, fontFamily: systemFontStack }}
                    >
                        <DiscountIcon color="secondary" sx={{ mr: 1, fontSize: 35 }} /> Limited-Time Featured Deals
                    </Typography>
                    {loading ? (
                        <Box textAlign="center" sx={{ p: 4 }}>
                            <CircularProgress color="primary" />
                            <Typography variant="srOnly">Loading parts...</Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={4}>
                            {/* Layout: 1 per row on mobile, 2 on tablet, 3 on small desktop, 4 on large desktop */}
                            {products.map(product => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                                    {/* Assuming ProductCard is well-styled */}
                                    <ProductCard product={product} /> 
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>

            {/* --- Section 5: New Arrivals Section (Accentuated Background) --- */}
            <Box sx={{ backgroundColor: theme.palette.primary.light + '10', py: { xs: 5, md: 8 } }}>
                <Container maxWidth="lg">
                    <Typography 
                        variant="h4" 
                        component="h2" 
                        gutterBottom 
                        sx={{ mb: 4, fontWeight: 700, color: theme.palette.text.primary, fontFamily: systemFontStack }}
                    >
                        <Inventory2OutlinedIcon color="primary" sx={{ mr: 1, fontSize: 35 }} /> Just Landed: New Arrivals
                    </Typography>
                    <Grid container spacing={4}>
                        {/* Layout: 1 per row on mobile, 2 on tablet, 3 on desktop */}
                        {newArrivals.map(product => (
                            <Grid item xs={12} sm={6} md={4} key={product._id}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>
                    <Box textAlign="center" sx={{ mt: 5 }}>
                        <Button 
                            component={RouterLink} 
                            to="/products?sort=newest" 
                            variant="outlined" 
                            color="primary"
                            startIcon={<Inventory2OutlinedIcon />}
                        >
                            View All New Products
                        </Button>
                    </Box>
                </Container>
            </Box>
            
            {/* --- Section 6: Blog/News Teaser (Clean Layout) --- */}
            <Box sx={{ py: { xs: 5, md: 8 } }}>
                <Container maxWidth="lg">
                    <Typography 
                        variant="h4" 
                        component="h2" 
                        align="center" 
                        gutterBottom 
                        sx={{ mb: 4, fontWeight: 700, color: theme.palette.text.primary, fontFamily: systemFontStack }}
                    >
                        <NewspaperIcon color="primary" sx={{ mr: 1, fontSize: 35 }} /> Latest News & Guides
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {/* Layout: 1 per row on mobile, 2 on tablet, 3 on desktop */}
                        {/* Mock Blog Posts */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ height: '100%', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-4px)' } }}>
                                <CardContent>
                                    <Typography variant="h6" component="h5" fontWeight="bold" sx={{ fontFamily: systemFontStack }}>Q3 GPU Price Trends</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: systemFontStack }}>A deep dive into the current market for high-end graphics cards.</Typography>
                                    <Button component={RouterLink} to="/blog/gpu-trends" size="small" color="primary">Read More</Button>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ height: '100%', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-4px)' } }}>
                                <CardContent>
                                    <Typography variant="h6" component="h5" fontWeight="bold" sx={{ fontFamily: systemFontStack }}>DDR5 vs DDR4: Is it Worth the Upgrade?</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: systemFontStack }}>A guide to help you decide on your next memory platform.</Typography>
                                    <Button component={RouterLink} to="/blog/ddr5-guide" size="small" color="primary">Read More</Button>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ height: '100%', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-4px)' } }}>
                                <CardContent>
                                    <Typography variant="h6" component="h5" fontWeight="bold" sx={{ fontFamily: systemFontStack }}>Lian Li Case Compatibility Review</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: systemFontStack }}>Reviewing case designs for liquid cooling and cable management.</Typography>
                                    <Button component={RouterLink} to="/blog/case-review" size="small" color="primary">Read More</Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Box textAlign="center" sx={{ mt: 5 }}>
                        <Button component={RouterLink} to="/blog" variant="contained" color="secondary">
                            Visit the Blog
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;