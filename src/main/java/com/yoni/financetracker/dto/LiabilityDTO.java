package com.yoni.financetracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Data;

/**
 * Data Transfer Object (DTO) for Liability data. This class is used to transfer liability data
 * between the frontend and backend, providing a clean interface for liability creation and updates.
 *
 * <p>The @Data annotation from Lombok automatically generates getters, setters, toString, equals,
 * and hashCode methods.
 */
@Data
public class LiabilityDTO {
  /** Unique identifier for the liability entry. */
  private Long id;

  /** The year this liability is recorded for. */
  private int year;

  /** The month this liability is recorded for. */
  private int month;

  /** The liability amount. Must be greater than 0.01 and cannot be null. */
  @NotNull(message = "Amount is required")
  @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
  private BigDecimal amount;

  /** A comment/description for the liability. */
  private String comment;

  public LiabilityDTO(Long id, int year, int month, BigDecimal amount, String comment) {
    this.id = id;
    this.year = year;
    this.month = month;
    this.amount = amount;
    this.comment = comment;
  }
}
