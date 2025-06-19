import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
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
  Tabs,
  Tab,
} from '@mui/material';
import {
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
  LineChart,
  Line,
} from 'recharts';
import type { DashboardSummary } from '../types/dashboard';
import axios from 'axios';
import { useDate } from '../context/DateContext';
import { getNetWorthHistory } from '../api/financeApi';
import type { NetWorth } from '../types/finance';

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
  useLocation();
  // Use global date context
  const { year, month, setYearMonth } = useDate();

  // State management for dashboard summary
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  // Dialog state for month/year selection
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);

  // Net worth history state
  const [netWorthHistory, setNetWorthHistory] = useState<NetWorth[]>([]);
  const [netWorthStats, setNetWorthStats] = useState<{
    change1: number;
    change3: number;
    highest: number;
    lowest: number;
    avg: number;
  }>({ change1: 0, change3: 0, highest: 0, lowest: 0, avg: 0 });

  // Dashboard view state
  const [dashboardView, setDashboardView] = useState<'budget' | 'networth'>('budget');
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setDashboardView(newValue === 0 ? 'budget' : 'networth');
  };

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

  // Fetch net worth history
  useEffect(() => {
    getNetWorthHistory().then(res => {
      const history: NetWorth[] = res.data || [];
      // Sort by year, month
      history.sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month));
      setNetWorthHistory(history);
      // Calculate stats
      const netWorths = history.map(nw => nw.assets - nw.liabilities);
      const len = netWorths.length;
      const change1 = len > 1 ? netWorths[len - 1] - netWorths[len - 2] : 0;
      const change3 =
        len > 3
          ? netWorths[len - 1] - netWorths[len - 4]
          : len > 1
            ? netWorths[len - 1] - netWorths[0]
            : 0;
      const highest = netWorths.length ? Math.max(...netWorths) : 0;
      const lowest = netWorths.length ? Math.min(...netWorths) : 0;
      const avg = netWorths.length > 1 ? (netWorths[len - 1] - netWorths[0]) / (len - 1) : 0;
      setNetWorthStats({ change1, change3, highest, lowest, avg });
    });
  }, []);

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
      {/* Dashboard View Tabs */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Tabs
          value={dashboardView === 'budget' ? 0 : 1}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Budget Overview" />
          <Tab label="Net Worth Overview" />
        </Tabs>
      </Box>
      {/* Main grid layout for dashboard */}
      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} md={3}>
          {/* Date Selector above summary */}
          <Box display="flex" alignItems="center" justifyContent="center" mb={2} gap={2}>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              {monthName} {year}
            </Typography>
            <Button variant="outlined" onClick={handleOpenDialog}>
              Change
            </Button>
          </Box>
          <Paper sx={{ p: 2, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Grid container direction="column" spacing={2}>
              {dashboardView === 'budget' ? (
                <>
                  <Grid item>
                    <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                      <TrendingUpIcon color="success" />
                      <Typography variant="subtitle2">Total Income</Typography>
                      <Typography variant="h5" fontWeight="bold">
                        £{summary.totalIncome.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                      <TrendingDownIcon color="error" />
                      <Typography variant="subtitle2">Total Expenses</Typography>
                      <Typography variant="h5" fontWeight="bold">
                        £{summary.totalExpenses.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                      <AccountBalanceIcon color="primary" />
                      <Typography variant="subtitle2">Net Balance</Typography>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color={summary.netBalance >= 0 ? 'success.main' : 'error.main'}
                      >
                        £{summary.netBalance.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item>
                    <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                      <AccountBalanceIcon
                        color={
                          netWorthHistory.length > 0 &&
                          netWorthHistory[netWorthHistory.length - 1].assets -
                            netWorthHistory[netWorthHistory.length - 1].liabilities >=
                            0
                            ? 'success'
                            : 'error'
                        }
                      />
                      <Typography variant="subtitle2">Current Net Worth</Typography>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color={
                          netWorthHistory.length > 0 &&
                          netWorthHistory[netWorthHistory.length - 1].assets -
                            netWorthHistory[netWorthHistory.length - 1].liabilities >=
                            0
                            ? 'success.main'
                            : 'error.main'
                        }
                      >
                        {netWorthHistory.length > 0
                          ? (
                              netWorthHistory[netWorthHistory.length - 1].assets -
                              netWorthHistory[netWorthHistory.length - 1].liabilities
                            ).toLocaleString('en-GB', {
                              style: 'currency',
                              currency: 'GBP',
                              minimumFractionDigits: 2,
                            })
                          : 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                      {netWorthStats.change1 >= 0 ? (
                        <TrendingUpIcon color="success" />
                      ) : (
                        <TrendingDownIcon color="error" />
                      )}
                      <Typography variant="subtitle2">Change (1 month)</Typography>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color={netWorthStats.change1 >= 0 ? 'success.main' : 'error.main'}
                      >
                        {netWorthStats.change1 >= 0 ? '+' : ''}
                        {netWorthStats.change1.toLocaleString('en-GB', {
                          style: 'currency',
                          currency: 'GBP',
                          minimumFractionDigits: 2,
                        })}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                      {netWorthStats.change3 >= 0 ? (
                        <TrendingUpIcon color="success" />
                      ) : (
                        <TrendingDownIcon color="error" />
                      )}
                      <Typography variant="subtitle2">Change (3 months)</Typography>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color={netWorthStats.change3 >= 0 ? 'success.main' : 'error.main'}
                      >
                        {netWorthStats.change3 >= 0 ? '+' : ''}
                        {netWorthStats.change3.toLocaleString('en-GB', {
                          style: 'currency',
                          currency: 'GBP',
                          minimumFractionDigits: 2,
                        })}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                      {netWorthStats.avg >= 0 ? (
                        <TrendingUpIcon color="success" />
                      ) : (
                        <TrendingDownIcon color="error" />
                      )}
                      <Typography variant="subtitle2">Avg. Monthly Change</Typography>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color={netWorthStats.avg >= 0 ? 'success.main' : 'error.main'}
                      >
                        {netWorthStats.avg >= 0 ? '+' : ''}
                        {netWorthStats.avg.toLocaleString('en-GB', {
                          style: 'currency',
                          currency: 'GBP',
                          minimumFractionDigits: 2,
                        })}
                      </Typography>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </Grid>
        {/* Main Chart - right column on desktop, below summary on mobile */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 2, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom>
              {dashboardView === 'budget' ? 'Budget Overview' : 'Net Worth Overview'}
            </Typography>
            <Box height={400}>
              <ResponsiveContainer width="100%" height="100%">
                {dashboardView === 'budget' ? (
                  <BarChart data={summary.budgetOverview}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="budgeted" name="Budgeted" fill="#8884d8" />
                    <Bar dataKey="spent" name="Spent" fill="#82ca9d" />
                  </BarChart>
                ) : (
                  <LineChart
                    data={netWorthHistory.map(nw => ({
                      name: `${new Date(nw.year, nw.month - 1).toLocaleString('default', { month: 'short', year: '2-digit' })}`,
                      netWorth: nw.assets - nw.liabilities,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={v =>
                        `£${Number(v).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="netWorth"
                      stroke="#1976d2"
                      strokeWidth={3}
                      dot={true}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </Box>
          </Paper>
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
    </Box>
  );
};

export default Dashboard;
