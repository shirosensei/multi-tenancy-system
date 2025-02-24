import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme.js';
import './assets/css/index.css'
import { AuthProvider } from './contexts/AuthContext';
import "./assets/css/App.css";
import { TenantProvider } from './contexts/tenantContext'; 
import ErrorBoundary from './ErrorBoundary.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
// createRoot(document.getElementById('root')).render(
<React.StrictMode>
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <TenantProvider>
        <App />
        </TenantProvider>
      </AuthProvider>
      {/* <App /> */}
    </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
