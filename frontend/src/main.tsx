// Import necessary dependencies from React and Material-UI
import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

// Create the root of the React application
// This is where the entire app gets mounted to the DOM
ReactDOM.createRoot(document.getElementById('root')!).render(
  // StrictMode helps identify potential problems in the application
  <React.StrictMode>
    <ThemeProvider>
      {/* CssBaseline provides consistent baseline styles */}
      <CssBaseline />
      {/* App is the root component of our application */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
