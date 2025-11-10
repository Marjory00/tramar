// tramar/client/src/components/auth/ProtectedRoute.jsx 🟢 Renamed file to reflect location

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Import context

// 🟢 Import Material UI components
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

const ProtectedRoute = ({ isAdmin: requiresAdmin }) => {
    const { user, loading, isAdmin } = useContext(AuthContext); 
    const theme = useTheme();

    // Optional: Show loading state while checking authentication
    if (loading) {
        return (
            // 🟢 Use MUI Box for centering and styling the loading state
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '80vh', // Ensure it fills the screen vertically
                    color: theme.palette.primary.main,
                }}
            >
                {/* 🟢 Use CircularProgress as the loading indicator */}
                <CircularProgress color="inherit" size={60} sx={{ mb: 2 }} />
                <Typography variant="h6">Loading...</Typography>
            </Box>
        ); 
    }

    // 2. Check Authentication
    if (!user) {
        // Not logged in -> redirect to login page
        return <Navigate to="/login" replace />;
    }
    
    // 3. Check Admin Authorization (if required)
    if (requiresAdmin && !isAdmin) {
        // Logged in, but not an admin -> redirect to home page
        // You might consider adding an Alert message here using a SnackBar context
        return <Navigate to="/" replace />; 
    }

    // Passed checks -> render nested routes
    return <Outlet />;
};

export default ProtectedRoute;