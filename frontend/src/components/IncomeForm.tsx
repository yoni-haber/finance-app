import React, { useRef, useEffect, useState } from 'react';
import GenericForm, { type FieldConfig } from './common/GenericForm';
import { useFormFields } from './common/useFormFields';
import api from '../api/financeApi';

/**
 * IncomeForm Component
 *
 * A form for adding a new income entry. Users can enter a date, description, and amount.
 *
 * Props:
 * - onIncomeAdded: Function called after a successful submission to refresh the list.
 * - year: The selected year (used for default date).
 * - month: The selected month (used for default date).
 */

interface IncomeFormProps {
  onIncomeAdded: () => void;
  year: number;
  month: number;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ onIncomeAdded, year, month }) => {
  // State for error and loading
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Used to only set the default date once per year/month change
  const didSetDefault = useRef(false);

  // State for form fields: date, description, amount
  const [fields, handleFieldChange, setFields] = useFormFields({
    date: '',
    description: '',
    amount: '',
  });

  // Set default date to the first of the selected month/year if not already set
  useEffect(() => {
    if (!fields.date && !didSetDefault.current) {
      setFields(f => ({ ...f, date: `${year}-${String(month + 1).padStart(2, '0')}-01` }));
      didSetDefault.current = true;
    }
    if (!fields.date) didSetDefault.current = false;
  }, [year, month, fields.date, setFields]);

  /**
   * Handles form submission: validates, sends to API, resets fields, and notifies parent.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let submitDate = fields.date;
      if (!submitDate) {
        submitDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      }
      await api.post('/income', {
        date: submitDate,
        description: fields.description,
        amount: parseFloat(fields.amount),
      });
      setFields({ date: '', description: '', amount: '' });
      if (onIncomeAdded) onIncomeAdded();
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to add income. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Define the fields to render in the form
  const formFields: FieldConfig[] = [
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      value: fields.date,
      onChange: handleFieldChange('date'),
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      value: fields.description,
      onChange: handleFieldChange('description'),
      required: true,
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
      value: fields.amount,
      onChange: handleFieldChange('amount'),
      required: true,
      inputProps: { step: '0.01', min: '0' },
    },
  ];

  return (
    <GenericForm
      fields={formFields}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      title="Add Income"
      submitLabel="Add Income"
      paper
    />
  );
};

export default IncomeForm;
