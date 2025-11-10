import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; 
import axios from 'axios';

// 🟢 Material UI Imports
import { 
    Typography, 
    Box, 
    Grid, 
    TextField, 
    Button, 
    CircularProgress, 
    Alert, 
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

// 🟢 Icons
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const AdminProductEditPage = () => {
    const { id: productId } = useParams(); // Get the ID from the URL
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // --- State Management ---
    const [product, setProduct] = useState({
        name: '',
        price: 0,
        image: '',
        category: '',
        description: '',
        countInStock: 0,
    });
    const [loading, setLoading] = useState(false);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [uploadError, setUploadError] = useState(null);

    // Placeholder for categories (Fetch these from API in a real app)
    const categories = ['Electronics', 'Apparel', 'Home Goods', 'Books', 'Other'];

    // --- Authorization Check and Data Fetch ---
    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/'); // Redirect non-admins
            return;
        }

        // Only fetch if editing an existing product (ID is not 'new' or undefined)
        if (productId && productId !== 'new') {
            fetchProductDetails();
        }
        
        // Timeout for clearing messages
        let successTimeout;
        if (successMessage) {
            successTimeout = setTimeout(() => setSuccessMessage(null), 3000);
        }
        
        return () => clearTimeout(successTimeout);

    }, [user, navigate, productId, successMessage]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            
            // This endpoint should be protected and only return one product
            const { data } = await axios.get(`/api/products/${productId}`, config);
            
            setProduct({
                name: data.name || '',
                price: data.price || 0,
                image: data.image || '',
                category: data.category || '',
                description: data.description || '',
                countInStock: data.countInStock || 0,
            });
            setError(null);

        } catch (err) {
            console.error("Fetch product details failed:", err);
            setError(err.response?.data?.message || 'Failed to fetch product details.');
        } finally {
            setLoading(false);
        }
    };
    
    // --- Handlers ---

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        
        try {
            setLoadingUpload(true);
            setUploadError(null);
            
            // 🔥 This is the critical API call to your backend /api/upload route
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);
            
            // The response should contain the public path to the image
            setProduct(prev => ({ ...prev, image: data.path }));
            setSuccessMessage('Image uploaded successfully!');

        } catch (err) {
            console.error("Image upload failed:", err);
            setUploadError('Image upload failed. Check file size/type restrictions.');
        } finally {
            setLoadingUpload(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            setError(null);
            
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            // Determine if we are creating (POST) or updating (PUT)
            if (productId === 'new') {
                // Since the ID is generated on creation, we POST and then redirect
                const { data } = await axios.post('/api/products', product, config);
                setSuccessMessage('Product created successfully!');
                // Redirect to the newly created product's edit page
                setTimeout(() => navigate(`/admin/product/${data._id}/edit`), 1500);
            } else {
                // Update existing product
                await axios.put(`/api/products/${productId}`, product, config);
                setSuccessMessage('Product updated successfully!');
            }

        } catch (err) {
            console.error("Product save failed:", err);
            setError(err.response?.data?.message || 'Failed to save product.');
        } finally {
            setLoading(false);
        }
    };

    // --- Component Render ---
    if (!user || user.role !== 'admin') {
        return null; // The useEffect handles navigation/redirection
    }

    const isCreating = productId === 'new';

    return (
        <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}> 
            
            <Button
                onClick={() => navigate('/admin/products')}
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 3 }}
                variant="outlined"
            >
                Go Back to Products
            </Button>

            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
                {isCreating ? 'Create New Product' : `Edit Product: ${product.name}`}
            </Typography>

            {/* Messages */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Form */}
            {!loading && (
                <Box component={Paper} elevation={3} sx={{ p: 4 }}>
                    <form onSubmit={submitHandler}>
                        <Grid container spacing={3}>
                            
                            {/* Product Name */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={product.name}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            {/* Price and Stock */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Price ($)"
                                    name="price"
                                    type="number"
                                    value={product.price}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    inputProps={{ step: "0.01", min: "0" }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Count In Stock"
                                    name="countInStock"
                                    type="number"
                                    value={product.countInStock}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    inputProps={{ min: "0" }}
                                />
                            </Grid>

                            {/* Category */}
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        name="category"
                                        value={product.category}
                                        label="Category"
                                        onChange={handleInputChange}
                                    >
                                        {categories.map((cat) => (
                                            <MenuItem key={cat} value={cat}>
                                                {cat}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Description */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Description"
                                    name="description"
                                    value={product.description}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={4}
                                    fullWidth
                                />
                            </Grid>

                            {/* Image Field and Upload Button */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>Product Image:</Typography>
                                
                                {product.image && (
                                    <Box sx={{ mb: 2, border: '1px solid #ccc', p: 1, borderRadius: 1, display: 'inline-block' }}>
                                        <img 
                                            src={product.image} 
                                            alt="Product Preview" 
                                            style={{ width: 150, height: 150, objectFit: 'cover', display: 'block' }} 
                                        />
                                        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                            Path: {product.image}
                                        </Typography>
                                    </Box>
                                )}
                                
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <TextField
                                        label="Image Path"
                                        name="image"
                                        value={product.image}
                                        onChange={handleInputChange}
                                        fullWidth
                                        disabled={loadingUpload} // Disable manual edit during upload
                                    />

                                    <Button
                                        variant="contained"
                                        component="label"
                                        startIcon={loadingUpload ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                                        disabled={loadingUpload}
                                        color="secondary"
                                    >
                                        {loadingUpload ? 'Uploading...' : 'Choose File'}
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handleFileUpload}
                                        />
                                    </Button>
                                </Box>
                                {uploadError && <Alert severity="warning" sx={{ mt: 1 }}>{uploadError}</Alert>}
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    startIcon={<SaveIcon />}
                                    disabled={loading || loadingUpload}
                                >
                                    {isCreating ? 'Create Product' : 'Update Product'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            )}
        </Box>
    );
};

export default AdminProductEditPage;