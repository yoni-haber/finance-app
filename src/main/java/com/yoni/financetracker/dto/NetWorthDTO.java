package com.yoni.financetracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Data;

/**
 * Data Transfer Object (DTO) for Net Worth data. This class is used to transfer net worth data
 * between the frontend and backend, providing a clean interface for net worth creation and updates.
 *
 * <p>The @Data annotation from Lombok automatically generates getters, setters, toString, equals,
 * and hashCode methods.
 */
@Data
public class NetWorthDTO {
  /** Unique identifier for the net worth entry. */
  private Long id;

  /** The year this net worth is recorded for. */
  private int year;

  /** The month this net worth is recorded for. */
  private int month;

  /** The total assets. Must be greater than or equal to 0 and cannot be null. */
  @NotNull(message = "Assets is required")
  @DecimalMin(value = "0.00", message = "Assets must be zero or greater")
  private BigDecimal assets;

  /** The total liabilities. Must be greater than or equal to 0 and cannot be null. */
  @NotNull(message = "Liabilities is required")
  @DecimalMin(value = "0.00", message = "Liabilities must be zero or greater")
  private BigDecimal liabilities;

  public NetWorthDTO(Long id, int year, int month, BigDecimal assets, BigDecimal liabilities) {
    this.id = id;
    this.year = year;
    this.month = month;
    this.assets = assets;
    this.liabilities = liabilities;
  }
}
