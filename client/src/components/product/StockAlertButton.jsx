// tramar/client/src/components/product/StockAlertButton.jsx

import React, { useState, useEffect } from 'react';
// 🟢 Import Material UI components and Icons
import { Button, CircularProgress, Box } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import LoginIcon from '@mui/icons-material/Login';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// --- Mock Context Placeholders for MUI Fix ---
// Replace these mocks with your actual AuthContext and SnackBar/Alert context (e.g., useAlert or useSnackBar)
const useAuthMock = () => ({
    isAuthenticated: true, // Mock: Assume user is logged in
    // In a real app, you might also return a redirect function for use when not authenticated
});

const useAlertMock = () => ({
    showAlert: (message, severity) => console.log(`[MUI Alert - ${severity}]: ${message}`),
});
// ---------------------------------------------

const StockAlertButton = ({ productId, productName }) => {
    // 🟢 Use Mock Hooks (Replace with actual hooks)
    const { isAuthenticated } = useAuthMock(); 
    const { showAlert } = useAlertMock();
    
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Simulate checking subscription status on load
    useEffect(() => {
        if (isAuthenticated) {
            // Mock: Let's mock the product with ID '2' as subscribed
            setIsSubscribed(productId === '2');
        } else {
             setIsSubscribed(false);
        }
    }, [productId, isAuthenticated]);

    const handleAlertToggle = async () => {
        if (!isAuthenticated) {
            showAlert('Please log in to set a stock alert.', 'info');
            return;
        }

        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800)); 

        try {
            if (isSubscribed) {
                // In a real app: const res = await apiService.unsubscribeAlert(productId);
                setIsSubscribed(false);
                showAlert(`Unsubscribed from alerts for ${productName}.`, 'success'); // 🟢 Using MUI Alert
            } else {
                // In a real app: const res = await apiService.subscribeAlert(productId);
                setIsSubscribed(true);
                showAlert(`Subscribed to alerts for ${productName}! We'll notify you when it's back.`, 'success'); // 🟢 Using MUI Alert
            }
        } catch (error) {
            console.error("Alert subscription failed:", error);
            showAlert(`Failed to process alert subscription.`, 'error'); // 🟢 Using MUI Alert
        } finally {
            setLoading(false);
        }
    };

    // Determine button properties based on state
    let buttonProps = {
        text: 'Notify Me When In Stock',
        variant: 'contained', // Solid button
        color: 'warning',      // Use warning color for visibility
        icon: <NotificationsActiveIcon />,
    };

    if (isSubscribed) {
        buttonProps = {
            text: 'Alert Set: Unsubscribe',
            variant: 'outlined', // Outline button
            color: 'warning',
            icon: <CheckCircleIcon />,
        };
    }
    
    if (!isAuthenticated) {
        buttonProps = {
            text: 'Login to Set Alert',
            variant: 'contained',
            color: 'info',
            icon: <LoginIcon />,
        };
    }

    return (
        <Button 
            // 🟢 Replaces <button> tag
            onClick={handleAlertToggle}
            variant={buttonProps.variant} 
            color={buttonProps.color}
            fullWidth // Replaces w-100
            disabled={loading || !isAuthenticated}
            size="large"
            sx={{ fontWeight: 'bold' }}
            startIcon={
                loading 
                    // 🟢 Replaces fa-spinner
                    ? <CircularProgress size={20} color="inherit" /> 
                    // 🟢 Replaces fa-bell / fa-check-circle / fa-right-to-bracket
                    : buttonProps.icon
            }
        >
            {/* 🟢 Display the appropriate text */}
            {loading ? 'Processing...' : buttonProps.text}
        </Button>
    );
};

export default StockAlertButton;