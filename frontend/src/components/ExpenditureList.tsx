/**
 * ExpenditureList Component
 *
 * This component displays a list of expenditure entries with the following features:
 * - Fetches and displays expenditure entries for the current month
 * - Shows total expenditure amount
 * - Allows editing of expenditure entries through a dialog
 * - Allows deletion of expenditure entries
 * - Handles loading states and error messages
 *
 * Component Structure:
 * 1. State Management:
 *    - expenditures: Array of expenditure entries
 *    - totalExpenditure: Total expenditure amount
 *    - loading: Loading state indicator
 *    - error: Error state for error handling
 *    - editDialogOpen: Controls edit dialog visibility
 *    - editingExpenditure: Currently edited expenditure entry
 *    - editFormData: Form data for editing (date, description, amount, category)
 *
 * 2. Main Functions:
 *    - fetchExpenditures: Fetches expenditure data from API
 *    - handleDelete: Handles expenditure deletion
 *    - handleEdit: Opens edit dialog
 *    - handleEditDialogClose: Closes edit dialog
 *    - handleEditSubmit: Handles form submission
 *
 * 3. UI Components:
 *    - List of expenditure entries
 *    - Edit dialog with form
 *    - Loading spinner
 *    - Error message
 *    - Total expenditure display
 */

import React, { useEffect, useState } from 'react';
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
import type { Expenditure } from '../types/finance';
import { Category } from '../types/category';

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
    } catch (error) {
      console.error('Error fetching expenditures:', error);
      setError('Failed to load expenditures. Please try again.');
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
    } catch (error) {
      console.error('Error deleting expenditure:', error);
      setError('Failed to delete expenditure. Please try again.');
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
    } catch (error) {
      console.error('Error updating expenditure:', error);
      setError('Failed to update expenditure. Please try again.');
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
          {`Expenses in ${monthName}`}
        </Typography>
        <List>
          {expenditures.map(expenditure => (
            <ListItem
              key={expenditure.id}
              secondaryAction={
                <Box>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(expenditure)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => handleDelete(expenditure.id)}
                  >
                    Delete
                  </Button>
                </Box>
              }
            >
              <ListItemText
                primary={`£${expenditure.amount.toFixed(2)} - ${expenditure.description}`}
                secondary={`${expenditure.category}, ${expenditure.date}`}
              />
            </ListItem>
          ))}
        </List>
        {totalExpenditure !== null && (
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Typography variant="subtitle1">Total: £{totalExpenditure.toFixed(2)}</Typography>
          </Box>
        )}
      </Paper>

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
