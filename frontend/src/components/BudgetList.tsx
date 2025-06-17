/**
 * BudgetList Component
 *
 * This component displays a list of budget entries with the following features:
 * - Fetches and displays budget entries for the current month
 * - Shows total budget amount
 * - Allows editing of budget entries through a dialog
 * - Allows deletion of budget entries
 * - Handles loading states and error messages
 *
 * Component Structure:
 * 1. State Management:
 *    - budgets: Array of budget entries
 *    - loading: Loading state indicator
 *    - error: Error state for error handling
 *    - editDialogOpen: Controls edit dialog visibility
 *    - editingBudget: Currently edited budget entry
 *    - editFormData: Form data for editing (amount and category)
 *
 * 2. Main Functions:
 *    - fetchBudgets: Fetches budget data from API
 *    - handleDelete: Handles budget deletion
 *    - handleEdit: Opens edit dialog
 *    - handleEditDialogClose: Closes edit dialog
 *    - handleEditSubmit: Handles form submission
 *
 * 3. UI Components:
 *    - List of budget entries
 *    - Edit dialog with form
 *    - Loading spinner
 *    - Error message
 *    - Total budget display
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
  MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../api/financeApi';
import type { Budget } from '../types/finance';
import { Category } from '../types/category';

interface BudgetListProps {
  refreshTrigger?: number;
}

export default function BudgetList({ refreshTrigger = 0 }: BudgetListProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editFormData, setEditFormData] = useState({
    amount: '',
    category: '',
  });

  const fetchBudgets = async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const response = await api.get(
        `/budget?year=${today.getFullYear()}&month=${today.getMonth() + 1}`
      );
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setError('Failed to load budgets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [refreshTrigger]);

  const handleDelete = async (id: number | undefined) => {
    try {
      await api.delete(`/budget/${id}`);
      await fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
      setError('Failed to delete budget. Please try again.');
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setEditFormData({
      amount: budget.amount.toString(),
      category: budget.category,
    });
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditingBudget(null);
    setEditFormData({
      amount: '',
      category: '',
    });
  };

  const handleEditSubmit = async () => {
    if (!editingBudget) return;

    try {
      const updatedBudget = {
        ...editingBudget,
        amount: parseFloat(editFormData.amount),
        category: editFormData.category,
      };

      await api.put(`/budget/${editingBudget.id}`, updatedBudget);
      await fetchBudgets();
      handleEditDialogClose();
    } catch (error) {
      console.error('Error updating budget:', error);
      setError('Failed to update budget. Please try again.');
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

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);

  return (
    <>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Budgets This Month
        </Typography>
        <List>
          {budgets.map(budget => (
            <ListItem
              key={budget.id}
              secondaryAction={
                <Box>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(budget)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => handleDelete(budget.id)}
                  >
                    Delete
                  </Button>
                </Box>
              }
            >
              <ListItemText primary={budget.category} secondary={`£${budget.amount.toFixed(2)}`} />
            </ListItem>
          ))}
        </List>
        {budgets.length > 0 && (
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Typography variant="subtitle1">Total: £{totalBudget.toFixed(2)}</Typography>
          </Box>
        )}
      </Paper>

      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Budget</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Amount"
              type="number"
              value={editFormData.amount}
              onChange={e => setEditFormData({ ...editFormData, amount: e.target.value })}
              required
              inputProps={{ step: '0.01', min: '0' }}
            />
            <TextField
              select
              label="Category"
              value={editFormData.category}
              onChange={e => setEditFormData({ ...editFormData, category: e.target.value })}
              required
            >
              {Object.values(Category).map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
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
