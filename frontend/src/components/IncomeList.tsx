import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Button,
  ListItemText,
} from '@mui/material';
import GenericList from './common/GenericList';
import api from '../api/financeApi';
import type { Income } from '../types/finance';

/**
 * IncomeList Component
 *
 * Displays a list of income entries for a given month and year. Supports editing and deleting entries.
 *
 * Props:
 * - refreshTrigger: (optional) Number that triggers a refresh when changed.
 * - year: The selected year for which to display income.
 * - month: The selected month for which to display income.
 * - onIncomeChange: (optional) Function called after an income entry is changed.
 */

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
  // State for the list of incomes and total income
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [totalIncome, setTotalIncome] = useState<number | null>(null);
  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editFormData, setEditFormData] = useState({
    date: '',
    description: '',
    amount: '',
  });

  // Get the month name for display
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

  /**
   * Fetches income data and total from the API for the selected month/year.
   */
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
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to load incomes. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Refresh the list when refreshTrigger, year, or month changes
  useEffect(() => {
    fetchIncomes();
  }, [refreshTrigger, year, month]);

  /**
   * Deletes an income entry by ID and refreshes the list.
   */
  const handleDelete = async (id: number | undefined) => {
    try {
      await api.delete(`/income/${id}`);
      await fetchIncomes();
      if (onIncomeChange) onIncomeChange();
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to delete income. Please try again.'
      );
    }
  };

  /**
   * Opens the edit dialog for a specific income entry.
   */
  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    setEditFormData({
      date: income.date,
      description: income.description,
      amount: income.amount.toString(),
    });
    setEditDialogOpen(true);
  };

  /**
   * Closes the edit dialog and resets the form.
   */
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditingIncome(null);
    setEditFormData({
      date: '',
      description: '',
      amount: '',
    });
  };

  /**
   * Submits the edited income entry to the API and refreshes the list.
   */
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
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to update income. Please try again.'
      );
    }
  };

  return (
    <>
      <GenericList<Income>
        title={`Income in ${monthName}`}
        items={incomes}
        loading={loading}
        error={error}
        getKey={item => item.id ?? ''} // Use income ID as the unique key
        renderItem={income => (
          // Display the income's amount and description, with the date as secondary
          <ListItemText
            primary={`£${income.amount.toFixed(2)} - ${income.description}`}
            secondary={income.date}
          />
        )}
        onEdit={handleEdit}
        onDelete={income => handleDelete(income.id)}
        totalLabel="Total"
        totalValue={totalIncome !== null ? `£${totalIncome.toFixed(2)}` : undefined}
      />

      {/* Edit dialog for updating an income entry */}
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
