/**
 * AssetForm Component
 *
 * A form for adding a new asset. Users can enter an amount and an optional comment.
 *
 * Props:
 * - onAdd: Function called when the form is submitted. Receives the new asset data.
 * - loading: (optional) Whether the form is in a loading state.
 * - error: (optional) Error message to display below the form.
 */
import React from 'react';
import GenericForm, { type FieldConfig } from './common/GenericForm';
import { useFormFields } from './common/useFormFields';

/**
 * Props for the AssetForm component.
 * @interface AssetFormProps
 * @property {function} onAdd - Callback function to handle form submission. Receives an object with `amount` and `comment`.
 * @property {boolean} [loading] - Optional flag to indicate if the form is in a loading state.
 * @property {string | null} [error] - Optional error message to display below the form.
 */
interface AssetFormProps {
  onAdd: (data: { amount: number; comment: string }) => void;
  loading?: boolean;
  error?: string | null;
}

/**
 * AssetForm component.
 * A form for adding asset data, including an amount and an optional comment.
 */
const AssetForm: React.FC<AssetFormProps> = ({ onAdd, loading = false, error = null }) => {
  // State for form fields: amount and comment
  const [fields, handleFieldChange, setFields] = useFormFields({
    amount: '',
    comment: '',
  });

  /**
   * Handles form submission.
   * Prevents page reload, validates the input, and calls the `onAdd` callback with the form data.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.amount) return; // Do not submit if amount is empty
    onAdd({ amount: parseFloat(fields.amount), comment: fields.comment });
    setFields({ amount: '', comment: '' }); // Reset form fields
  };

  // Define the fields to render in the form
  const formFields: FieldConfig[] = [
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
      value: fields.amount,
      onChange: handleFieldChange('amount'),
      required: true,
      inputProps: { min: 0, step: '0.01' },
      size: 'small',
    },
    {
      name: 'comment',
      label: 'Comment',
      type: 'text',
      value: fields.comment,
      onChange: handleFieldChange('comment'),
      size: 'small',
    },
  ];

  return (
    <GenericForm
      fields={formFields}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      submitLabel="Add"
    />
  );
};

export default AssetForm;
