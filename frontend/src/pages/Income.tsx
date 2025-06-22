import { useState } from 'react';
import { useDate } from '../context/DateContext';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import IncomeForm from '../components/IncomeForm';
import IncomeList from '../components/IncomeList';

const Income = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { year, month } = useDate();

  const handleIncomeAdded = () => setRefreshKey(prev => prev + 1);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="text.primary">
          Income Management
        </Typography>
        <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
          <Typography variant="h6" gutterBottom>
            Add Income
          </Typography>
          <IncomeForm onIncomeAdded={handleIncomeAdded} year={year} month={month} />
        </Paper>
        <Paper sx={{ p: 3 }} elevation={2}>
          <Typography variant="h6" gutterBottom>
            Income History
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <IncomeList refreshTrigger={refreshKey} year={year} month={month} />
        </Paper>
      </Box>
    </Container>
  );
};

export default Income;
