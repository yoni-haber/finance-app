export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  budgetOverview: BudgetOverview[];
}

export interface BudgetOverview {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
}
