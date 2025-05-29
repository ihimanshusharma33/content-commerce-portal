import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeAuth } from './services/authService';
import './index.css';

// Initialize authentication
initializeAuth();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
