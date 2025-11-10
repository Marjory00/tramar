// tramar/client/src/pages/ProductsPage.jsx

import React, { useState, useEffect } from 'react';

// 🟢 Import Material UI components and Icons
import {
    Container,
    Grid,
    Typography,
    Box,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SortIcon from '@mui/icons-material/Sort';

import ProductCard from '../components/product/ProductCard'; 
// import { getProducts } from '../services/apiService';

// --- Mock Data (FIXED: Image file names updated to part11.jpg, part12.jpg, etc.) ---
const allMockProducts = [
    // 🎯 FIX: Updated file names to match the 'partXX.jpg' format in the correct '/products' folder.
    { _id: '1', name: 'Intel Core i7-14700K', price: 399.99, category: 'CPU', countInStock: 15, compatibilityKey: 'LGA 1700', image: './images/products/part11.jpg' },
    { _id: '2', name: 'NVIDIA RTX 4080 GPU', price: 1199.99, category: 'GPU', countInStock: 2, compatibilityKey: 'PCIe 4.0', image: './images/products/part12.jpg' },
    { _id: '3', name: 'Asus ROG Z790-E Motherboard', price: 349.99, category: 'Motherboard', countInStock: 0, compatibilityKey: 'LGA 1700', image: './images/products/part13.jpg' },
    { _id: '4', name: 'Corsair Vengeance 32GB DDR5', price: 109.99, category: 'RAM', countInStock: 30, compatibilityKey: 'DDR5', image: './images/products/part14.jpg' },
    { _id: '5', name: 'Samsung 980 Pro SSD 1TB', price: 79.99, category: 'Storage', countInStock: 20, compatibilityKey: 'NVMe Gen4', image: './images/products/part15.jpg' },
    { _id: '6', name: 'Corsair RM850e PSU', price: 129.99, category: 'PSU', countInStock: 10, compatibilityKey: 'ATX', image: './images/products/part16.jpg' },
    { _id: '7', name: 'AMD Ryzen 7 7800X3D', price: 369.99, category: 'CPU', countInStock: 8, compatibilityKey: 'AM5', image: './images/products/part17.jpg' },
    { _id: '8', name: 'GIGABYTE B650 AORUS', price: 199.99, category: 'Motherboard', countInStock: 12, compatibilityKey: 'AM5', image: './images/products/part18.jpg' },
];

const categories = ['All', 'CPU', 'Motherboard', 'GPU', 'RAM', 'Storage', 'PSU'];

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const [filterCategory, setFilterCategory] = useState('All');
    const [sortBy, setSortBy] = useState('price-desc');

    useEffect(() => {
        const fetchAndFilterProducts = () => {
            setLoading(true);
            setError(null); 
            
            // Simulate network delay for API call
            setTimeout(() => { 
                try {
                    let rawProducts = allMockProducts; 
                    
                    let filtered = rawProducts;
                    
                    // 1. Apply Filtering
                    if (filterCategory !== 'All') {
                        filtered = rawProducts.filter(p => p.category === filterCategory);
                    }

                    // 2. Apply Sorting
                    let sorted = [...filtered].sort((a, b) => {
                        if (sortBy === 'price-asc') return a.price - b.price;
                        if (sortBy === 'price-desc') return b.price - a.price;
                        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
                        return 0;
                    });
                    
                    setProducts(sorted);
                } catch (err) {
                    setError('Failed to load products from the API.'); 
                } finally {
                    setLoading(false);
                }
            }, 500);
        };

        fetchAndFilterProducts();
    }, [filterCategory, sortBy]);

    return (
        <Container maxWidth="xl" sx={{ py: 5 }}>
            {/* Header */}
            <Box textAlign="center" mb={5}>
                <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                    Component Catalog <ListAltIcon fontSize="large" color="primary" sx={{ verticalAlign: 'middle', ml: 1 }} />
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Browse high-quality parts for your custom build.
                </Typography>
            </Box>

            {/* Filter and Sort Controls */}
            <Grid container spacing={3} alignItems="flex-end" sx={{ mb: 4 }}>
                
                {/* Filter Dropdown */}
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel id="category-filter-label">Filter by Category</InputLabel>
                        <Select
                            labelId="category-filter-label"
                            id="categoryFilter"
                            value={filterCategory}
                            label="Filter by Category"
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Sort Dropdown */}
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel id="sort-by-label" sx={{ display: 'flex', alignItems: 'center' }}>
                            <SortIcon sx={{ mr: 1 }} /> Sort By 
                        </InputLabel>
                        <Select
                            labelId="sort-by-label"
                            id="sortBy"
                            value={sortBy}
                            label="Sort By"
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <MenuItem value="price-desc">Price: High to Low</MenuItem>
                            <MenuItem value="price-asc">Price: Low to High</MenuItem>
                            <MenuItem value="name-asc">Name: A-Z</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                
                {/* Results Count */}
                <Grid item xs={12} sm={4}>
                    <Box textAlign={{ xs: 'left', sm: 'right' }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                            {products.length} Products Found
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            {/* Error Message */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Product Grid */}
            {loading ? (
                <Box textAlign="center" sx={{ py: 8 }}>
                    <CircularProgress color="primary" size={60} />
                    <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                        Loading components...
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {products.map(product => (
                        <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                            <ProductCard product={product} /> 
                        </Grid>
                    ))}
                    {products.length === 0 && (
                        <Grid item xs={12} sx={{ py: 5 }}>
                            <Alert severity="warning" variant="filled">
                                No products match the current filter criteria. Try selecting 'All' or another category.
                            </Alert>
                        </Grid>
                    )}
                </Grid>
            )}
        </Container>
    );
};

export default ProductsPage;