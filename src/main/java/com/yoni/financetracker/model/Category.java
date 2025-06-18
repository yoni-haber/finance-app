package com.yoni.financetracker.model;

/**
 * This enum represents the different categories for financial transactions in the application.
 * Categories are used to classify both income and expenditures, helping users track their finances
 * in an organised manner.
 *
 * <p>Each category represents a common type of financial transaction: - GROCERIES: Food and
 * household items - UTILITIES: Electricity, water, gas, internet, etc. - MORTGAGE: Housing payments
 * - ENTERTAINMENT: Movies, dining out, hobbies, etc. - TRANSPORTATION: Gas, public transport, car
 * maintenance - INVESTMENTS: Stock market, bonds, etc. - SAVINGS: Money set aside for future use -
 * OTHER: Miscellaneous transactions that don't fit other categories
 */
public enum Category {
  GROCERIES,
  UTILITIES,
  MORTGAGE,
  ENTERTAINMENT,
  TRANSPORTATION,
  INVESTMENTS,
  SAVINGS,
  OTHER,
}
