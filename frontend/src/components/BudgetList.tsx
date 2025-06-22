import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Button,
  MenuItem,
  ListItemText,
} from '@mui/material';
import GenericList from './common/GenericList';
import api from '../api/financeApi';
import type { Budget } from '../types/finance';
import { Category } from '../types/category';

/**
 * BudgetList Component
 *
 * Displays a list of budget entries for a given month and year. Supports editing and deleting entries.
 *
 * Props:
 * - refreshTrigger: (optional) Number that triggers a refresh when changed.
 * - year: The selected year for which to display budgets.
 * - month: The selected month for which to display budgets.
 */

interface BudgetListProps {
  refreshTrigger?: number;
  year: number;
  month: number;
}

const BudgetList: React.FC<BudgetListProps> = ({ refreshTrigger, year, month }) => {
  // State for the list of budgets
  const [budgets, setBudgets] = useState<Budget[]>([]);
  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editFormData, setEditFormData] = useState({
    amount: '',
    category: '',
  });

  /**
   * Fetches budget data from the API for the selected month/year.
   */
  const fetchBudgets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/budget?year=${year}&month=${month + 1}`);
      setBudgets(response.data);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to load budgets. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Refresh the list when refreshTrigger, year, or month changes
  useEffect(() => {
    fetchBudgets();
  }, [refreshTrigger, year, month]);

  /**
   * Deletes a budget entry by ID and refreshes the list.
   */
  const handleDelete = async (id: number | undefined) => {
    try {
      await api.delete(`/budget/${id}`);
      await fetchBudgets();
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to delete budget. Please try again.'
      );
    }
  };

  /**
   * Opens the edit dialog for a specific budget entry.
   */
  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setEditFormData({
      amount: budget.amount.toString(),
      category: budget.category,
    });
    setEditDialogOpen(true);
  };

  /**
   * Closes the edit dialog and resets the form.
   */
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditingBudget(null);
    setEditFormData({
      amount: '',
      category: '',
    });
  };

  /**
   * Submits the edited budget entry to the API and refreshes the list.
   */
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
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to update budget. Please try again.'
      );
    }
  };

  // Calculate the total budget for the month
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  // Get the month name for display
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

  return (
    <>
      <GenericList<Budget>
        title={`Budgets in ${monthName}`}
        items={budgets}
        loading={loading}
        error={error}
        getKey={item => item.id ?? ''} // Use budget ID as the unique key
        renderItem={budget => (
          // Display the budget's category and amount
          <ListItemText primary={budget.category} secondary={`£${budget.amount.toFixed(2)}`} />
        )}
        onEdit={handleEdit}
        onDelete={budget => handleDelete(budget.id)}
        totalLabel="Total"
        totalValue={`£${totalBudget.toFixed(2)}`}
      />

      {/* Edit dialog for updating a budget entry */}
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
};

export default BudgetList;
