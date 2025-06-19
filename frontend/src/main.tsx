import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { DateProvider } from './context/DateContext';

/* Create the root of the React application where the entire application is mounted to the DOM (web page) */
ReactDOM.createRoot(document.getElementById('root')!).render(
  // StrictMode is a tool for highlighting potential problems in an application
  // It does not render any visible UI, but helps with best practices and warnings during development
  <React.StrictMode>
    {/* ThemeProvider supplies the theme (light or dark) to the whole app */}
    <ThemeProvider>
      {/* CssBaseline provides a consistent baseline of styles across browsers */}
      <CssBaseline />
      <Router>
        <DateProvider>
          {/* App is the root component containing all routes and main logic */}
          <App />
        </DateProvider>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
