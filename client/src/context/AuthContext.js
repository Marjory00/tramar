import React, { createContext, useState, useEffect } from 'react';
// import apiService from '../services/apiService'; // Assuming you have an API service

// Define the name for the token key in localStorage
const TOKEN_KEY = 'authToken'; 

// 1. Create the Context
// Define a default/initial value for clarity
export const AuthContext = createContext({
    user: null,
    loading: true,
    isAdmin: false,
    login: () => {},
    logout: () => {},
});

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true); // Start loading as true to check storage

    // --- Core Logic: Load User State from Storage ---
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem(TOKEN_KEY);
            
            if (token) {
                // In a real app, you would:
                // 1. Call an API endpoint (e.g., /api/auth/me) with the token
                // 2. Validate the token and fetch user details (id, name, role)
                
                // Mock: Simulate API validation delay
                await new Promise(resolve => setTimeout(resolve, 500)); 
                
                // Mock: If validation succeeds, set user data
                const mockUser = { name: 'Verified User', role: 'admin', token };
                setUser(mockUser); 
            }
            
            setLoading(false);
        };

        loadUser();
    }, []); // Run only once on mount

    // --- Authentication Actions ---
    
    // Login function handles fetching/receiving the token
    const login = async (email, password) => {
        setLoading(true);
        try {
            // In a real app: 
            // const response = await apiService.login(email, password);
            // const token = response.data.token;
            // const userData = response.data.user; 
            
            // Mock: Simulate successful login and token reception
            await new Promise(resolve => setTimeout(resolve, 800)); 
            const mockToken = 'mock-jwt-token-12345';
            const userData = { name: 'LoggedIn User', role: 'user', token: mockToken };

            localStorage.setItem(TOKEN_KEY, mockToken);
            setUser(userData);
            return true; // Indicate success
            
        } catch (error) {
            console.error('Login failed:', error);
            // Handle error (e.g., show notification)
            return false;
        } finally {
            setLoading(false);
        }
    };
    
    // Logout function handles clearing state and storage
    const logout = () => {
        setLoading(true);
        localStorage.removeItem(TOKEN_KEY);
        // Remove token from API service headers if applicable
        setUser(null);
        setLoading(false);
    };

    // Derived State
    const isAuthenticated = !!user;
    const isAdmin = user && user.role === 'admin';

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                loading, 
                isAuthenticated, // Added useful state
                isAdmin, 
                login, 
                logout 
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};