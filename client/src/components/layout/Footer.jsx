// tramar/client/src/components/layout/Footer.jsx

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Import Material UI components
import { 
    Box, 
    Container, 
    Grid, 
    Typography, 
    Link, 
    IconButton, 
    Divider, 
    useTheme 
} from '@mui/material';

// Import Material UI Icons
import BuildIcon from '@mui/icons-material/Build';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
    const theme = useTheme();

    // 🟢 CRITICAL FIX: Define the custom white color access safely
    const whiteTextColor = theme.palette.custom.lightText;
    
    // Define the style for footer links
    const footerLinkStyle = { 
        // 🟢 FIX 1: Use the correctly accessed custom white color property
        color: whiteTextColor, 
        opacity: 0.75, 
        textDecoration: 'none',
        transition: 'opacity 0.3s',
        '&:hover': { 
            opacity: 1, 
            // 🟢 FIX 2: Ensure the hover color remains the custom white text color
            color: whiteTextColor, 
            textDecoration: 'none', 
        } 
    };

    return (
        <Box 
            component="footer" 
            sx={{
                // Uses the custom 'dark' color defined in Theme.js
                backgroundColor: theme.palette.custom.darkBg, 
                // 🟢 CRITICAL FIX 3: Set Base color to the custom white text property
                color: whiteTextColor,
                py: 5,
                flexShrink: 0, 
                // Primary color accent border
                borderTop: `5px solid ${theme.palette.primary.main}`, 
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    
                    {/* Column 1: Branding & Copyright */}
                    <Grid item xs={12} md={4}>
                        {/* Title: uses 'whiteTextColor' via sx prop for guaranteed visibility */}
                        <Typography variant="h6" component="h5" 
                            sx={{ color: whiteTextColor, fontWeight: 700, mb: 2 }}
                        >
                            {/* Icon uses primary theme color */}
                            <BuildIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} /> 
                            Tramar PC Builder
                        </Typography>
                        {/* Text: inherits whiteTextColor from the parent Box */}
                        <Typography variant="body2" sx={{ opacity: 0.75, mb: 1 }} color="inherit">
                            Building the future, one component at a time.
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.75 }} color="inherit">
                            &copy; {new Date().getFullYear()} Tramar Inc. All rights reserved.
                        </Typography>
                    </Grid>

                    {/* Column 2: Quick Links */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 700 }}>Shop</Typography>
                        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                            {/* Links use the defined footerLinkStyle */}
                            <li><Link component={RouterLink} to="/products" sx={footerLinkStyle}>All Products</Link></li>
                            <li><Link component={RouterLink} to="/builder" sx={footerLinkStyle}>PC Builder</Link></li>
                            <li><Link component={RouterLink} to="/cart" sx={footerLinkStyle}>View Cart</Link></li>
                            <li><Link component={RouterLink} to="/login" sx={footerLinkStyle}>Account</Link></li>
                        </Box>
                    </Grid>
                    
                    {/* Column 3: Company & Support */}
                    <Grid item xs={6} md={3}>
                        <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 700 }}>Company</Typography>
                        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                            <li><Link component={RouterLink} to="/about" sx={footerLinkStyle}>About Us</Link></li>
                            <li><Link component={RouterLink} to="/contact" sx={footerLinkStyle}>Contact Us</Link></li>
                            <li><Link component={RouterLink} to="/privacy" sx={footerLinkStyle}>Privacy Policy</Link></li>
                            <li><Link component={RouterLink} to="/terms" sx={footerLinkStyle}>Terms</Link></li>
                        </Box>
                    </Grid>

                    {/* Column 4: Social Media & Contact */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 700 }}>Connect</Typography>
                        
                        {/* Contact Email Link */}
                        <Link 
                            href="mailto:support@tramar.com" 
                            sx={{ ...footerLinkStyle, display: 'flex', alignItems: 'center', mb: 3 }}
                        >
                            <EmailIcon color="primary" sx={{ mr: 1 }} />
                            support@tramar.com
                        </Link>
                        
                        {/* Social Icons */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                                component="a" 
                                href="https://facebook.com" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Facebook"
                                // Use the defined whiteTextColor here
                                sx={{ color: whiteTextColor, '&:hover': { color: theme.palette.primary.main } }}
                            >
                                <FacebookIcon />
                            </IconButton>
                            <IconButton 
                                component="a" 
                                href="https://twitter.com" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Twitter"
                                sx={{ color: whiteTextColor, '&:hover': { color: theme.palette.primary.main } }}
                            >
                                <TwitterIcon />
                            </IconButton>
                            <IconButton 
                                component="a" 
                                href="https://instagram.com" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Instagram"
                                sx={{ color: whiteTextColor, '&:hover': { color: theme.palette.primary.main } }}
                            >
                                <InstagramIcon />
                            </IconButton>
                            <IconButton 
                                component="a" 
                                href="https://github.com/Marjory00" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="GitHub"
                                sx={{ color: whiteTextColor, '&:hover': { color: theme.palette.primary.main } }}
                            >
                                <GitHubIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
                
                {/* Horizontal Rule for separation */}
                <Divider sx={{ my: 4, bgcolor: 'rgba(255, 255, 255, 0.2)' }} /> 

                {/* Bottom Row - Final Copyright text/extra info */}
                <Grid container>
                    <Grid item xs={12} textAlign="center">
                        <Typography variant="caption" sx={{ opacity: 0.75 }} color="inherit">
                            Proudly built for PC enthusiasts.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};
export default Footer;