/**
 * IncomeForm Component
 *
 * This component provides a form for adding new income entries with the following features:
 * - Date selection
 * - Description input
 * - Amount input with validation
 * - Error handling
 * - Loading state
 * - Form submission to API
 *
 * Component Structure:
 * 1. State Management:
 *    - date: Selected date
 *    - description: Income description
 *    - amount: Income amount
 *    - error: Error state for error handling
 *    - loading: Loading state indicator
 *
 * 2. Main Functions:
 *    - handleSubmit: Handles form submission and API call
 *
 * 3. UI Components:
 *    - Date picker
 *    - Description text field
 *    - Amount input with validation
 *    - Submit button with loading state
 *    - Error message display
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';
import api from '../api/financeApi';

interface IncomeFormProps {
  onIncomeAdded: () => void;
  year: number;
  month: number;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ onIncomeAdded, year, month }) => {
  // Form state management
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
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
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Use the selected year/month if date is not provided
      let submitDate = date;
      if (!submitDate) {
        // Default to first day of selected month/year
        submitDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      }
      await api.post('/income', {
        date: submitDate,
        description,
        amount: parseFloat(amount),
      });
      setDate('');
      setDescription('');
      setAmount('');
      if (onIncomeAdded) {
        onIncomeAdded();
      }
    } catch (error) {
      console.error('Error adding income:', error);
      setError('Failed to add income. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add Income
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Date picker field */}
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
          />

          {/* Description input field */}
          <TextField
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />

          {/* Amount input field with validation */}
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            inputProps={{ step: '0.01', min: '0' }}
          />

          {/* Error message display */}
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          {/* Submit button with loading state */}
          <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2 }}>
            {loading ? 'Adding...' : 'Add Income'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default IncomeForm;
