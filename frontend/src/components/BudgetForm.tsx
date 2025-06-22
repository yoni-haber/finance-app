import React, { useRef, useEffect, useState } from 'react';
import GenericForm, { type FieldConfig } from './common/GenericForm';
import { useFormFields } from './common/useFormFields';
import api from '../api/financeApi';
import { Category } from '../types/category';

/**
 * BudgetForm Component
 *
 * A form for adding a new budget entry. Users can enter an amount, select a category, and pick a date.
 *
 * Props:
 * - onBudgetAdded: Function called after a successful submission to refresh the list.
 * - year: The selected year (used for default date).
 * - month: The selected month (used for default date).
 */

interface BudgetFormProps {
  onBudgetAdded: () => void;
  year: number;
  month: number;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onBudgetAdded, year, month }) => {
  // State for error and loading
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Used to only set the default date once per year/month change
  const didSetDefault = useRef(false);

  // State for form fields: amount, category, date
  const [fields, handleFieldChange, setFields] = useFormFields({
    amount: '',
    category: Category.OTHER,
    date: '',
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
      await api.post('/budget', {
        amount: Number(fields.amount),
        category: fields.category,
        date: fields.date,
      });
      setFields({ amount: '', category: Category.OTHER, date: '' });
      if (onBudgetAdded) onBudgetAdded();
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to add budget. Please try again.'
      );
    } finally {
      setLoading(false);
    }
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
      inputProps: { step: '0.01', min: '0' },
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      value: fields.category,
      onChange: handleFieldChange('category'),
      required: true,
      options: Object.values(Category).map(option => ({ value: option, label: option })),
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      value: fields.date,
      onChange: handleFieldChange('date'),
      required: true,
    },
  ];

  return (
    <GenericForm
      fields={formFields}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      title="Add Budget"
      submitLabel="Add Budget"
      paper
    />
  );
};

export default BudgetForm;
