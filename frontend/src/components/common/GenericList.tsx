import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

/**
 * GenericList Component
 *
 * A reusable list for displaying any entity (income, asset, etc.).
 *
 * Props:
 *   - title: optional list title
 *   - items: array of items to display
 *   - loading: show spinner if true
 *   - error: error message to display
 *   - renderItem: function to render each item
 *   - onEdit: optional edit handler
 *   - onDelete: optional delete handler
 *   - getKey: function to get unique key for each item
 *   - totalLabel: label for total value (optional)
 *   - totalValue: value for total (optional)
 *   - paper: if true, wraps list in a Paper component
 *   - actions: custom actions for each item (overrides edit/delete)
 */

export interface GenericListProps<T> {
  title?: string;
  items: T[];
  loading?: boolean;
  error?: string | null;
  renderItem: (item: T) => React.ReactNode;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  getKey: (item: T) => React.Key;
  totalLabel?: string;
  totalValue?: string | number;
  paper?: boolean;
  actions?: (item: T) => React.ReactNode;
}

/**
 * GenericList Component
 *
 * A reusable list for displaying any entity (income, asset, etc.).
 *
 * Props:
 *   - title: optional list title
 *   - items: array of items to display
 *   - loading: show spinner if true
 *   - error: error message to display
 *   - renderItem: function to render each item
 *   - onEdit: optional edit handler
 *   - onDelete: optional delete handler
 *   - getKey: function to get unique key for each item
 *   - totalLabel: label for total value (optional)
 *   - totalValue: value for total (optional)
 *   - paper: if true, wraps list in a Paper component
 *   - actions: custom actions for each item (overrides edit/delete)
 */
function GenericList<T>({
  title,
  items,
  loading = false,
  error = null,
  renderItem,
  onEdit,
  onDelete,
  getKey,
  totalLabel,
  totalValue,
  paper = true,
  actions,
}: GenericListProps<T>) {
  // Render the list content (title, items, loading/error states, totals)
  const content = (
    <Box>
      {/* Optional list title */}
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      {/* Show loading spinner if loading */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        // Show error message if error
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          {/* Render each item in the list */}
          <List>
            {items.map(item => (
              <ListItem
                key={getKey(item)}
                secondaryAction={
                  actions ? (
                    actions(item)
                  ) : (
                    <Box>
                      {/* Edit and Delete buttons if handlers provided */}
                      {onEdit && (
                        <Button
                          startIcon={<EditIcon />}
                          onClick={() => onEdit(item)}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          startIcon={<DeleteIcon />}
                          color="error"
                          onClick={() => onDelete(item)}
                        >
                          Delete
                        </Button>
                      )}
                    </Box>
                  )
                }
              >
                {renderItem(item)}
              </ListItem>
            ))}
          </List>
          {/* Show total if provided */}
          {typeof totalValue !== 'undefined' && totalLabel && (
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Typography variant="subtitle1">
                {totalLabel}: {totalValue}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
  // Optionally wrap in Paper for styling
  return paper ? <Paper sx={{ p: 3, mt: 2 }}>{content}</Paper> : content;
}

export default GenericList;
