import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

/**
 * Props for the LiabilityForm component.
 * @interface LiabilityFormProps
 * @property {function} onAdd - Callback function to handle form submission. Receives an object with `amount` and `comment`.
 * @property {boolean} [loading] - Optional flag to indicate if the form is in a loading state.
 * @property {string | null} [error] - Optional error message to display below the form.
 */
interface LiabilityFormProps {
  onAdd: (data: { amount: number; comment: string }) => void;
  loading?: boolean;
  error?: string | null;
}

/**
 * LiabilityForm component.
 * A form for adding liability data, including an amount and an optional comment.
 */
const LiabilityForm: React.FC<LiabilityFormProps> = ({ onAdd, loading = false, error = null }) => {
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');

  /**
   * Handles form submission.
   * Prevents page reload, validates the input, and calls the `onAdd` callback with the form data.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    onAdd({ amount: parseFloat(amount), comment });
    setAmount('');
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input fields for amount and comment */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          inputProps={{ min: 0, step: '0.01' }}
          size="small"
          required
        />
        <TextField
          label="Comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          size="small"
        />
        <Button type="submit" variant="contained" disabled={loading}>
          Add
        </Button>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
    </form>
  );
};

export default LiabilityForm;
