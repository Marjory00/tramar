// Checkout form component for Stripe payment
import React, { useState, useEffect } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
// 🟢 Import Material UI components
import { 
    Button, 
    Alert, // MUI Alert component replaces React-Bootstrap Alert
    Box, // For spacing/layout, replaces Bootstrap classes
    CircularProgress, // For loading state
} from '@mui/material';

const CheckoutForm = ({ orderId, onSuccess, customerEmail }) => { // 🟢 Added customerEmail prop
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        // Get the client secret from the URL query params
        const clientSecret = new URLSearchParams(window.location.search).get(
            'payment_intent_client_secret'
        );

        if (!clientSecret) {
            return;
        }

        // Check the status of the payment intent
        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            let alertSeverity = 'info'; // Default severity
            let alertMessage = 'Something went wrong.';

            switch (paymentIntent.status) {
                case 'succeeded':
                    alertMessage = 'Payment succeeded!';
                    alertSeverity = 'success';
                    onSuccess && onSuccess();
                    break;
                case 'processing':
                    alertMessage = 'Your payment is processing.';
                    alertSeverity = 'info';
                    break;
                case 'requires_payment_method':
                    alertMessage = 'Your payment was not successful, please try again.';
                    alertSeverity = 'error';
                    break;
                default:
                    // Default message is set above
                    alertSeverity = 'error';
                    break;
            }
            setMessage({ text: alertMessage, severity: alertSeverity });
        });
    }, [stripe, onSuccess]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null); // Clear previous messages

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/order/${orderId}`,
                // 🟢 Use customerEmail prop, or fallback/placeholder
                receipt_email: customerEmail || 'placeholder@example.com', 
            },
        });

        if (error) {
            let alertSeverity = 'error';
            let alertMessage = 'An unexpected error occurred.';

            if (error.type === 'card_error' || error.type === 'validation_error') {
                alertMessage = error.message;
            } 
            
            // 🟢 Set the error message in state
            setMessage({ text: alertMessage, severity: alertSeverity });
        }

        setIsLoading(false);
    };

    return (
        // 🟢 Use Box component to replace the form container and handle spacing
        <Box 
            component="form"
            id="payment-form" 
            onSubmit={handleSubmit}
            sx={{ width: '100%' }}
        >
            <PaymentElement id="payment-element" />
            
            <Button
                // 🟢 MUI Button replaces React-Bootstrap Button
                variant="contained" 
                color="primary"
                fullWidth // Replaces w-100
                sx={{ mt: 3, py: 1.5 }} // Spacing replaces mt-4
                disabled={isLoading || !stripe || !elements}
                type="submit"
                size="large"
            >
                {isLoading ? (
                    // 🟢 Use CircularProgress for processing state
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    'Pay Now'
                )}
            </Button>
            
            {/* 🟢 MUI Alert replaces React-Bootstrap Alert */}
            {message && (
                <Alert 
                    // Use message.severity for MUI Alert variant (success, error, info, warning)
                    severity={message.severity} 
                    sx={{ mt: 3 }}
                >
                    {message.text}
                </Alert>
            )}
        </Box>
    );
};

export default CheckoutForm;