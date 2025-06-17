import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import ExpenditureForm from '../components/ExpenditureForm';
import ExpenditureList from '../components/ExpenditureList';

const Expenses = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExpenditureAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="text.primary">
          Expenses Management
        </Typography>
        <ExpenditureForm onExpenditureAdded={handleExpenditureAdded} />
        <ExpenditureList refreshTrigger={refreshKey} />
      </Box>
    </Container>
  );
};

export default Expenses;
