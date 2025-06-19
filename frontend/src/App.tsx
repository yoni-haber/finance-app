import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import Dashboard from './components/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Budget from './pages/Budget';
import NetWorth from './pages/NetWorth';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

// App is the root component that sets up the application structure
function App() {
  const location = useLocation();
  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/income', label: 'Income' },
    { to: '/expenses', label: 'Expenses' },
    { to: '/budget', label: 'Budget' },
    { to: '/networth', label: 'Net Worth' },
  ];
  return (
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
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: location.pathname === link.to ? 'bold' : 'normal',
                  borderBottom: location.pathname === link.to ? '2px solid #fff' : 'none',
                  paddingBottom: 2,
                }}
              >
                {link.label}
              </Link>
            ))}
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
            <Route path="/networth" element={<NetWorth />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
