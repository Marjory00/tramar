// tramar/client/src/components/layout/Header.jsx

import { useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Import Material UI components and Icons
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    IconButton, 
    Box, 
    useTheme, 
    useMediaQuery,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
// Import the correct icon for the Builder page
import BuildIcon from '@mui/icons-material/Build'; // Already imported, just confirming usage

// --- Context Mocking (Keeping original structure for replacement) ---
const mockUser = { name: 'John Doe', isAdmin: true };
const mockCartCount = 3;

// NOTE: Creating contexts here is only for this file to compile.
// In a real app, these would be imported from a separate context file.
const AuthContext = { user: mockUser, logout: () => console.log("Logged out (Mock)") };
const CartContext = { cartCount: mockCartCount };

// --- Universal Asset Path Prefix ---
const publicPath = process.env.PUBLIC_URL || ''; // Added fallback for environment variable

const Header = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    
    // Using mock context values directly or keeping useContext if required by your setup
    const { user, logout } = AuthContext; // Using mock directly
    const { cartCount } = CartContext; // Using mock directly

    const navItems = [
        { name: 'Home', path: '/', icon: <HomeIcon /> },
        { name: 'Products', path: '/products', icon: <StoreIcon /> },
        // FIXED: Replaced SVG placeholder with the BuildIcon (which is already imported)
        { name: 'Builder', path: '/builder', icon: <BuildIcon /> }, 
        { name: 'About', path: '/about', icon: <InfoIcon /> },
        { name: 'Contact', path: '/contact', icon: <ContactMailIcon /> },
    ];

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const drawerList = (
        <Box
            sx={{ width: 250, backgroundColor: theme.palette.background.default, height: '100%' }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {/* FIXED: Changed custom color 'custom.navbarBg' to 'background.paper' for safety */}
                <ListItem sx={{ bgcolor: theme.palette.background.paper, py: 1.5 }}> 
                    <Typography variant="h6" color="primary" fontWeight="bold">Navigation</Typography>
                </ListItem>
                
                {navItems.map((item) => (
                    <ListItem key={item.name} disablePadding divider>
                        <ListItemButton component={RouterLink} to={item.path}>
                            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
                
                <Box sx={{ mt: 2 }}>
                    {user ? (
                        <>
                            <ListItem disablePadding divider>
                                <ListItemButton component={RouterLink} to="/profile">
                                    <ListItemIcon sx={{ minWidth: 40 }}><AccountCircleIcon color="primary" /></ListItemIcon>
                                    <ListItemText primary={`Welcome, ${user.name.split(' ')[0]}`} />
                                </ListItemButton>
                            </ListItem>
                            {user.isAdmin && (
                                <ListItem disablePadding divider>
                                    <ListItemButton component={RouterLink} to="/admin">
                                        <ListItemIcon sx={{ minWidth: 40 }}><DashboardIcon color="primary" /></ListItemIcon>
                                        <ListItemText primary="Admin Dashboard" />
                                    </ListItemButton>
                                </ListItem>
                            )}
                            <ListItem disablePadding>
                                <ListItemButton onClick={logout}>
                                    <ListItemIcon sx={{ minWidth: 40 }}><LogoutIcon color="error" /></ListItemIcon>
                                    <ListItemText primary="Logout" />
                                </ListItemButton>
                            </ListItem>
                        </>
                    ) : (
                        <>
                            <ListItem disablePadding divider>
                                <ListItemButton component={RouterLink} to="/login">
                                    <ListItemIcon sx={{ minWidth: 40 }}><LockOpenIcon color="primary" /></ListItemIcon>
                                    <ListItemText primary="Sign In" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={RouterLink} to="/register">
                                    <ListItemIcon sx={{ minWidth: 40 }}><PersonAddIcon color="secondary" /></ListItemIcon>
                                    <ListItemText primary="Register" />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )}
                </Box>
            </List>
        </Box>
    );

    return (
        <AppBar position="sticky" sx={{ bgcolor: theme.palette.custom.navbarBg, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Toolbar sx={{ minHeight: 75 }}> {/* Adjusted Toolbar height to prevent clipping */}
                
                <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <Box
                        component="img"
                        sx={{
                            // 🔥 FIX: Increased height to 75px as requested
                            height: 75, 
                            width: 'auto',
                            // Adjusted margin to prevent logo touching the edge/text
                            marginRight: theme.spacing(2), 
                            // Ensures smooth logo visibility in dark/light mode
                            filter: theme.palette.mode === 'dark' ? 'invert(0.8)' : 'none'
                        }}
                        alt="Tramar PC Builder Logo"
                        src={`${publicPath}/images/logo1.jpg`} 
                    />
                    <Typography
                        variant="h5" // Raised font size slightly to match larger logo
                        sx={{ 
                            color: theme.palette.text.primary, 
                            fontWeight: 'bold', 
                            display: { xs: 'none', sm: 'block' } 
                        }}
                    >
                        Tramar PC Builder
                    </Typography>
                </RouterLink>

                {!isMobile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}> 
                        {navItems.map((item) => (
                            <Button 
                                key={item.name} 
                                component={RouterLink} 
                                to={item.path} 
                                // Color is text.secondary/primary for better contrast on AppBar background
                                sx={{ color: theme.palette.text.secondary, mx: 1, fontWeight: 500 }} 
                            >
                                {item.name}
                            </Button>
                        ))}

                        {user ? (
                            <>
                                <IconButton component={RouterLink} to="/profile" color="inherit" size="medium" title={`Signed in as ${user.name}`}>
                                    <AccountCircleIcon color="primary" />
                                </IconButton>
                                {user.isAdmin && (
                                    <Button component={RouterLink} to="/admin" variant="outlined" size="small" sx={{ ml: 1 }}>Admin</Button>
                                )}
                                <Button onClick={logout} variant="text" size="small" sx={{ ml: 1, color: theme.palette.error.main }}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Button component={RouterLink} to="/login" variant="outlined" size="small">Sign In</Button>
                                <Button component={RouterLink} to="/register" variant="contained" size="small" sx={{ ml: 1 }}>Register</Button>
                            </>
                        )}
                    </Box>
                )}

                <IconButton 
                    component={RouterLink} 
                    to="/cart" 
                    color="inherit" 
                    size="large" 
                    sx={{ ml: { xs: 1, lg: 2 } }} 
                    title="Shopping Cart"
                >
                    <Badge badgeContent={cartCount} color="error" max={99}>
                        <ShoppingCartIcon color="primary" />
                    </Badge>
                </IconButton>

                {isMobile && (
                    <IconButton
                        size="large"
                        edge="end" 
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                        sx={{ ml: 1 }}
                    >
                        <MenuIcon color="primary" />
                    </IconButton>
                )}
            </Toolbar>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                {drawerList}
            </Drawer>
        </AppBar>
    );
};

export default Header;