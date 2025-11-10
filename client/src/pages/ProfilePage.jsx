import React, { useContext, useState } from 'react'; // FIXED: Removed unused 'useEffect' import
import { Link as RouterLink } from 'react-router-dom';

// 🟢 Import Material UI components and Icons
import { 
    Container, 
    Typography, 
    Box, 
    Grid, 
    Card, 
    CardContent, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemIcon,
    Button,
    Divider,
    useTheme
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';

// --- Mock Context and Data for Functionality (Keep for component function) ---
const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    isAdmin: false,
    dateJoined: '2023-01-15T10:00:00Z',
};
// NOTE: In a real application, you would import your actual AuthContext here:
// import { AuthContext } from '../context/AuthContext'; 
const AuthContext = React.createContext({
    user: mockUser,
    logout: () => alert('Logging out...'),
});
// ----------------------------------------------


const ProfilePage = () => {
    const theme = useTheme();
    // Destructure user and logout from the (mock) context
    const { user, logout } = useContext(AuthContext); 
    // State to hold the profile data (initialized with user from context)
    const [profile, setProfile] = useState(user); // FIXED: Renamed to avoid shadowing if 'user' was used for state

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleLogout = () => {
        logout(); // Call the logout function from your context
    };
    
    // Fallback/Loading State Check
    if (!profile) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Typography variant="h5" color="text.secondary" textAlign="center">
                    Please log in to view your profile.
                </Typography>
                <Box textAlign="center" mt={3}>
                    <Button component={RouterLink} to="/login" variant="contained" color="primary">
                        Go to Login
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box mb={4} sx={{ borderBottom: `2px solid ${theme.palette.divider}`, pb: 2 }}>
                <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                    Welcome, {profile.name}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your personal information, orders, and settings.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                
                {/* Column 1: Profile Details (md=8) */}
                <Grid item xs={12} md={8}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
                                Personal Information
                            </Typography>
                            <List disablePadding>
                                <ListItem>
                                    <ListItemIcon><AccountCircleIcon color="primary" /></ListItemIcon>
                                    <ListItemText 
                                        primary="Full Name" 
                                        secondary={profile.name} 
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem>
                                    <ListItemIcon><EmailIcon color="primary" /></ListItemIcon>
                                    <ListItemText 
                                        primary="Email Address" 
                                        secondary={profile.email} 
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem>
                                    <ListItemIcon><CalendarMonthIcon color="primary" /></ListItemIcon>
                                    <ListItemText 
                                        primary="Member Since" 
                                        secondary={formatDate(profile.dateJoined)} 
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem>
                                    <ListItemIcon><SettingsIcon color="primary" /></ListItemIcon>
                                    <ListItemText 
                                        primary="Role" 
                                        secondary={profile.isAdmin ? 'Administrator' : 'Customer'} 
                                    />
                                </ListItem>
                            </List>
                            <Box mt={3} textAlign="right">
                                {/* In a real app, this button links to an edit profile page */}
                                <Button component={RouterLink} to="/profile/edit" variant="outlined" startIcon={<SettingsIcon />}>
                                    Edit Profile
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                
                {/* Column 2: Quick Actions (md=4) */}
                <Grid item xs={12} md={4}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                                Quick Actions
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button 
                                    component={RouterLink} 
                                    to="/myorders" 
                                    variant="contained" 
                                    color="secondary" 
                                    size="large"
                                    startIcon={<HistoryIcon />}
                                >
                                    View Order History
                                </Button>
                                
                                <Button 
                                    component={RouterLink} 
                                    to="/settings" 
                                    variant="outlined" 
                                    color="info" 
                                    size="large"
                                    startIcon={<SettingsIcon />}
                                >
                                    Account Settings
                                </Button>
                                
                                {profile.isAdmin && (
                                    <Button 
                                        component={RouterLink} 
                                        to="/admin/dashboard" 
                                        variant="contained" 
                                        color="primary" 
                                        size="large"
                                    >
                                        Admin Dashboard
                                    </Button>
                                )}
                                
                                <Divider sx={{ my: 1 }} />
                                
                                <Button 
                                    onClick={handleLogout} 
                                    variant="outlined" 
                                    color="error" 
                                    size="large"
                                    startIcon={<LogoutIcon />}
                                >
                                    Log Out
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProfilePage;