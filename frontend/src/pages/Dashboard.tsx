import { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import api from '../api/financeApi';
import IncomeList from '../components/IncomeList';

const Dashboard = () => {
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTotals = async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;

      const [incomeRes, expensesRes] = await Promise.all([
        api.get(`/income/total?year=${year}&month=${month}`),
        api.get(`/expenditure/total?year=${year}&month=${month}`),
      ]);

      setTotalIncome(incomeRes.data);
      setTotalExpenses(expensesRes.data);
    } catch (error) {
      console.error('Error fetching totals:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotals();
  }, []);

  const handleIncomeChange = () => {
    fetchTotals();
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="text.primary">
          Dashboard
        </Typography>
        <Typography variant="h6" gutterBottom color="text.primary">
          {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Total Income
              </Typography>
              <Typography variant="h4">£{totalIncome.toFixed(2)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Total Expenses
              </Typography>
              <Typography variant="h4">£{totalExpenses.toFixed(2)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Net Balance
              </Typography>
              <Typography
                variant="h4"
                color={totalIncome - totalExpenses >= 0 ? 'success.main' : 'error.main'}
              >
                £{(totalIncome - totalExpenses).toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <IncomeList onIncomeChange={handleIncomeChange} year={0} month={0} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
