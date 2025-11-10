import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// 🟢 Import Material UI components and Icons
import { 
    Container, 
    Typography, 
    TextField, 
    Button, 
    Box, 
    Card, 
    CardContent,
    useTheme
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const LoginPage = () => {
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    // You can add state for error messages here

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        // --- Placeholder for actual API call ---
        console.log('Attempting login with:', { email, password });
        
        setTimeout(() => {
            setLoading(false);
            // In a real app: check API response and redirect on success
            console.log('Login attempt finished.');
            // For now, simulate a redirect or display a success/error message
        }, 2000);
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Card elevation={4}>
                <CardContent sx={{ p: 4 }}>
                    
                    {/* Header */}
                    <Box textAlign="center" mb={4}>
                        <Typography 
                            variant="h4" 
                            component="h1" 
                            gutterBottom
                            sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
                        >
                            <LoginIcon fontSize="large" sx={{ mr: 1, verticalAlign: 'bottom' }} /> User Login
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Access your account to manage orders and PC builds.
                        </Typography>
                    </Box>

                    {/* Login Form */}
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            label="Email Address"
                            fullWidth
                            margin="normal"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <EmailIcon color="action" sx={{ mr: 1 }} />
                                ),
                            }}
                        />
                        
                        <TextField
                            label="Password"
                            fullWidth
                            margin="normal"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: (
                                    <LockIcon color="action" sx={{ mr: 1 }} />
                                ),
                            }}
                        />
                        
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            disabled={loading || !email || !password}
                            sx={{ mb: 2, py: 1.5 }}
                        >
                            {loading ? <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>Logging In...</Box> : 'Sign In'}
                        </Button>
                        
                        <Box textAlign="center">
                            <Typography variant="body2">
                                New Customer? <Button component={Link} to="/register" variant="text" size="small">Register Here</Button>
                            </Typography>
                            <Button component={Link} to="/forgotpassword" variant="text" size="small" sx={{ mt: 1 }}>
                                Forgot Password?
                            </Button>
                        </Box>
                    </Box>
                    
                </CardContent>
            </Card>
        </Container>
    );
};

export default LoginPage;