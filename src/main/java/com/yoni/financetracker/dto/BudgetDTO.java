package com.yoni.financetracker.dto;

import com.yoni.financetracker.model.Category;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;

/**
 * Data Transfer Object (DTO) for Budget data. This class is used to transfer budget data between
 * the frontend and backend, providing a clean interface for budget creation and updates.
 *
 * <p>The @Data annotation from Lombok automatically generates getters, setters, toString, equals,
 * and hashCode methods.
 */
@Data
public class BudgetDTO {
  /** The budget amount. Must be greater than 0.01 and cannot be null. */
  @NotNull(message = "Amount is required")
  @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
  private BigDecimal amount;

  /** The category this budget is allocated for. Cannot be null. */
  @NotNull(message = "Category is required")
  private Category category;

  /** The date when this budget is effective from. Cannot be null. */
  @NotNull(message = "Date is required")
  private LocalDate date;
}
