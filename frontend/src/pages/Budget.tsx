import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import BudgetForm from '../components/BudgetForm';
import BudgetList from '../components/BudgetList';

const Budget = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBudgetAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="text.primary">
          Budget Management
        </Typography>
        <BudgetForm onBudgetAdded={handleBudgetAdded} />
        <BudgetList refreshTrigger={refreshKey} />
      </Box>
    </Container>
  );
};

export default Budget;
