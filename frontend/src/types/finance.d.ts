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

export interface NetWorth {
  id?: number;
  year: number;
  month: number;
  assets: number;
  liabilities: number;
}

export interface Asset {
  id?: number;
  year: number;
  month: number;
  amount: number;
  comment: string;
}

export interface Liability {
  id?: number;
  year: number;
  month: number;
  amount: number;
  comment: string;
}
