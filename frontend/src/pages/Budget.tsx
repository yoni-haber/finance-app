import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
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
        <BudgetForm onBudgetAdded={handleBudgetAdded} year={year} month={month} />
        <BudgetList refreshTrigger={refreshKey} year={year} month={month} />
      </Box>
    </Container>
  );
};

export default Budget;
