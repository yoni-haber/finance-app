package com.yoni.financetracker.dto;

import java.math.BigDecimal;
import java.math.RoundingMode;
import lombok.Data;

/**
 * Data Transfer Object (DTO) for Budget Tracking data. This class is used to transfer budget
 * tracking information between the backend and frontend, providing a clean interface for displaying
 * budget utilization and spending patterns.
 *
 * <p>The @Data annotation from Lombok automatically generates getters, setters, toString, equals,
 * and hashCode methods.
 */
@Data
public class BudgetTrackingDTO {
  /** The category name for this budget tracking entry. */
  private String category;

  /** The budget amount as a formatted string with 2 decimal places. */
  private String budget;

  /** The amount spent as a formatted string with 2 decimal places. */
  private String spent;

  /** The percentage of the budget that has been used. */
  private double percentageUsed;

  /**
   * Sets the budget amount, formatting it to 2 decimal places.
   *
   * @param amount The budget amount to set
   */
  public void setBudget(BigDecimal amount) {
    this.budget = amount.setScale(2, RoundingMode.HALF_UP).toString();
  }

  /**
   * Sets the spent amount, formatting it to 2 decimal places.
   *
   * @param amount The spent amount to set
   */
  public void setSpent(BigDecimal amount) {
    this.spent = amount.setScale(2, RoundingMode.HALF_UP).toString();
  }
}
