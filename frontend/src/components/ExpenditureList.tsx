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
import type { Expenditure } from '../types/finance';
import { Category } from '../types/category';

/**
 * ExpenditureList Component
 *
 * Displays a list of expenditure entries for a given month and year. Supports editing, deleting, filtering by category, and shows totals.
 *
 * Props:
 * - refreshTrigger: (optional) Number that triggers a refresh when changed.
 * - year: The selected year for which to display expenditures.
 * - month: The selected month for which to display expenditures.
 */

interface ExpenditureListProps {
  refreshTrigger?: number;
  year: number;
  month: number;
}

const ExpenditureList: React.FC<ExpenditureListProps> = ({ refreshTrigger, year, month }) => {
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [totalExpenditure, setTotalExpenditure] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingExpenditure, setEditingExpenditure] = useState<Expenditure | null>(null);
  const [editFormData, setEditFormData] = useState({
    date: '',
    description: '',
    amount: '',
    category: '',
  });
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

  const fetchExpenditures = async () => {
    setLoading(true);
    setError(null);
    try {
      const [expendituresRes, totalRes] = await Promise.all([
        api.get(`/expenditure?year=${year}&month=${month + 1}`),
        api.get(`/expenditure/total?year=${year}&month=${month + 1}`),
      ]);
      setExpenditures(expendituresRes.data);
      setTotalExpenditure(totalRes.data);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to load expenditures. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenditures();
  }, [refreshTrigger, year, month]);

  const handleDelete = async (id: number | undefined) => {
    try {
      await api.delete(`/expenditure/${id}`);
      await fetchExpenditures();
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to delete expenditure. Please try again.'
      );
    }
  };

  const handleEdit = (expenditure: Expenditure) => {
    setEditingExpenditure(expenditure);
    setEditFormData({
      date: expenditure.date,
      description: expenditure.description,
      amount: expenditure.amount.toString(),
      category: expenditure.category,
    });
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditingExpenditure(null);
    setEditFormData({
      date: '',
      description: '',
      amount: '',
      category: '',
    });
  };

  const handleEditSubmit = async () => {
    if (!editingExpenditure) return;
    try {
      const updatedExpenditure = {
        ...editingExpenditure,
        date: editFormData.date,
        description: editFormData.description,
        amount: parseFloat(editFormData.amount),
        category: editFormData.category,
      };
      await api.put(`/expenditure/${editingExpenditure.id}`, updatedExpenditure);
      await fetchExpenditures();
      handleEditDialogClose();
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to update expenditure. Please try again.'
      );
    }
  };

  // Filtered expenditures based on selected category
  const filteredExpenditures =
    filterCategory === 'ALL'
      ? expenditures
      : expenditures.filter(e => e.category === filterCategory);

  // Calculate total for filtered expenditures
  const filteredTotal = filteredExpenditures.reduce((sum, e) => sum + e.amount, 0);

  return (
    <>
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <span>Filter by Category:</span>
        <TextField
          select
          size="small"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="ALL">All</MenuItem>
          {Object.values(Category).map(cat => (
            <MenuItem key={cat} value={cat}>
              {cat.charAt(0) + cat.slice(1).toLowerCase()}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <GenericList<Expenditure>
        title={`Expenses in ${monthName}`}
        items={filteredExpenditures}
        loading={loading}
        error={error}
        getKey={item => item.id ?? ''}
        renderItem={expenditure => (
          <ListItemText
            primary={`£${expenditure.amount.toFixed(2)} - ${expenditure.description}`}
            secondary={`${expenditure.category}, ${expenditure.date}`}
          />
        )}
        onEdit={handleEdit}
        onDelete={expenditure => handleDelete(expenditure.id)}
        totalLabel="Total"
        totalValue={`£${(filterCategory === 'ALL' ? totalExpenditure : filteredTotal)?.toFixed(2)}`}
      />

      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Expense</DialogTitle>
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

export default ExpenditureList;
