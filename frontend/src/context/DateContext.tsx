import React, { createContext, useContext, useState, useEffect } from 'react';

interface DateContextType {
  year: number;
  month: number; // 0-based (0 = January)
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  setYearMonth: (year: number, month: number) => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to initialize from URL query params if present
  const getInitialDate = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const y = params.get('year');
      const m = params.get('month');
      if (y && m) {
        return { year: Number(y), month: Number(m) - 1 };
      }
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  };

  const [{ year, month }, setDate] = useState(getInitialDate());

  // Optionally, sync to URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('year', String(year));
    params.set('month', String(month + 1));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [year, month]);

  const setYearMonth = (y: number, m: number) => setDate({ year: y, month: m });

  return (
    <DateContext.Provider
      value={{
        year,
        month,
        setYear: y => setDate({ year: y, month }),
        setMonth: m => setDate({ year, month: m }),
        setYearMonth,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) throw new Error('useDate must be used within a DateProvider');
  return context;
};
