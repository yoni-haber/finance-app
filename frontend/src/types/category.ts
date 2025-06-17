export const Category = {
  GROCERIES: 'GROCERIES',
  UTILITIES: 'UTILITIES',
  MORTGAGE: 'MORTGAGE',
  ENTERTAINMENT: 'ENTERTAINMENT',
  TRANSPORTATION: 'TRANSPORTATION',
  INVESTMENTS: 'INVESTMENTS',
  SAVINGS: 'SAVINGS',
  OTHER: 'OTHER',
} as const;

export type Category = (typeof Category)[keyof typeof Category];
