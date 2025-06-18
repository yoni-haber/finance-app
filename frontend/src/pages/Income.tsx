import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import IncomeForm from '../components/IncomeForm';
import IncomeList from '../components/IncomeList';
import { useDate } from '../context/DateContext';

const Income = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { year, month } = useDate();

  const handleIncomeAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="text.primary">
          Income Management
        </Typography>
        <IncomeForm onIncomeAdded={handleIncomeAdded} year={year} month={month} />
        <IncomeList refreshTrigger={refreshKey} year={year} month={month} />
      </Box>
    </Container>
  );
};

export default Income;
