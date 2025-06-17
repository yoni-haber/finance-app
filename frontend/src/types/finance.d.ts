export interface Income {
  id?: number;
  amount: number;
  description: string;
  date: string;
}

export interface Expenditure {
  id?: number;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface Budget {
  id?: number;
  amount: number;
  category: string;
  month: number;
  year: number;
}

export interface BudgetTrackingDTO {
  category: string;
  budget: string;
  spent: string;
  percentageUsed: number;
}
