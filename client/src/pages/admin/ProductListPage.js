// tramar/client/src/pages/admin/ProductListPage.jsx

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext'; 
import axios from 'axios';

// Import Material UI components
import { 
    Grid, 
    Typography, 
    Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    CircularProgress,
    Alert,
    IconButton,
    Box,
} from '@mui/material';

// Import Material Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

// Component Name: AdminProductListPage
const AdminProductListPage = () => {
    const navigate = useNavigate(); 
    const { user } = useContext(AuthContext);
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Helper function to clear messages
    const clearMessages = () => {
        setError(null);
        setSuccessMessage(null);
    };

    // --- Data Fetching Logic (Memoized) ---
    const fetchProducts = useCallback(async () => {
        // Stop loading if unauthorized before fetch attempt
        if (!user || user.role !== 'admin') {
            setLoading(false);
            return;
        }

        clearMessages();
        
        try {
            setLoading(true);
            
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.get('/api/products', config); 
            setProducts(data); 
            
        } catch (err) {
            console.error("Fetch products failed:", err);
            // Access nested error message safely
            setError(err.response?.data?.message || 'Failed to fetch products. Access denied or API error.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    // --- Authorization and Initial Fetch Effect ---
    useEffect(() => {
        if (!user) {
            // Redirect non-logged-in users
            navigate('/login');
        } else if (user.role !== 'admin') {
            // Redirect non-admin users
            navigate('/');
        } else {
            // Authorized, fetch data
            fetchProducts();
        }
    }, [user, navigate, fetchProducts]); 

    // --- Handler Functions ---
    
    const deleteHandler = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }
        
        clearMessages();
        
        // Optimistic UI Update: Remove the product from the local list immediately
        const originalProducts = products;
        setProducts(products.filter(product => product._id !== id));
        
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.delete(`/api/products/${id}`, config);
            
            setSuccessMessage(`Product (ID: ${id.substring(0, 5)}...) deleted successfully.`);
            
            // Re-fetch the product list to confirm server state
            fetchProducts(); 
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000); 
            
        } catch (err) {
            console.error("Delete failed:", err);
            // Rollback optimistic update
            setProducts(originalProducts); 
            setError(err.response?.data?.message || 'Failed to delete product.');
            
            // Clear error message after 5 seconds
            setTimeout(() => setError(null), 5000); 
        }
    };

    const createProductHandler = async () => {
        clearMessages();
        setLoading(true); 
        
        try {
            setSuccessMessage('Creating new product...');
            
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            };
            
            // POST request to create a default product
            const { data: newProduct } = await axios.post('/api/products', {}, config);
            
            setSuccessMessage('New product created! Redirecting to edit screen...');
            
            // Redirect to the edit page for the new product
            setTimeout(() => {
                navigate(`/admin/product/${newProduct._id}/edit`);
            }, 1000); 

        } catch (err) {
            console.error("Create failed:", err);
            setError(err.response?.data?.message || 'Failed to create product.');
            setSuccessMessage(null);
            setLoading(false); // Stop loading if redirect fails
        }
    };

    // --- Component Render ---
    return (
        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}> 
            <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Grid item>
                    <Typography variant="h4" component="h1">
                        Product Catalog Management
                    </Typography>
                </Grid>
                <Grid item>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={createProductHandler}
                        startIcon={<AddIcon />}
                        // Disable if loading or unauthorized
                        disabled={loading || !user || user.role !== 'admin'} 
                        sx={{ my: 2 }}
                    >
                        Create Product
                    </Button>
                </Grid>
            </Grid>

            {/* Displaying Messages/Loader */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                    <CircularProgress />
                </Box>
            )}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

            {/* Product Table */}
            {!loading && !error && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 800 }} size="medium">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>NAME</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>PRICE</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>CATEGORY</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>STOCK</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}></TableCell> 
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="subtitle1" color="text.secondary" sx={{ py: 2 }}>
                                            No products found. Click "Create Product" to add one.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product._id} hover>
                                        {/* Truncated ID */}
                                        <TableCell sx={{ fontSize: '0.8rem', opacity: 0.7 }}>{product._id.substring(0, 10)}...</TableCell>
                                        
                                        {/* 🔥 FIX: Added image thumbnail display */}
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                {product.image && (
                                                    <img 
                                                        src={product.image} 
                                                        alt={product.name} 
                                                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }} 
                                                    />
                                                )}
                                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                    {product.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        
                                        <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                {/* Stock Status Indicator */}
                                                {product.countInStock > 0 ? (
                                                    <CheckIcon color="success" sx={{ fontSize: 18 }} />
                                                ) : (
                                                    <CloseIcon color="error" sx={{ fontSize: 18 }} />
                                                )}
                                                <Box component="span" sx={{ ml: 1 }}>{product.countInStock}</Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ width: '1%' }} align="right">
                                            {/* Edit Button (Links to edit page) */}
                                            <IconButton
                                                component={RouterLink}
                                                to={`/admin/product/${product._id}/edit`}
                                                color="primary"
                                                size="small"
                                                sx={{ mr: 1 }}
                                                aria-label={`Edit ${product.name}`}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            
                                            {/* Delete Button (Triggers delete handler) */}
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => deleteHandler(product._id)}
                                                aria-label={`Delete ${product.name}`}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default AdminProductListPage;