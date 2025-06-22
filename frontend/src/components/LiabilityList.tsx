import React from 'react';
import GenericList from './common/GenericList';
import { ListItemText } from '@mui/material';
import type { Liability } from '../types/finance';

/**
 * LiabilityList Component
 *
 * Displays a list of liability entries, with support for editing and deleting each liability.
 *
 * Props:
 * - liabilities: Array of liability objects to display.
 * - loading: Whether the list is loading.
 * - error: Error message to display, if any.
 * - onDelete: Function to call when a liability is deleted.
 * - onEdit: Function to call when a liability is edited (optional).
 * - total: The total value of all liabilities.
 * - currencyFormatter: Formatter for displaying currency values.
 */

interface LiabilityListProps {
  liabilities: Liability[];
  loading: boolean;
  error: string | null;
  onDelete: (id: number | undefined) => void;
  onEdit?: (liability: Liability) => void;
  total: number;
  currencyFormatter: Intl.NumberFormat;
}

/**
 * Renders a list of liabilities using the GenericList component.
 * Each liability shows its amount and comment, and supports edit/delete actions.
 */
const LiabilityList: React.FC<LiabilityListProps> = ({
  liabilities,
  loading,
  error,
  onDelete,
  onEdit,
  total,
  currencyFormatter,
}) => (
  <GenericList<Liability>
    title="Liabilities"
    items={liabilities}
    loading={loading}
    error={error}
    getKey={item => item.id ?? ''} // Use liability ID as the unique key
    renderItem={liability => (
      // Display the liability's amount and comment
      <ListItemText
        primary={`${currencyFormatter.format(liability.amount)} - ${liability.comment}`}
      />
    )}
    onEdit={onEdit} // Show edit button if onEdit is provided
    onDelete={liability => onDelete(liability.id)} // Show delete button
    totalLabel="Total Liabilities"
    totalValue={currencyFormatter.format(total)}
    paper={false}
  />
);

export default LiabilityList;
