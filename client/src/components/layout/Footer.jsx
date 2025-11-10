import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
    Box, 
    Container, 
    Grid, 
    Typography, 
    Link, 
    IconButton,
    useTheme
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

// 🟢 FIX: Custom color for footer titles changed to #f8b400 (This is kept)
const FOOTER_TITLE_COLOR = '#f8b400';

// 🔥 FIX: Constant for the requested background color updated to #142d4c
const FOOTER_BACKGROUND_COLOR = '#142d4c'; 

const Footer = () => {
    const theme = useTheme();

    const socialLinks = [
        { icon: <FacebookIcon />, href: '#' },
        { icon: <TwitterIcon />, href: '#' },
        { icon: <InstagramIcon />, href: '#' },
    ];

    // Array of link groups for the footer
    const linkGroups = [
        {
            title: 'Shop',
            links: [
                { name: 'PC Builder', to: '/builder' },
                { name: 'New Arrivals', to: '/products?sort=newest' },
                { name: 'Deals', to: '/deals' },
                { name: 'All Products', to: '/products' },
            ],
        },
        {
            title: 'Help & Support',
            links: [
                { name: 'Contact Us', to: '/contact' },
                { name: 'FAQ', to: '/faq' },
                { name: 'Shipping Policy', to: '/shipping' },
                { name: 'Return Policy', to: '/returns' },
            ],
        },
        {
            title: 'Company',
            links: [
                { name: 'About Tramar', to: '/about' },
                { name: 'Careers', to: '/careers' },
                { name: 'Blog', to: '/blog' },
                { name: 'Terms of Service', to: '/terms' },
            ],
        },
    ];

    return (
        <Box 
            component="footer" 
            sx={{ 
                // 🔥 APPLIED NEW COLOR: #142d4c
                bgcolor: FOOTER_BACKGROUND_COLOR, 
                // Ensuring default text color remains light for contrast
                color: theme.palette.grey[300], 
                py: { xs: 6, md: 8 } 
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    
                    {/* Brand Info & Socials */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" gutterBottom sx={{ color: FOOTER_TITLE_COLOR, fontWeight: 700 }}>
                            Tramar PC
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Build Smarter. Game Faster. The ultimate platform for custom PC building with real-time compatibility checking.
                        </Typography>
                        <Box>
                            {socialLinks.map((item, index) => (
                                <IconButton 
                                    key={index} 
                                    aria-label={item.icon.type.displayName}
                                    href={item.href} 
                                    target="_blank"
                                    sx={{ 
                                        // Social icons use light color
                                        color: theme.palette.grey[300],
                                        '&:hover': { color: theme.palette.primary.main }
                                    }}
                                >
                                    {item.icon}
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>

                    {/* Link Sections */}
                    {linkGroups.map((group, index) => (
                        <Grid item xs={6} sm={4} md={2} key={index}>
                            <Typography variant="h6" gutterBottom sx={{ color: FOOTER_TITLE_COLOR, fontWeight: 600 }}>
                                {group.title}
                            </Typography>
                            <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
                                {group.links.map((link, linkIndex) => (
                                    <li key={linkIndex} style={{ margin: theme.spacing(0.5, 0) }}>
                                        <Link
                                            component={RouterLink}
                                            to={link.to}
                                            variant="body2"
                                            sx={{ 
                                                textDecoration: 'none', 
                                                // Link text uses light color
                                                color: theme.palette.grey[400],
                                                '&:hover': { color: theme.palette.primary.light, textDecoration: 'underline' }
                                            }}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </Box>
                        </Grid>
                    ))}
                    
                </Grid>

                {/* Copyright & Bottom Bar */}
                <Box 
                    sx={{ 
                        // Divider color adjusted for the dark background
                        borderTop: `1px solid ${theme.palette.grey[600]}`, 
                        mt: 6, 
                        pt: 3, 
                        textAlign: 'center' 
                    }}
                >
                    <Typography 
                        variant="body2" 
                        // Copyright text uses light color
                        color={theme.palette.grey[400]}
                    >
                        © {new Date().getFullYear()} Tramar PC. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;