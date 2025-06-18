/**
 * IncomeList Component
 *
 * This component displays a list of income entries with the following features:
 * - Fetches and displays income entries for the current month
 * - Shows total income for the month
 * - Allows editing of income entries through a dialog
 * - Allows deletion of income entries
 * - Handles loading states and error messages
 *
 * Component Structure:
 * 1. State Management:
 *    - incomes: Array of income entries
 *    - totalIncome: Total income amount
 *    - loading: Loading state indicator
 *    - error: Error state for error handling
 *    - editDialogOpen: Controls edit dialog visibility
 *    - editingIncome: Currently edited income entry
 *    - editFormData: Form data for editing
 *
 * 2. Main Functions:
 *    - fetchIncomes: Fetches income data from API
 *    - handleDelete: Handles income deletion
 *    - handleEdit: Opens edit dialog
 *    - handleEditDialogClose: Closes edit dialog
 *    - handleEditSubmit: Handles form submission
 *
 * 3. UI Components:
 *    - List of income entries
 *    - Edit dialog with form
 *    - Loading spinner
 *    - Error message
 *    - Total income display
 */

import { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../api/financeApi';
import type { Income } from '../types/finance';

interface IncomeListProps {
  refreshTrigger?: number;
  year: number;
  month: number;
  onIncomeChange?: () => void;
}

export default function IncomeList({
  refreshTrigger = 0,
  year,
  month,
  onIncomeChange,
}: IncomeListProps) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [totalIncome, setTotalIncome] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editFormData, setEditFormData] = useState({
    date: '',
    description: '',
    amount: '',
  });

  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

  const fetchIncomes = async () => {
    setLoading(true);
    setError(null);
    try {
      const [incomesRes, totalRes] = await Promise.all([
        api.get(`/income?year=${year}&month=${month + 1}`),
        api.get(`/income/total?year=${year}&month=${month + 1}`),
      ]);
      setIncomes(incomesRes.data);
      setTotalIncome(totalRes.data);
    } catch (error) {
      console.error('Error fetching incomes:', error);
      setError('Failed to load incomes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, [refreshTrigger, year, month]);

  const handleDelete = async (id: number | undefined) => {
    try {
      await api.delete(`/income/${id}`);
      await fetchIncomes();
      if (onIncomeChange) onIncomeChange();
    } catch (error) {
      console.error('Error deleting income:', error);
      setError('Failed to delete income. Please try again.');
    }
  };

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    setEditFormData({
      date: income.date,
      description: income.description,
      amount: income.amount.toString(),
    });
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditingIncome(null);
    setEditFormData({
      date: '',
      description: '',
      amount: '',
    });
  };

  const handleEditSubmit = async () => {
    if (!editingIncome) return;

    try {
      const updatedIncome = {
        ...editingIncome,
        date: editFormData.date,
        description: editFormData.description,
        amount: parseFloat(editFormData.amount),
      };

      await api.put(`/income/${editingIncome.id}`, updatedIncome);
      await fetchIncomes();
      if (onIncomeChange) onIncomeChange();
      handleEditDialogClose();
    } catch (error) {
      console.error('Error updating income:', error);
      setError('Failed to update income. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          {`Income in ${monthName}`}
        </Typography>
        <List>
          {incomes.map(income => (
            <ListItem
              key={income.id}
              secondaryAction={
                <Box>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(income)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => handleDelete(income.id)}
                  >
                    Delete
                  </Button>
                </Box>
              }
            >
              <ListItemText
                primary={`£${income.amount.toFixed(2)} - ${income.description}`}
                secondary={income.date}
              />
            </ListItem>
          ))}
        </List>
        {totalIncome !== null && (
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Typography variant="subtitle1">Total: £{totalIncome.toFixed(2)}</Typography>
          </Box>
        )}
      </Paper>

      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Income</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Date"
              type="date"
              value={editFormData.date}
              onChange={e => setEditFormData({ ...editFormData, date: e.target.value })}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Description"
              value={editFormData.description}
              onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
              required
            />
            <TextField
              label="Amount"
              type="number"
              value={editFormData.amount}
              onChange={e => setEditFormData({ ...editFormData, amount: e.target.value })}
              required
              inputProps={{ step: '0.01', min: '0' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
