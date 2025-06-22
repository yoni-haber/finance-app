import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
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
import GenericList from '../components/common/GenericList';
import AssetList from '../components/AssetList';
import LiabilityList from '../components/LiabilityList';

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

  // Edit state for assets
  const [editAssetDialogOpen, setEditAssetDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [editAssetFormData, setEditAssetFormData] = useState({ amount: '', comment: '' });
  // Edit state for liabilities
  const [editLiabilityDialogOpen, setEditLiabilityDialogOpen] = useState(false);
  const [editingLiability, setEditingLiability] = useState<Liability | null>(null);
  const [editLiabilityFormData, setEditLiabilityFormData] = useState({ amount: '', comment: '' });

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

  // Asset edit handlers
  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setEditAssetFormData({ amount: asset.amount.toString(), comment: asset.comment });
    setEditAssetDialogOpen(true);
  };
  const handleEditAssetDialogClose = () => {
    setEditAssetDialogOpen(false);
    setEditingAsset(null);
    setEditAssetFormData({ amount: '', comment: '' });
  };
  const handleEditAssetSubmit = async () => {
    if (!editingAsset) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const updatedAsset = {
        ...editingAsset,
        amount: parseFloat(editAssetFormData.amount),
        comment: editAssetFormData.comment,
      };
      await saveAsset({ ...updatedAsset, year, month: month + 1 });
      const res = await getAssets(year, month + 1);
      setAssets(res.data || []);
      setSuccess('Asset updated successfully!');
      handleEditAssetDialogClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to update asset.');
    } finally {
      setLoading(false);
    }
  };

  // Liability edit handlers
  const handleEditLiability = (liability: Liability) => {
    setEditingLiability(liability);
    setEditLiabilityFormData({ amount: liability.amount.toString(), comment: liability.comment });
    setEditLiabilityDialogOpen(true);
  };
  const handleEditLiabilityDialogClose = () => {
    setEditLiabilityDialogOpen(false);
    setEditingLiability(null);
    setEditLiabilityFormData({ amount: '', comment: '' });
  };
  const handleEditLiabilitySubmit = async () => {
    if (!editingLiability) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const updatedLiability = {
        ...editingLiability,
        amount: parseFloat(editLiabilityFormData.amount),
        comment: editLiabilityFormData.comment,
      };
      await saveLiability({ ...updatedLiability, year, month: month + 1 });
      const res = await getLiabilities(year, month + 1);
      setLiabilities(res.data || []);
      setSuccess('Liability updated successfully!');
      handleEditLiabilityDialogClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to update liability.');
    } finally {
      setLoading(false);
    }
  };

  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom color="text.primary">
          Net Worth in {monthName} {year}
        </Typography>

        {/* Forms Row */}
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} mb={4}>
          <Paper sx={{ p: 3, flex: 1 }} elevation={2}>
            <Typography variant="h6" gutterBottom>
              Add Asset
            </Typography>
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
          </Paper>
          <Paper sx={{ p: 3, flex: 1 }} elevation={2}>
            <Typography variant="h6" gutterBottom>
              Add Liability
            </Typography>
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
                  setError(e?.response?.data?.message || e?.message || 'Failed to add liability.');
                } finally {
                  setLoading(false);
                }
              }}
              loading={loading}
              error={error}
            />
          </Paper>
        </Box>

        {/* Lists Row */}
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} mb={4}>
          <Paper sx={{ p: 3, flex: 1 }} elevation={2}>
            <AssetList
              assets={assets}
              loading={loading}
              error={error}
              onDelete={handleDeleteAsset}
              onEdit={handleEditAsset}
              total={totalAssets}
              currencyFormatter={currencyFormatter}
            />
          </Paper>
          <Paper sx={{ p: 3, flex: 1 }} elevation={2}>
            <LiabilityList
              liabilities={liabilities}
              loading={loading}
              error={error}
              onDelete={handleDeleteLiability}
              onEdit={handleEditLiability}
              total={totalLiabilities}
              currencyFormatter={currencyFormatter}
            />
          </Paper>
        </Box>

        {/* Net Worth Summary and Messages */}
        <Paper sx={{ p: 3, mt: 2 }} elevation={2}>
          {!netWorthExists && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              No net worth record for this month yet. Add an asset or liability to get started.
            </Typography>
          )}
          <Typography variant="h6">Net Worth: {currencyFormatter.format(liveNetWorth)}</Typography>
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success.main">{success}</Typography>}
        </Paper>

        {/* Asset Edit Dialog */}
        <Dialog open={editAssetDialogOpen} onClose={handleEditAssetDialogClose}>
          <DialogTitle>Edit Asset</DialogTitle>
          <DialogContent>
            <TextField
              label="Amount"
              type="number"
              value={editAssetFormData.amount}
              onChange={e => setEditAssetFormData({ ...editAssetFormData, amount: e.target.value })}
              required
              inputProps={{ step: '0.01', min: '0' }}
              sx={{ mb: 2, mt: 1 }}
              fullWidth
            />
            <TextField
              label="Comment"
              value={editAssetFormData.comment}
              onChange={e =>
                setEditAssetFormData({ ...editAssetFormData, comment: e.target.value })
              }
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditAssetDialogClose}>Cancel</Button>
            <Button onClick={handleEditAssetSubmit} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Liability Edit Dialog */}
        <Dialog open={editLiabilityDialogOpen} onClose={handleEditLiabilityDialogClose}>
          <DialogTitle>Edit Liability</DialogTitle>
          <DialogContent>
            <TextField
              label="Amount"
              type="number"
              value={editLiabilityFormData.amount}
              onChange={e =>
                setEditLiabilityFormData({ ...editLiabilityFormData, amount: e.target.value })
              }
              required
              inputProps={{ step: '0.01', min: '0' }}
              sx={{ mb: 2, mt: 1 }}
              fullWidth
            />
            <TextField
              label="Comment"
              value={editLiabilityFormData.comment}
              onChange={e =>
                setEditLiabilityFormData({ ...editLiabilityFormData, comment: e.target.value })
              }
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditLiabilityDialogClose}>Cancel</Button>
            <Button onClick={handleEditLiabilitySubmit} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default NetWorthPage;
