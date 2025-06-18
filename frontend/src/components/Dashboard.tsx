import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { DashboardSummary } from '../types/dashboard';
import axios from 'axios';
import { useDate } from '../context/DateContext';

/**
 * Dashboard Component
 *
 * This is the main dashboard component that displays:
 * 1. Financial summary (Income, Expenses, Net Balance)
 * 2. Budget overview chart
 * 3. Month/Year selection
 *
 * The component fetches data from several API endpoints and displays them in a responsive layout.
 */
const Dashboard = () => {
  // Navigation and location hooks for routing and URL parameters
  const navigate = useNavigate();
  useLocation();
  // Use global date context
  const { year, month, setYearMonth } = useDate();

  // State management for dashboard summary
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  // Dialog state for month/year selection
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);

  /**
   * Fetch dashboard data from several API endpoints
   * Updates whenever year/month changes
   */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch data from multiple endpoints in parallel
        const [incomeResponse, expensesResponse, budgetResponse] = await Promise.all([
          axios.get(`/api/income/total?year=${year}&month=${month + 1}`),
          axios.get(`/api/expenditure/total?year=${year}&month=${month + 1}`),
          axios.get(`/api/budget-tracking?year=${year}&month=${month + 1}`),
        ]);

        // Transform budget data for chart display
        const budgetOverview = budgetResponse.data.map((item: any) => ({
          category: item.category,
          budgeted: Number(item.budget),
          spent: Number(item.spent),
          remaining: Number(item.budget) - Number(item.spent),
          percentageUsed: item.percentageUsed,
        }));

        // Update summary state with fetched data
        setSummary({
          totalIncome: Number(incomeResponse.data),
          totalExpenses: Number(expensesResponse.data),
          netBalance: Number(incomeResponse.data) - Number(expensesResponse.data),
          budgetOverview,
        });
      } catch (error) {
        // Log and handle errors gracefully
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [year, month]);

  // Dialog handlers for selecting month and year
  const handleOpenDialog = () => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => setDialogOpen(false);

  // Apply the selected date and update context
  const handleApplyDate = () => {
    setYearMonth(selectedYear, selectedMonth);
    setDialogOpen(false);
  };

  // Generate arrays for month and year selection
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString('default', { month: 'long' })
  );
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  // Show loading state while data is being fetched
  if (!summary) {
    return <Typography>Loading...</Typography>;
  }

  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
        px: 4,
        py: 4,
        overflowX: 'hidden',
      }}
    >
      {/* Main grid layout for dashboard */}
      <Grid container spacing={3} alignItems="center">
        {/* Month and Year display with change button */}
        <Grid
          item
          xs={12}
          md={2}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h3" fontWeight="bold" color="text.primary">
              {monthName} {year}
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={handleOpenDialog}>
              Change
            </Button>
          </Box>
        </Grid>

        {/* Financial summary cards */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            ml: 'auto',
            maxWidth: 700,
            transition: 'max-width 0.2s',
          }}
        >
          <Grid container spacing={3}>
            {/* Income Card */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">Total Income</Typography>
                  </Box>
                  <Typography variant="h4">£{summary.totalIncome.toFixed(2)}</Typography>
                </CardContent>
              </Card>
              <Box mt={2} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/income')}
                >
                  Add Income
                </Button>
              </Box>
            </Grid>

            {/* Expenses Card */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                    <Typography variant="h6">Total Expenses</Typography>
                  </Box>
                  <Typography variant="h4">£{summary.totalExpenses.toFixed(2)}</Typography>
                </CardContent>
              </Card>
              <Box mt={2} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/expenses')}
                >
                  Add Expense
                </Button>
              </Box>
            </Grid>

            {/* Net Balance Card */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Net Balance</Typography>
                  </Box>
                  <Typography
                    variant="h4"
                    color={summary.netBalance >= 0 ? 'success.main' : 'error.main'}
                  >
                    £{summary.netBalance.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Month/Year Selection Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Select Month and Year</DialogTitle>
        <DialogContent sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
            {months.map((m, idx) => (
              <MenuItem key={m} value={idx}>
                {m}
              </MenuItem>
            ))}
          </Select>
          <Select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
            {years.map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleApplyDate} variant="contained">
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Budget Overview Chart */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">Budget Overview</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/budget')}
              >
                Set Budget
              </Button>
            </Box>
            <Box height={400}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.budgetOverview}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="budgeted" name="Budgeted" fill="#8884d8" />
                  <Bar dataKey="spent" name="Spent" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
