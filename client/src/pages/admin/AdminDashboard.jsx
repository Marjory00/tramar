import React, { useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Assuming you have an AuthContext

// 🟢 Import Material UI components
import { 
    Typography, 
    Alert, 
    AlertTitle, 
    Box, 
    Grid,        // Added for layout
    Card,        // Added for dashboard sections
    CardContent,
    Button,
} from '@mui/material';

// 🟢 Import Icons
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // 1. ACCESS CONTROL: Redirect non-admin users immediately
    if (!user || user.role !== 'admin') {
        // Use useEffect for navigation to prevent render cycle issues, 
        // but a simple check like this works if the component only renders the check.
        // For robustness, redirecting at the routing level is often better, 
        // but this handles internal state changes.
        navigate('/');
        return null; // Don't render anything if redirecting
    }
    
    // Define dashboard cards/links
    const dashboardItems = [
        { 
            title: 'Manage Products', 
            icon: <InventoryIcon fontSize="large" color="secondary" />, 
            description: 'Create, edit, and delete store products.',
            path: '/admin/products' 
        },
        { 
            title: 'Manage Users', 
            icon: <PeopleIcon fontSize="large" color="secondary" />, 
            description: 'View and manage user accounts and roles.',
            path: '/admin/users' 
        },
        { 
            title: 'Manage Orders', 
            icon: <ShoppingCartIcon fontSize="large" color="secondary" />, 
            description: 'Process, ship, and review customer orders.',
            path: '/admin/orders' 
        },
    ];

    return (
        // 🟢 Use Box as the main container
        <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
            
            <Alert severity="success" sx={{ mb: 4 }}>
                <AlertTitle>
                    <Typography 
                        variant="h5" 
                        component="h1" 
                        fontWeight="bold"
                    >
                        Welcome, Administrator! 🧑‍💻
                    </Typography>
                </AlertTitle>
                <Typography variant="body1">
                    Use the tools below to manage the e-commerce platform. Access is restricted to site administrators only.
                </Typography>
            </Alert>
            
            <Grid container spacing={4}>
                {dashboardItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.title}>
                        <Card 
                            component={RouterLink} // Use RouterLink for proper routing
                            to={item.path} 
                            sx={{ height: '100%', textDecoration: 'none', transition: '0.3s', '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' } }}
                        >
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Box sx={{ mb: 1 }}>
                                    {item.icon}
                                </Box>
                                <Typography variant="h6" gutterBottom color="text.primary" sx={{ fontWeight: 'bold' }}>
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.description}
                                </Typography>
                                <Button 
                                    variant="outlined" 
                                    color="secondary" 
                                    size="small" 
                                    sx={{ mt: 2 }}
                                >
                                    Go to {item.title.split(' ')[1]}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            
        </Box>
    );
};
export default AdminDashboard;