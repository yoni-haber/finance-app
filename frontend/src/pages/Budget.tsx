import { useState } from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import BudgetForm from '../components/BudgetForm';
import BudgetList from '../components/BudgetList';
import { useDate } from '../context/DateContext';

const Budget = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { year, month } = useDate();

  const handleBudgetAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="text.primary">
          Budget Management
        </Typography>
        <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
          <Typography variant="h6" gutterBottom>
            Set Budget
          </Typography>
          <BudgetForm onBudgetAdded={handleBudgetAdded} year={year} month={month} />
        </Paper>
        <Paper sx={{ p: 3 }} elevation={2}>
          <Typography variant="h6" gutterBottom>
            Budget History
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <BudgetList refreshTrigger={refreshKey} year={year} month={month} />
        </Paper>
      </Box>
    </Container>
  );
};

export default Budget;
