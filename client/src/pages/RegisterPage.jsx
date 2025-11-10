import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';

const RegisterPage = () => {
    const theme = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        
        // --- Placeholder for actual API call ---
        console.log('Attempting registration with:', { name, email });
        
        setTimeout(() => {
            setLoading(false);
            if (email === 'test@error.com') { // Simulate registration error
                setError('Registration failed. Email already in use.');
            } else {
                // In a real app: check API response and redirect/show success
                console.log('Registration successful.');
                alert(`Account created for ${name}! Redirecting to login...`);
            }
        }, 1500);
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Card elevation={6}>
                <CardContent sx={{ p: 4 }}>
                    
                    {/* Header */}
                    <Box textAlign="center" mb={4}>
                        <Typography 
                            variant="h4" 
                            component="h1" 
                            gutterBottom
                            sx={{ fontWeight: 'bold', color: theme.palette.secondary.main }}
                        >
                            <PersonAddIcon fontSize="large" sx={{ mr: 1, verticalAlign: 'bottom' }} /> Create Account
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Join us and start building your dream PC today.
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <Box mb={2}>
                            <Typography color="error" variant="body2">{error}</Typography>
                        </Box>
                    )}

                    {/* Registration Form */}
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        
                        {/* Name Field */}
                        <TextField
                            label="Full Name"
                            fullWidth
                            margin="normal"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <PersonIcon color="action" sx={{ mr: 1 }} />
                                ),
                            }}
                        />

                        {/* Email Field */}
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
                        
                        {/* Password Field */}
                        <TextField
                            label="Password"
                            fullWidth
                            margin="normal"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <LockIcon color="action" sx={{ mr: 1 }} />
                                ),
                            }}
                        />

                        {/* Confirm Password Field */}
                        <TextField
                            label="Confirm Password"
                            fullWidth
                            margin="normal"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            error={password !== confirmPassword && confirmPassword.length > 0}
                            helperText={password !== confirmPassword && confirmPassword.length > 0 ? "Passwords must match" : ""}
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
                            color="secondary"
                            size="large"
                            fullWidth
                            disabled={loading || !name || !email || !password || !confirmPassword || password !== confirmPassword}
                            sx={{ mb: 2, py: 1.5 }}
                        >
                            {loading ? <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>Creating Account...</Box> : 'Register'}
                        </Button>
                        
                        <Box textAlign="center">
                            <Typography variant="body2">
                                Already have an account? 
                                <Button component={RouterLink} to="/login" variant="text" size="small" sx={{ ml: 0.5 }}>
                                    Sign In
                                </Button>
                            </Typography>
                        </Box>
                    </Box>
                    
                </CardContent>
            </Card>
        </Container>
    );
};

export default RegisterPage;