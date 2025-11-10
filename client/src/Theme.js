// tramar/client/src/Theme.js

import { createTheme } from '@mui/material/styles';

// --- Define Color Variables (Centralized) ---
const tramarBlue = '#155263';       // Primary brand color (dark blue/cyan) - Strong
const tramarBlueLight = '#2d6a7d';  // Lighter primary for hover states
const tramarBlueDark = '#005792';   // Darker primary for active states
const brightOrange = '#FF9900';     // Secondary action color (Used for brightness/accent) - NEW
const darkText = '#343a40';         // Main body text color - High contrast
const lightGrayBg = '#f8f9fa';      // Light background color
const appBarBg = '#e3e3e3';         // Specific background for the Navbar
const white = '#ffffff';            // Pure white color

// --- Custom Palette Namespace (Cleaned up) ---
const custom = {
    darkBg: darkText,
    navbarBg: appBarBg,
    lightText: white,
};

const theme = createTheme({
    // --- PALETTE: Ensures Brightness and High Contrast ---
    palette: {
        mode: 'light', // Ensures the overall default style is bright
        primary: { 
            main: tramarBlue, 
            light: tramarBlueLight, // Using defined variable
            dark: tramarBlueDark, 
            contrastText: white 
        },
        secondary: { 
            // ✅ FIX 1: Swapped the dull secondary gray for a BRIGHT ACCENT (Orange) 
            // to introduce visual energy/sharpness.
            main: brightOrange, 
            light: '#ffb74d',
            dark: '#ff8f00',
            contrastText: darkText // Ensures dark text on a bright background (High Contrast)
        },
        error: { main: '#dc3545' }, 
        success: { main: '#198754' }, 
        
        background: { 
            default: lightGrayBg, 
            paper: white // Pure white paper makes components look sharp
        },
        text: { 
            primary: darkText, // Darker text enhances contrast/sharpness
            secondary: '#6c757d', 
            disabled: '#adb5bd' // Using a specific light gray for disabled elements
        },

        // ✅ FIX 2: Passed the renamed object to the custom namespace correctly.
        custom: custom, 
    },
    
    // --- SPACING & SHAPE ---
    spacing: 8, 
    shape: {
        borderRadius: 8, 
    },

    // --- TYPOGRAPHY: Ensures Sharpness with Strong Weights ---
    typography: {
        fontFamily: ['Roboto', 'Montserrat', 'sans-serif'].join(','),
        // ✅ FIX 3: Ensured strong font weights and explicit line heights for sharp, controlled titles.
        h1: { fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '3rem', lineHeight: 1.2 },
        h2: { fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '2.5rem', lineHeight: 1.25 },
        h3: { fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '2rem', lineHeight: 1.3 },
        h4: { fontWeight: 600, lineHeight: 1.4 },
        subtitle1: { fontSize: '1.1rem', fontWeight: 400, lineHeight: 1.5 },
    },
    
    // --- COMPONENTS: Adds Visual Depth (Shadows/Transitions) ---
    components: {
        
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: { 
                    textTransform: 'none', 
                    borderRadius: 8, 
                    fontWeight: 600, // Added weight to buttons for punch
                    transition: 'all 0.2s ease-in-out' 
                },
                containedPrimary: ({ theme }) => ({ 
                    // ✅ FIX 4: Used theme.palette.primary.dark and theme object for hover state consistency
                    '&:hover': { 
                        backgroundColor: theme.palette.primary.dark 
                    } 
                }),
                containedSecondary: ({ theme }) => ({ 
                    // Added secondary hover for visual consistency
                    '&:hover': { 
                        backgroundColor: theme.palette.secondary.dark 
                    } 
                }),
            },
        },
        
        MuiLink: {
            defaultProps: { underline: 'none' },
            styleOverrides: {
                root: {
                    color: 'inherit',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease-in-out',
                    '&:hover': { 
                        opacity: 0.8, 
                        textDecoration: 'none' 
                    },
                },
            },
        },

        MuiAppBar: {
            styleOverrides: {
                root: ({ theme }) => ({
                    // ✅ FIX 5: Uses the custom color variable.
                    backgroundColor: theme.palette.custom.navbarBg, 
                    color: theme.palette.text.primary, 
                    // Increased shadow for clear separation from content
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)', 
                })
            }
        },
        
        // ✅ FIX 6: Added subtle hover effect and stronger shadow for depth and visual interest
        MuiCard: { 
            styleOverrides: { 
                root: { 
                    borderRadius: 12, 
                    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
                    transition: 'box-shadow 0.3s ease-in-out, transform 0.1s ease-in-out', 
                    '&:hover': {
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)', // More visible shadow on hover
                        // transform: 'translateY(-2px)', // Optional: subtle lift
                    }
                } 
            } 
        },
        
        MuiPaper: { 
            styleOverrides: { 
                root: { 
                    borderRadius: 8,
                    transition: 'box-shadow 0.3s ease-in-out', 
                } 
            } 
        },
    },
});

export default theme;