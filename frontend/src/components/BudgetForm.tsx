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

import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Box, MenuItem } from '@mui/material';
import api from '../api/financeApi';
import { Category } from '../types/category';

interface BudgetFormProps {
  onBudgetAdded?: () => void; // Callback function when budget is successfully added
}

export default function BudgetForm({ onBudgetAdded }: BudgetFormProps) {
  // Form state management
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>(Category.OTHER);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      // Get current date and format it as YYYY-MM-DD
      const today = new Date();
      const budget = {
        amount: Number(amount),
        category: category,
        date: today.toISOString().split('T')[0], // Format: YYYY-MM-DD
      };

      // Submit budget data to API
      await api.post('/budget', budget);

      // Clear form fields after successful submission
      setAmount('');
      setCategory(Category.OTHER);

      // Notify parent component if callback provided
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
