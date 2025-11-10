import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 1. REMOVED: import 'bootstrap/dist/css/bootstrap.min.css';
// 2. KEPT: './index.css' for essential global resets and layout (like #root styles)

// 🟢 NEW: Import Material UI Theme Provider and CssBaseline
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // <-- 🚨 FIX: Import CssBaseline
import theme from './Theme'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* 🟢 FIX: Wrap the entire application with the ThemeProvider */}
    <ThemeProvider theme={theme}>
        {/* 🟢 FIX: Add CssBaseline for foundational CSS resets */}
        <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();