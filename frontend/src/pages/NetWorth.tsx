import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDate } from '../context/DateContext';
import {
  getAssets,
  saveAsset,
  deleteAsset,
  getLiabilities,
  saveLiability,
  deleteLiability,
  saveNetWorth,
  getNetWorth,
} from '../api/financeApi';
import type { Asset, Liability } from '../types/finance';
import AssetForm from '../components/AssetForm';
import LiabilityForm from '../components/LiabilityForm';

/**
 * NetWorthPage component.
 * Displays the net worth for a selected month, including assets and liabilities.
 * Allows users to add, delete, and view assets and liabilities, and calculates the net worth dynamically.
 */
const NetWorthPage: React.FC = () => {
  // Get the selected year and month from context
  const { year, month } = useDate();

  // State for assets and liabilities
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);

  // UI state for loading, error, and success messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Track if a net worth record exists for the month
  const [netWorthExists, setNetWorthExists] = useState(false);

  // Calculate totals
  const totalAssets = assets.reduce((sum, a) => sum + a.amount, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.amount, 0);

  // Format currency for display
  const currencyFormatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  });

  // Calculate live net worth
  const liveNetWorth = totalAssets - totalLiabilities;

  /**
   * Fetch assets and liabilities for the selected month.
   * Updates the state with the retrieved data.
   */
  useEffect(() => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    Promise.all([getAssets(year, month + 1), getLiabilities(year, month + 1)])
      .then(([assetsRes, liabilitiesRes]) => {
        setAssets(assetsRes.data || []);
        setLiabilities(liabilitiesRes.data || []);
      })
      .catch(() => {
        setAssets([]);
        setLiabilities([]);
      })
      .finally(() => setLoading(false));
  }, [year, month]);

  /**
   * Fetch and update net worth for the selected month.
   * Checks if a net worth record exists for the month.
   */
  useEffect(() => {
    getNetWorth(year, month + 1)
      .then(res => {
        if (
          res.data &&
          typeof res.data.assets === 'number' &&
          typeof res.data.liabilities === 'number'
        ) {
          setNetWorthExists(true);
        } else {
          setNetWorthExists(false);
        }
      })
      .catch(() => {
        setNetWorthExists(false);
      });
  }, [year, month, assets, liabilities]);

  /**
   * Auto-sync net worth to backend whenever assets or liabilities change.
   * Sends the calculated net worth to the backend.
   */
  useEffect(() => {
    if (assets.length === 0 && liabilities.length === 0) return;
    const syncNetWorth = async () => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        await saveNetWorth({
          year,
          month: month + 1,
          assets: totalAssets,
          liabilities: totalLiabilities,
        });
        setSuccess('Net worth updated!');
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Failed to update net worth.');
      } finally {
        setLoading(false);
      }
    };
    syncNetWorth();
  }, [totalAssets, totalLiabilities, year, month, assets.length, liabilities.length]);

  /**
   * Handles deletion of an asset.
   * Updates the state after the asset is deleted.
   * @param {number | undefined} id - The ID of the asset to delete.
   */
  const handleDeleteAsset = async (id: number | undefined) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await deleteAsset(id);
      const res = await getAssets(year, month + 1);
      setAssets(res.data || []);
      setSuccess('Asset deleted successfully!');
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to delete asset.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles deletion of a liability.
   * Updates the state after the liability is deleted.
   * @param {number | undefined} id - The ID of the liability to delete.
   */
  const handleDeleteLiability = async (id: number | undefined) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await deleteLiability(id);
      const res = await getLiabilities(year, month + 1);
      setLiabilities(res.data || []);
      setSuccess('Liability deleted successfully!');
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to delete liability.');
    } finally {
      setLoading(false);
    }
  };

  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom color="text.primary">
          Net Worth in {monthName} {year}
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          {/* Two columns: Assets and Liabilities */}
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
            {/* Assets Section */}
            <Box flex={1}>
              <Typography variant="h6">Assets</Typography>
              {/* AssetForm lets you add a new asset */}
              <AssetForm
                onAdd={async ({ amount, comment }) => {
                  setLoading(true);
                  setError(null);
                  setSuccess(null);
                  try {
                    await saveAsset({ year, month: month + 1, amount, comment });
                    const res = await getAssets(year, month + 1);
                    setAssets(res.data || []);
                    setSuccess('Asset added successfully!');
                  } catch (e: any) {
                    setError(e?.response?.data?.message || e?.message || 'Failed to add asset.');
                  } finally {
                    setLoading(false);
                  }
                }}
                loading={loading}
                error={error}
              />
              {/* List of assets */}
              <List dense>
                {assets.map(asset => (
                  <ListItem
                    key={asset.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteAsset(asset.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`${currencyFormatter.format(asset.amount)} - ${asset.comment}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Typography variant="subtitle1" sx={{ mt: 1, color: 'success.main' }}>
                Total Assets: {currencyFormatter.format(totalAssets)}
              </Typography>
            </Box>
            {/* Liabilities Section */}
            <Box flex={1}>
              <Typography variant="h6">Liabilities</Typography>
              {/* LiabilityForm lets you add a new liability */}
              <LiabilityForm
                onAdd={async ({ amount, comment }) => {
                  setLoading(true);
                  setError(null);
                  setSuccess(null);
                  try {
                    await saveLiability({ year, month: month + 1, amount, comment });
                    const res = await getLiabilities(year, month + 1);
                    setLiabilities(res.data || []);
                    setSuccess('Liability added successfully!');
                  } catch (e: any) {
                    setError(
                      e?.response?.data?.message || e?.message || 'Failed to add liability.'
                    );
                  } finally {
                    setLoading(false);
                  }
                }}
                loading={loading}
                error={error}
              />
              {/* List of liabilities */}
              <List dense>
                {liabilities.map(liability => (
                  <ListItem
                    key={liability.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteLiability(liability.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`${currencyFormatter.format(liability.amount)} - ${liability.comment}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Typography variant="subtitle1" sx={{ mt: 1, color: 'error.main' }}>
                Total Liabilities: {currencyFormatter.format(totalLiabilities)}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 3 }} />
          {/* Show a message if no net worth record exists yet */}
          {!netWorthExists && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              No net worth record for this month yet. Add an asset or liability to get started.
            </Typography>
          )}
          {/* Show the calculated net worth */}
          <Typography variant="h6">Net Worth: {currencyFormatter.format(liveNetWorth)}</Typography>
          {/* Show error or success messages */}
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success.main">{success}</Typography>}
        </Paper>
      </Box>
    </Container>
  );
};

export default NetWorthPage;
