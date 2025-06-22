import React from 'react';
import { Box, TextField, Button, Typography, MenuItem, Paper } from '@mui/material';

/**
 * GenericForm Component
 *
 * A reusable form for any entity (income, asset, etc.).
 *
 * Props:
 *   - fields: array of field configs (name, label, type, value, onChange, etc.)
 *   - onSubmit: form submit handler
 *   - loading: disables submit button and shows loading text
 *   - error: error message to display
 *   - title: optional form title
 *   - submitLabel: text for submit button
 *   - paper: if true, wraps form in a Paper component
 */

export type FieldType = 'text' | 'number' | 'date' | 'select';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  options?: { value: string | number; label: string }[]; // for select
  inputProps?: Record<string, any>;
  size?: 'small' | 'medium';
}

export interface GenericFormProps {
  fields: FieldConfig[];
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  error?: string | null;
  title?: string;
  submitLabel?: string;
  paper?: boolean;
}

/**
 * GenericForm Component
 *
 * A reusable form for any entity (income, asset, etc.).
 *
 * Props:
 *   - fields: array of field configs (name, label, type, value, onChange, etc.)
 *   - onSubmit: form submit handler
 *   - loading: disables submit button and shows loading text
 *   - error: error message to display
 *   - title: optional form title
 *   - submitLabel: text for submit button
 *   - paper: if true, wraps form in a Paper component
 */
const GenericForm: React.FC<GenericFormProps> = ({
  fields,
  onSubmit,
  loading = false,
  error = null,
  title,
  submitLabel = 'Submit',
  paper = false,
}) => {
  // Render the form fields and submit button
  const content = (
    <form onSubmit={onSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Optional form title */}
        {title && (
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        )}
        {/* Render each field as a TextField or Select */}
        {fields.map(field => (
          <TextField
            key={field.name}
            label={field.label}
            type={field.type === 'select' ? undefined : field.type}
            value={field.value}
            onChange={e => field.onChange(e.target.value)}
            required={field.required}
            select={field.type === 'select'}
            inputProps={field.inputProps}
            size={field.size || 'medium'}
            InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
          >
            {/* Render options for select fields */}
            {field.type === 'select' && field.options
              ? field.options.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))
              : null}
          </TextField>
        ))}
        {/* Show error message if present */}
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        {/* Submit button */}
        <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2 }}>
          {loading ? 'Submitting...' : submitLabel}
        </Button>
      </Box>
    </form>
  );
  // Optionally wrap in Paper for styling
  return paper ? <Paper sx={{ p: 3, mt: 2 }}>{content}</Paper> : content;
};

export default GenericForm;
