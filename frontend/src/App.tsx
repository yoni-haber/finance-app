import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import Dashboard from './components/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Budget from './pages/Budget';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

// App is the root component that sets up the application structure
function App() {
  return (
    <ThemeProvider>
      <Router>
        {/* Main container with full viewport height and width */}
        <Box
          sx={{
            minHeight: '100vh',
            width: '100vw',
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top navigation bar */}
          <AppBar position="fixed">
            <Toolbar>
              {/* App title */}
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Finance Tracker
              </Typography>
              {/* Navigation links */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                  Dashboard
                </Link>
                <Link to="/income" style={{ color: 'white', textDecoration: 'none' }}>
                  Income
                </Link>
                <Link to="/expenses" style={{ color: 'white', textDecoration: 'none' }}>
                  Expenses
                </Link>
                <Link to="/budget" style={{ color: 'white', textDecoration: 'none' }}>
                  Budget
                </Link>
                <ThemeToggle />
              </Box>
            </Toolbar>
          </AppBar>
          {/* Spacer to prevent content from hiding behind fixed AppBar */}
          <Toolbar />
          {/* Main content container */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              px: { xs: 2, sm: 4, md: 6 },
              py: { xs: 2, sm: 4 },
            }}
          >
            {/* Content wrapper with max width */}
            <Box sx={{ width: '100%', maxWidth: 1800 }}>
              {/* Route definitions - each route renders a different component */}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/income" element={<Income />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/budget" element={<Budget />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
