/**
 * BudgetTracking Component
 *
 * Displays a summary of budget usage for the current month, including:
 * - Category-wise budget and spending
 * - Progress bars for utilization
 * - Loading and error states
 *
 * Props:
 *   - refreshKey (optional): triggers data reload when changed
 */

import { useState, useEffect } from 'react';
import { Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import type { BudgetTrackingDTO } from '../types/finance';

interface BudgetTrackingProps {
  refreshKey?: number;
}

const BudgetTracking = ({ refreshKey = 0 }: BudgetTrackingProps) => {
  // State: budget tracking data, loading, and error
  const [trackingData, setTrackingData] = useState<BudgetTrackingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch budget tracking data for the current month from the API.
   * Called on mount and when refreshKey changes.
   */
  const fetchTrackingData = async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const response = await axios.get<BudgetTrackingDTO[]>('/api/budget-tracking', {
        params: {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
        },
      });
      console.log('Received tracking data:', response.data); // Debug log
      setTrackingData(response.data);
    } catch (error) {
      console.error('Error fetching budget tracking data:', error);
      setError('Failed to load budget tracking data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and when refreshKey changes
  useEffect(() => {
    fetchTrackingData();
  }, [refreshKey]);

  // Show loading spinner while fetching
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // Show error message if fetch fails
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // Show message if no data
  if (trackingData.length === 0) {
    return (
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Budget Tracking
        </Typography>
        <Typography color="text.secondary">
          No budget tracking data available for this month.
        </Typography>
      </Paper>
    );
  }

  /**
   * Format a currency string to two decimals, fallback to 0.00 if invalid.
   */
  const formatAmount = (amount: string) => {
    try {
      const num = parseFloat(amount);
      if (isNaN(num)) {
        console.warn('Invalid amount:', amount);
        return '0.00';
      }
      return num.toFixed(2);
    } catch (error) {
      console.error('Error formatting amount:', error);
      return '0.00';
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Budget Tracking
      </Typography>
      {/* Render each category's budget tracking info */}
      {trackingData.map(tracking => (
        <Box key={tracking.category} sx={{ mb: 2 }}>
          {/* Category name */}
          <Typography variant="subtitle1">{tracking.category}</Typography>

          {/* Budget and spent amounts */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Budget: £{formatAmount(tracking.budget)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Spent: £{formatAmount(tracking.spent)}
            </Typography>
          </Box>

          {/* Progress bar for utilization */}
          <Box
            sx={{
              width: '100%',
              height: 8,
              bgcolor: 'grey.200',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            {/* Bar color is red if over budget, blue otherwise */}
            <Box
              sx={{
                width: `${tracking.percentageUsed}%`,
                height: '100%',
                bgcolor: tracking.percentageUsed > 100 ? 'error.main' : 'primary.main',
                transition: 'width 0.3s ease-in-out',
              }}
            />
          </Box>

          {/* Percentage used */}
          <Typography variant="caption" color="text.secondary">
            {tracking.percentageUsed.toFixed(1)}% used
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

export default BudgetTracking;
