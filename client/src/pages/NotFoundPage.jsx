
// tramar/client/src/pages/NotFoundPage.jsx

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Box, Button, Container } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const NotFoundPage = () => {
    return (
        <Container maxWidth="sm" sx={{ 
            textAlign: 'center', 
            py: 10, 
            minHeight: '80vh', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center' 
        }}>
            <WarningIcon color="error" sx={{ fontSize: 80, mx: 'auto', mb: 2 }} />
            
            <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                404
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
                Page Not Found
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </Typography>

            <Button 
                variant="contained" 
                color="primary" 
                component={RouterLink} 
                to="/"
                size="large"
            >
                Go to Homepage
            </Button>
        </Container>
    );
};

export default NotFoundPage;