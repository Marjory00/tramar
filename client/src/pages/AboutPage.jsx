// tramar/client/src/pages/AboutPage.jsx

import { Link as RouterLink } from 'react-router-dom';

// 🟢 Import Material UI components and useTheme 
import { 
    Container, 
    Typography, 
    Grid, 
    Button, 
    Card, 
    CardContent, 
    Box, 
    Divider,
    useTheme
} from '@mui/material';

// 🟢 Import Material Icons
import BuildIcon from '@mui/icons-material/Build'; 
import WarningIcon from '@mui/icons-material/Warning'; 
import SettingsIcon from '@mui/icons-material/Settings'; 
import FlashOnIcon from '@mui/icons-material/FlashOn'; 
import GroupIcon from '@mui/icons-material/Group'; 
import CreditCardIcon from '@mui/icons-material/CreditCard'; 
// 🔥 FIX: Replaced FavoriteBorderIcon (Heart) with HandshakeIcon (Professional)
import HandshakeIcon from '@mui/icons-material/Handshake'; 

const AboutPage = () => {
    const theme = useTheme();

    // 🔥 FIX: Removed custom font stack/style object. 
    // Typography styles are now governed centrally by theme.js.

    return (
        <Box sx={{ bgcolor: theme.palette.background.default }}>
            
            {/* --- Section 1: Hero Header & Value Proposition (Full Width BG) --- */}
            <Box sx={{ 
                textAlign: 'center', 
                py: { xs: 8, md: 12 },
                // Using custom.navbarBg color defined in Theme.js
                bgcolor: theme.palette.custom.navbarBg, 
                mb: { xs: 6, md: 8 }
            }}>
                <Container maxWidth="md">
                    <Typography 
                        variant="h1" 
                        component="h1" 
                        color="primary"
                        fontWeight={800}
                        // Styles derived from Theme.js for sharpness/weight
                        sx={{ mb: 2, fontSize: { xs: '3rem', sm: '4rem', md: '5rem' } }}
                    >
                        Building PCs Should Be Simple.
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ fontSize: { xs: '1.1rem', sm: '1.4rem' } }}>
                        Tramar is your dedicated source for custom-built computers, eliminating compatibility errors with intelligent, real-time validation.
                    </Typography>
                    <Button 
                        component={RouterLink} 
                        to="/builder" 
                        variant="contained" 
                        color="secondary"
                        size="large"
                        startIcon={<BuildIcon />}
                        sx={{ mt: 4, py: 1.5, px: 5, fontWeight: 700, borderRadius: 1 }}
                    >
                        Start Your Build Now
                    </Button>
                </Container>
            </Box>

            {/* --- Section 2: Problem & Solution (The Core Value) --- */}
            <Container maxWidth="xl" sx={{ mb: { xs: 6, md: 10 } }}>
                <Grid 
                    container 
                    spacing={{ xs: 6, md: 10 }} 
                    alignItems="center" 
                >
                    {/* Visualization/Warning Box (Sharper Edges) */}
                    <Grid item xs={12} md={5} sx={{ order: { xs: 1, md: 1 } }}>
                        <Box sx={{ 
                            p: { xs: 4, sm: 6 }, 
                            // Using theme colors with transparency for softer look
                            bgcolor: theme.palette.warning.light + '10', 
                            borderRadius: 1, 
                            boxShadow: theme.shadows[10], 
                            border: `2px solid ${theme.palette.warning.main}`, 
                            textAlign: 'center'
                        }}>
                            <WarningIcon sx={{ fontSize: 100, color: 'warning.main', mb: 2 }} />
                            <Typography variant="h4" color="warning.dark" fontWeight="bold" gutterBottom>
                                Compatibility Guaranteed.
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Our constantly updated database validates thousands of part combinations in real-time, preventing expensive returns and build failure.
                            </Typography>
                        </Box>
                    </Grid>
                    
                    {/* Problem/Solution Text */}
                    <Grid item xs={12} md={7} sx={{ order: { xs: 2, md: 2 } }}>
                        <Typography 
                            variant="h2" 
                            component="h2" 
                            color="text.primary"
                            gutterBottom
                            fontWeight={700}
                            sx={{ mb: 2, fontSize: { xs: '2.25rem', sm: '3rem' } }}
                        >
                            End the Confusion. Build with Confidence.
                        </Typography>
                        <Typography 
                            variant="subtitle1" 
                            paragraph 
                            color="text.secondary"
                            sx={{ fontSize: '1.1rem', lineHeight: 1.6 }} 
                        >
                            In the complex world of custom PC building, mixing incompatible components—like pairing an older chipset with a new CPU or underpowering a GPU—is the number one source of frustration. Tramar was born to eliminate these headaches. We check every critical relationship (socket type, power draw, case clearance) instantly.
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mt: 3 }}>
                            We take the guesswork out of high-performance computing.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>

            <Divider sx={{ my: 0 }} />

            {/* --- Section 3: Core Technology Features (Sharper Cards) --- */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Typography 
                    variant="h2" 
                    component="h2" 
                    textAlign="center"
                    fontWeight={700}
                    sx={{ mb: { xs: 5, md: 8 }, fontSize: { xs: '2.25rem', sm: '3rem' } }}
                >
                    Our Intelligent Builder Features
                </Typography>
                <Grid container spacing={4}>
                    
                    {/* Feature Card Template */}
                    {['info', 'success', 'primary', 'secondary'].map((color, index) => (
                         <Grid item xs={12} sm={6} lg={3} key={index}>
                            <Card 
                                elevation={8} 
                                sx={{ 
                                    height: '100%', 
                                    borderTop: '6px solid', 
                                    borderColor: `${color}.main`, 
                                    transition: 'transform 0.3s, box-shadow 0.3s', 
                                    '&:hover': { 
                                        transform: 'translateY(-8px)', 
                                        boxShadow: theme.shadows[12] 
                                    },
                                    borderRadius: 1 
                                }}
                            >
                                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                    {/* Icon & Title based on feature */}
                                    {index === 0 && <SettingsIcon color="info" sx={{ fontSize: 48, mb: 2 }} />}
                                    {index === 1 && <FlashOnIcon color="success" sx={{ fontSize: 48, mb: 2 }} />}
                                    {index === 2 && <GroupIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />}
                                    {index === 3 && <CreditCardIcon color="secondary" sx={{ fontSize: 48, mb: 2 }} />}

                                    <Typography 
                                        variant="h6" 
                                        color={`${color}.dark`} 
                                        sx={{ mb: 1 }} 
                                        fontWeight="bold"
                                    >
                                        {index === 0 && 'Real-time Validation'}
                                        {index === 1 && 'Performance Scores'}
                                        {index === 2 && 'Community Builds'}
                                        {index === 3 && 'Secure Checkout'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {index === 0 && 'Instant checks on socket type, memory generation, and power draw ensure every component works together flawlessly.'}
                                        {index === 1 && 'See predicted FPS/Benchmark scores for your custom build before you finalize, maximizing value for your budget.'}
                                        {index === 2 && 'Browse, clone, and share expert-optimized builds. Learn from the community and get feedback on your plan.'}
                                        {index === 3 && 'Fast and secure checkout via tokenized payment processing, ensuring your financial information is always protected.'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    
                </Grid>
            </Container>

            <Divider sx={{ my: 0 }} />

            {/* --- Section 4: Mission & Team (FIXED ICON and Text) --- */}
            <Box sx={{ 
                textAlign: 'center', 
                py: { xs: 6, md: 10 },
                bgcolor: theme.palette.grey[50], 
            }}>
                <Container maxWidth="md">
                    {/* FIX: Changed icon to HandshakeIcon for professionalism/trust */}
                    <HandshakeIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                    <Typography 
                        variant="h3" 
                        component="h2" 
                        gutterBottom
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Our Commitment to the Builder Community
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        Tramar was founded by Marjory D. Marquez with the mission to bridge the gap between complex hardware knowledge and a smooth online shopping experience. We are committed to providing transparency, security, and the highest level of expertise in every transaction. Our goal is to empower every user, from first-time builder to seasoned professional.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default AboutPage;