import React from 'react';
import GenericList from './common/GenericList';
import { ListItemText } from '@mui/material';
import type { Asset } from '../types/finance';

/**
 * AssetList Component
 *
 * Displays a list of asset entries, with support for editing and deleting each asset.
 *
 * Props:
 * - assets: Array of asset objects to display.
 * - loading: Whether the list is loading.
 * - error: Error message to display, if any.
 * - onDelete: Function to call when an asset is deleted.
 * - onEdit: Function to call when an asset is edited (optional).
 * - total: The total value of all assets.
 * - currencyFormatter: Formatter for displaying currency values.
 */

interface AssetListProps {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  onDelete: (id: number | undefined) => void;
  onEdit?: (asset: Asset) => void;
  total: number;
  currencyFormatter: Intl.NumberFormat;
}

/**
 * Renders a list of assets using the GenericList component.
 * Each asset shows its amount and comment, and supports edit/delete actions.
 */
const AssetList: React.FC<AssetListProps> = ({
  assets,
  loading,
  error,
  onDelete,
  onEdit,
  total,
  currencyFormatter,
}) => (
  <GenericList<Asset>
    title="Assets"
    items={assets}
    loading={loading}
    error={error}
    getKey={item => item.id ?? ''} // Use asset ID as the unique key
    renderItem={asset => (
      // Display the asset's amount and comment
      <ListItemText primary={`${currencyFormatter.format(asset.amount)} - ${asset.comment}`} />
    )}
    onEdit={onEdit} // Show edit button if onEdit is provided
    onDelete={asset => onDelete(asset.id)} // Show delete button
    totalLabel="Total Assets"
    totalValue={currencyFormatter.format(total)}
    paper={false}
  />
);

export default AssetList;
