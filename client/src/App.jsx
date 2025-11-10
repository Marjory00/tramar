// tramar/client/src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 🟢 Material UI Imports
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import theme from './Theme'; 

// --- Component and Context Imports ---
import Header from './components/layout/Header.jsx'; 
import Footer from './components/layout/Footer.jsx';
import ProtectedRoute from './components/routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// --- Public Pages Imports ---
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage'; 
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage'; 
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage'; 
import ContactPage from './pages/ContactPage'; 
import NotFoundPage from './pages/NotFoundPage';

// 🟢 NEW: Import the Builder Page
import BuilderPage from './pages/BuilderPage'; 

// --- Protected Pages Imports ---
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage'; 

// --- Admin Pages Imports ---
import AdminDashboard from './pages/admin/AdminDashboard'; 
import AdminProductListPage from './pages/admin/ProductListPage'; 
import AdminProductEditPage from './pages/admin/ProductEditPage'; 


function App() {
    return (
        <ThemeProvider theme={theme}>
            {/* CssBaseline resets CSS to a consistent baseline across browsers */}
            <CssBaseline /> 
            <Router>
                <AuthProvider> 
                    {/* Main container for sticky footer layout */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                        
                        <Header />
                        
                        {/* The main content box that grows to fill available space */}
                        <Box component="main" sx={{ flexGrow: 1 }}> 
                            <Routes>
                                {/* ----------------------- 1. PUBLIC ROUTES ----------------------- */}
                                <Route path="/" element={<HomePage />} />
                                <Route path="/products" element={<ProductsPage />} />
                                <Route path="/product/:id" element={<ProductDetailPage />} />
                                <Route path="/builder" element={<BuilderPage />} /> {/* 🟢 NEW: Builder Route */}
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/about" element={<AboutPage />} /> 
                                <Route path="/contact" element={<ContactPage />} />
                                
                                {/* ----------------------- 2. USER PROTECTED ROUTES ----------------------- */}
                                {/* Routes nested within ProtectedRoute require user authentication */}
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/profile" element={<ProfilePage />} />
                                    <Route path="/checkout" element={<CheckoutPage />} />
                                </Route>

                                {/* ----------------------- 3. ADMIN PROTECTED ROUTES ----------------------- */}
                                {/* Routes nested within ProtectedRoute with isAdmin=true require an admin user role */}
                                <Route element={<ProtectedRoute isAdmin={true} />}> 
                                    <Route path="/admin" element={<AdminDashboard />} /> 
                                    <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
                                    <Route path="/admin/products" element={<AdminProductListPage />} />
                                    <Route path="/admin/product/:id/edit" element={<AdminProductEditPage />} />
                                </Route>
                                
                                {/* ----------------------- 4. FALLBACK ROUTE ----------------------- */}
                                {/* Catch-all route for any undefined path (404 Not Found) */}
                                <Route path="*" element={<NotFoundPage />} />
                                
                            </Routes>
                        </Box>
                        
                        <Footer />
                        
                    </Box>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;