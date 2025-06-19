import { useState } from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import ExpenditureForm from '../components/ExpenditureForm';
import ExpenditureList from '../components/ExpenditureList';
import { useDate } from '../context/DateContext';

const Expenses = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { year, month } = useDate();

  const handleExpenditureAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="text.primary">
          Expenses Management
        </Typography>
        <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
          <Typography variant="h6" gutterBottom>
            Add Expense
          </Typography>
          <ExpenditureForm onExpenditureAdded={handleExpenditureAdded} year={year} month={month} />
        </Paper>
        <Paper sx={{ p: 3 }} elevation={2}>
          <Typography variant="h6" gutterBottom>
            Expenses History
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <ExpenditureList refreshTrigger={refreshKey} year={year} month={month} />
        </Paper>
      </Box>
    </Container>
  );
};

export default Expenses;
