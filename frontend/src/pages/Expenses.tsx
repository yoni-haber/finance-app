import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
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
        <ExpenditureForm onExpenditureAdded={handleExpenditureAdded} year={year} month={month} />
        <ExpenditureList refreshTrigger={refreshKey} year={year} month={month} />
      </Box>
    </Container>
  );
};

export default Expenses;
