// Order page component for order details
import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

// 🟢 NEW: Import Material UI components and Icons
import { 
    Container, 
    Grid, 
    Card, 
    CardContent, 
    Typography, 
    List, 
    ListItem, 
    Divider,
    Box,
    Alert, // Replaces Message component (Bootstrap Alert)
    useTheme
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

// 🔴 REMOVED: React-Bootstrap imports
// import { Row, Col, ListGroup, Card, Button } from 'react-bootstrap'; 

// Keep Stripe dependencies (Elements wrapper is often external)
import { useStripe, useElements, Elements, PaymentElement } from '@stripe/react-stripe-js';

import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
// import Message from '../components/Message'; // Assuming this is replaced by MUI Alert/custom MUI component
import CheckoutForm from '../components/CheckoutForm';

const OrderPage = () => {
    const theme = useTheme();
    const { id: orderId } = useParams();
    const { user } = useContext(AuthContext);

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingPay, setLoadingPay] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    // --- 1. Fetch order details ---
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };

                const { data } = await axios.get(`/api/orders/${orderId}`, config);
                setOrder(data.data);
                setLoading(false);
            } catch (err) {
                setError(
                    err.response && err.response.data.error
                        ? err.response.data.error
                        : 'Something went wrong'
                );
                setLoading(false);
            }
        };

        if (user && orderId) {
            // Only fetch if order is null (first load) or hasn't been paid if we need to re-fetch
            if (!order || order._id !== orderId || (order._id === orderId && !order.isPaid)) {
                 fetchOrder();
            }
        }
    }, [user, orderId, order]); // Added 'order' to dependency array for a clean re-fetch after payment

    // --- 2. Create payment intent when order is loaded and unpaid ---
    useEffect(() => {
        const createPaymentIntent = async () => {
            // Check if order exists, is unpaid, and clientSecret hasn't been set yet
            if (order && !order.isPaid && !clientSecret) {
                try {
                    setLoadingPay(true);
                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${user.token}`
                        }
                    };

                    const { data } = await axios.post(
                        '/api/payment/create-payment-intent',
                        { orderId },
                        config
                    );

                    setClientSecret(data.clientSecret);
                    setLoadingPay(false);
                } catch (err) {
                    setError(
                        err.response && err.response.data.error
                            ? err.response.data.error
                            : 'Failed to initiate payment'
                    );
                    setLoadingPay(false);
                }
            }
        };

        createPaymentIntent();
    }, [order, user, orderId, clientSecret]);

    // --- 3. Handle successful payment ---
    // This function will be passed down to CheckoutForm
    const handlePaymentSuccess = () => {
        // Re-run the fetchOrder logic to get the updated, paid status from the server
        if (orderId && user) {
            // By resetting clientSecret, the dependency array in the second useEffect prevents unnecessary re-creation of intent
            setClientSecret(''); 
            
            // Set loading and null out order to force re-fetch in first useEffect
            setLoading(true); 
            setOrder(null); 
            
            // The useEffect with [user, orderId, order] dependency handles the actual data refresh.
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        // Assuming Message is now a simple MUI Alert or replaced with one
        return <Container maxWidth="md" sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
                Order Summary: <span style={{ color: theme.palette.primary.main }}>{order._id}</span>
            </Typography>
            <Grid container spacing={4}>
                
                {/* Column 1: Order Details (md=8) */}
                <Grid item xs={12} md={8}>
                    {/* 1. Shipping Address */}
                    <Box mb={4}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            <LocalShippingIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} /> Shipping
                        </Typography>
                        <Typography>
                            <strong>Name:</strong> {order.user.name}
                        </Typography>
                        <Typography>
                            <strong>Email:</strong> {order.user.email}
                        </Typography>
                        <Typography>
                            <strong>Address:</strong> 
                            {order.shippingAddress.address}, {order.shippingAddress.city}, 
                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </Typography>

                        <Alert 
                            severity={order.isDelivered ? "success" : "info"} 
                            sx={{ mt: 2 }}
                            icon={order.isDelivered ? <CheckCircleOutlineIcon fontSize="inherit" /> : null}
                        >
                            {order.isDelivered 
                                ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` 
                                : 'Not yet delivered'}
                        </Alert>
                        <Divider sx={{ my: 3 }} />
                    </Box>
                    
                    {/* 2. Payment Status */}
                    <Box mb={4}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Payment Method
                        </Typography>
                        <Typography>
                            <strong>Method:</strong> {order.paymentMethod}
                        </Typography>
                        <Alert 
                            severity={order.isPaid ? "success" : "warning"} 
                            sx={{ mt: 2 }}
                            icon={order.isPaid ? <CheckCircleOutlineIcon fontSize="inherit" /> : null}
                        >
                            {order.isPaid 
                                ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` 
                                : 'Not yet paid'}
                        </Alert>
                        <Divider sx={{ my: 3 }} />
                    </Box>

                    {/* 3. Order Items */}
                    <Box>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Order Items
                        </Typography>
                        <List disablePadding>
                            {order.orderItems.length === 0 ? (
                                <Alert severity="info">Order is empty</Alert>
                            ) : (
                                order.orderItems.map((item) => (
                                    <ListItem key={item.product} divider>
                                        <Grid container alignItems="center">
                                            <Grid item xs={2}>
                                                <img src={item.image} alt={item.name} style={{ width: '100%', maxWidth: '60px' }} />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Link to={`/product/${item.product}`} style={{ textDecoration: 'none' }}>
                                                    <Typography color="primary">{item.name}</Typography>
                                                </Link>
                                            </Grid>
                                            <Grid item xs={4} textAlign="right">
                                                <Typography>
                                                    {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </Box>
                </Grid>
                
                {/* Column 2: Order Summary & Payment (md=4) */}
                <Grid item xs={12} md={4}>
                    <Card variant="outlined" elevation={3}>
                        <CardContent>
                            <Typography variant="h5" component="h2" sx={{ mb: 2, borderBottom: `2px solid ${theme.palette.divider}`, pb: 1 }}>
                                Order Summary
                            </Typography>
                            <List dense disablePadding>
                                {/* Items */}
                                <ListItem sx={{ px: 0, justifyContent: 'space-between' }}>
                                    <Typography>Items</Typography>
                                    <Typography fontWeight="bold">${(order.totalPrice - order.taxPrice - order.shippingPrice).toFixed(2)}</Typography>
                                </ListItem>
                                {/* Shipping */}
                                <ListItem sx={{ px: 0, justifyContent: 'space-between' }}>
                                    <Typography>Shipping</Typography>
                                    <Typography fontWeight="bold">${order.shippingPrice.toFixed(2)}</Typography>
                                </ListItem>
                                {/* Tax */}
                                <ListItem sx={{ px: 0, justifyContent: 'space-between' }}>
                                    <Typography>Tax</Typography>
                                    <Typography fontWeight="bold">${order.taxPrice.toFixed(2)}</Typography>
                                </ListItem>
                                <Divider sx={{ my: 1 }} />
                                {/* Total */}
                                <ListItem sx={{ px: 0, justifyContent: 'space-between' }}>
                                    <Typography variant="h6">Total</Typography>
                                    <Typography variant="h6" color="primary">${order.totalPrice.toFixed(2)}</Typography>
                                </ListItem>
                            </List>

                            {/* Payment Section */}
                            {!order.isPaid && (
                                <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                                    <Typography variant="h6" component="h4" sx={{ mb: 2 }}>
                                        Complete Payment
                                    </Typography>
                                    {loadingPay ? (
                                        <Loader />
                                    ) : clientSecret ? (
                                        <CheckoutForm 
                                            orderId={orderId} 
                                            onSuccess={handlePaymentSuccess} 
                                            clientSecret={clientSecret} // Pass clientSecret for Stripe
                                        />
                                    ) : (
                                        <Alert severity="info">Preparing payment form...</Alert>
                                    )}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default OrderPage;