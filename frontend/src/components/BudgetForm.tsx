/**
 * BudgetForm Component
 *
 * This component provides a form for adding new budget entries with the following features:
 * - Amount input with validation
 * - Category selection from predefined options
 * - Error handling
 * - Loading state
 * - Form submission to API
 * - Automatic date assignment (current date)
 *
 * Component Structure:
 * 1. State Management:
 *    - amount: Budget amount
 *    - category: Selected category from enum
 *    - error: Error state for error handling
 *    - loading: Loading state indicator
 *    - date: Budget date
 *
 * 2. Main Functions:
 *    - handleSubmit: Handles form submission and API call
 *
 * 3. UI Components:
 *    - Amount input with validation
 *    - Category dropdown
 *    - Submit button with loading state
 *    - Error message display
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, TextField, Button, Box, MenuItem } from '@mui/material';
import api from '../api/financeApi';
import { Category } from '../types/category';

interface BudgetFormProps {
  onBudgetAdded: () => void;
  year: number;
  month: number;
}

export default function BudgetForm({ onBudgetAdded, year, month }: BudgetFormProps) {
  // Form state management
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>(Category.OTHER);
  const [date, setDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Set default date when year/month changes, but only if the user hasn't entered a date
  const didSetDefault = useRef(false);
  useEffect(() => {
    if (!date && !didSetDefault.current) {
      setDate(`${year}-${String(month + 1).padStart(2, '0')}-01`);
      didSetDefault.current = true;
    }
    // Reset flag if year/month changes and date is cleared
    if (!date) didSetDefault.current = false;
  }, [year, month]);

  /**
   * Handle form submission
   * - Prevents default form behavior
   * - Validates and submits data to API
   * - Clears form on success
   * - Handles errors
   * - Notifies parent component on success
   * - Automatically sets current date
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Use the selected year/month for the budget date
      const budget = {
        amount: Number(amount),
        category: category,
        date: date,
      };
      await api.post('/budget', budget);
      setAmount('');
      setCategory(Category.OTHER);
      if (onBudgetAdded) {
        onBudgetAdded();
      }
    } catch (error) {
      console.error('Error adding budget:', error);
      setError('Failed to add budget. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add Budget
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Amount input field with validation */}
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            inputProps={{ step: '0.01', min: '0' }}
          />

          {/* Category selection dropdown */}
          <TextField
            select
            label="Category"
            value={category}
            onChange={e => setCategory(e.target.value as Category)}
            required
          >
            {Object.values(Category).map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          {/* Date input field */}
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />

          {/* Error message display */}
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          {/* Submit button with loading state */}
          <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2 }}>
            {loading ? 'Adding...' : 'Add Budget'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
