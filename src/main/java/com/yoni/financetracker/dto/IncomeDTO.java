package com.yoni.financetracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;

/**
 * Data Transfer Object (DTO) for Income data. This class is used to transfer income data between
 * the frontend and backend, providing a clean interface for income creation and updates.
 *
 * <p>The @Data annotation from Lombok automatically generates getters, setters, toString, equals,
 * and hashCode methods.
 */
@Data
public class IncomeDTO {
  /** The income amount. Must be greater than 0.01 and cannot be null. */
  @NotNull(message = "Amount is required")
  @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
  private BigDecimal amount;

  /** A description of the income source or purpose. Cannot be null or empty. */
  @NotBlank(message = "Description is required")
  private String description;

  /** The date when the income was received. Cannot be null. */
  @NotNull(message = "Date is required")
  private LocalDate date;
}
