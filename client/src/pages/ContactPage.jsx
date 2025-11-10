import { useState } from 'react';

// Import Material UI components
import {
    Container,
    Typography,
    Grid,
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    Alert,
    Divider,
    useTheme,
    // Add Link from MUI to replace raw <a> tags for consistency
    Link as MuiLink 
} from '@mui/material';

// Import Material Icons
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook'; 
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const theme = useTheme();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call delay
        console.log('Contact form submitted:', formData);
        
        // Basic validation check
        if (!formData.name || !formData.email || !formData.message) {
            alert("Please fill out all fields.");
            return;
        }

        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        // Hide success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
    };

    // Helper component for contact list items
    const ContactItem = ({ icon: Icon, title, content, link }) => (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'flex-start' }}>
            <Icon color="primary" sx={{ mr: 2, mt: 0.5, fontSize: 24, flexShrink: 0 }} />
            <Box>
                <Typography variant="body1" fontWeight="bold">
                    {title}
                </Typography>
                {link ? (
                    // Use standard a tag for external links to avoid MUI Link's default routing behavior
                    <a href={link} style={{ textDecoration: 'none', color: theme.palette.text.secondary }}>
                        <Typography variant="body2">{content}</Typography>
                    </a>
                ) : (
                    <Typography variant="body2" color="text.secondary">{content}</Typography>
                )}
            </Box>
        </Box>
    );


    return (
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
            {/* Header Section */}
            <Box textAlign="center" mb={{ xs: 4, md: 8 }}>
                <Typography
                    variant="h2"
                    component="h1"
                    color="text.primary"
                    fontWeight={800}
                    sx={{ mb: 1.5, fontSize: { xs: '2.5rem', md: '3.5rem' } }}
                >
                    Get In Touch <MailOutlineIcon color="primary" sx={{ fontSize: '1.2em', verticalAlign: 'middle' }} />
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 300, maxWidth: 600, margin: '0 auto' }}>
                    We're here to help you build the perfect machine. Reach out to our expert support team below.
                </Typography>
            </Box>

            <Grid container spacing={{ xs: 4, md: 6 }}>
                
                {/* 1. Contact Form Section */}
                <Grid item xs={12} lg={7}>
                    <Card elevation={6} sx={{ height: '100%', borderRadius: 2, p: { xs: 2, sm: 4 } }}>
                        <CardContent>
                            <Typography variant="h4" component="h2" gutterBottom fontWeight={600} color="primary">
                                Send Us a Message
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Use the form below for technical support, sales inquiries, or general questions.
                            </Typography>

                            {isSubmitted && (
                                <Alert
                                    severity="success"
                                    icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                                    sx={{ mb: 3 }}
                                >
                                    Thank you! Your message has been sent successfully. We will respond within 24-48 hours.
                                </Alert>
                            )}

                            <Box component="form" onSubmit={handleSubmit} noValidate>
                                {/* Name Field */}
                                <TextField
                                    label="Your Name"
                                    fullWidth
                                    margin="normal"
                                    name="name"
                                    variant="outlined"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    sx={{ mt: 0 }}
                                />

                                {/* Email Field */}
                                <TextField
                                    label="Email Address"
                                    fullWidth
                                    margin="normal"
                                    type="email"
                                    name="email"
                                    variant="outlined"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                                {/* Message Field */}
                                <TextField
                                    label="Your Message"
                                    fullWidth
                                    margin="normal"
                                    name="message"
                                    multiline
                                    rows={6} 
                                    variant="outlined"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="secondary" 
                                    size="large"
                                    fullWidth
                                    disabled={isSubmitted} 
                                    sx={{ 
                                        mt: 3, 
                                        py: 1.5,
                                        fontWeight: 700,
                                        boxShadow: theme.shadows[8]
                                    }}
                                    endIcon={<SendIcon />}
                                >
                                    {isSubmitted ? 'Sending...' : 'Submit Inquiry'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 2. Contact Information Section */}
                <Grid item xs={12} lg={5}>
                    <Card elevation={6} sx={{ height: '100%', bgcolor: theme.palette.grey[50], borderRadius: 2, p: { xs: 2, sm: 4 } }}>
                        <CardContent>
                            <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
                                Customer Hub
                            </Typography>

                            <Divider sx={{ mb: 3, mt: 1 }} />

                            {/* Contact Details Group */}
                            <Box mb={4}>
                                <ContactItem
                                    icon={EmailIcon}
                                    title="General Inquiries"
                                    content="info@tramar.com"
                                    link="mailto:info@tramar.com"
                                />
                                <ContactItem
                                    icon={EmailIcon}
                                    title="Technical Support"
                                    content="support@tramar.com"
                                    link="mailto:support@tramar.com"
                                />
                                <ContactItem
                                    icon={PhoneIcon}
                                    title="Call Us"
                                    content="(555) 123-4567 (Mon-Fri)"
                                    link="tel:5551234567"
                                />
                                <ContactItem
                                    icon={AccessTimeIcon}
                                    title="Business Hours"
                                    content="Monday - Friday: 9:00 AM - 5:00 PM EST"
                                />
                            </Box>

                            {/* Location and Map */}
                            <Divider sx={{ mb: 3 }} />

                            <Typography variant="h5" color="text.primary" gutterBottom fontWeight={600}>
                                Our Location
                            </Typography>
                            <ContactItem
                                icon={LocationOnIcon}
                                title="Warehouse Address"
                                content="123 Tech Way, Suite 101, Computer City, CA 90001"
                            />

                            {/* Placeholder for Map/Image */}
                            <Box 
                                sx={{ 
                                    height: 200, 
                                    bgcolor: theme.palette.grey[300], 
                                    borderRadius: 1, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    mt: 2 
                                }}
                            >
                                <Typography variant="caption" color="text.secondary">
                                    Map Integration Placeholder (Replace with Google Maps iframe or component)
                                </Typography>
                            </Box>
                            
                            {/* Social Media */}
                            <Divider sx={{ my: 3 }} />

                            <Typography variant="h5" color="text.primary" gutterBottom fontWeight={600}>
                                Connect Online
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                {/* FIX: Using valid placeholder URLs for accessibility */}
                                <a href="https://github.com/Marjory00" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }} aria-label="Visit our GitHub">
                                    <GitHubIcon fontSize="large" color="action" sx={{ transition: 'color 0.3s', '&:hover': { color: theme.palette.primary.main } }} />
                                </a>
                                <a href="https://www.twitter.com/tramar_placeholder" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }} aria-label="Follow us on Twitter">
                                    <TwitterIcon fontSize="large" color="action" sx={{ transition: 'color 0.3s', '&:hover': { color: theme.palette.info.main } }} />
                                </a>
                                <a href="https://www.facebook.com/tramar_placeholder" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }} aria-label="Follow us on Facebook">
                                    <FacebookIcon fontSize="large" color="action" sx={{ transition: 'color 0.3s', '&:hover': { color: theme.palette.info.dark } }} />
                                </a>
                                <a href="https://www.linkedin.com/company/tramar_placeholder" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }} aria-label="Connect with us on LinkedIn">
                                    <LinkedInIcon fontSize="large" color="action" sx={{ transition: 'color 0.3s', '&:hover': { color: theme.palette.info.light } }} />
                                </a>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ContactPage;