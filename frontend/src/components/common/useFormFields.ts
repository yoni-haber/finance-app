import { useState } from 'react';

/**
 * useFormFields - Custom React hook for managing form field state.
 *
 * @param initialFields - An object with field names as keys and initial values.
 * @returns [fields, handleFieldChange, setFields]:
 *   - fields: current field values
 *   - handleFieldChange: function to update a field by name
 *   - setFields: function to set all fields at once
 */

export function useFormFields<T extends Record<string, any>>(initialFields: T) {
  const [fields, setFields] = useState<T>(initialFields);

  const handleFieldChange = (name: keyof T) => (value: any) => {
    setFields(prev => ({ ...prev, [name]: value }));
  };

  return [fields, handleFieldChange, setFields] as const;
}
