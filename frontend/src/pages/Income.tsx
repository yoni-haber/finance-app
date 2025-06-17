import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import IncomeForm from '../components/IncomeForm';
import IncomeList from '../components/IncomeList';

const Income = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleIncomeAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="text.primary">
          Income Management
        </Typography>
        <IncomeForm onIncomeAdded={handleIncomeAdded} />
        <IncomeList refreshTrigger={refreshKey} />
      </Box>
    </Container>
  );
};

export default Income;
