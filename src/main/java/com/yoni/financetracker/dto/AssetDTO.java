package com.yoni.financetracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Data;

/**
 * Data Transfer Object (DTO) for Asset data. This class is used to transfer asset data between the
 * frontend and backend, providing a clean interface for asset creation and updates.
 *
 * <p>The @Data annotation from Lombok automatically generates getters, setters, toString, equals,
 * and hashCode methods.
 */
@Data
public class AssetDTO {
  /** Unique identifier for the asset entry. */
  private Long id;

  /** The year this asset is recorded for. */
  private int year;

  /** The month this asset is recorded for. */
  private int month;

  /** The asset amount. Must be greater than 0.01 and cannot be null. */
  @NotNull(message = "Amount is required")
  @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
  private BigDecimal amount;

  /** A comment/description for the asset. */
  private String comment;

  public AssetDTO(Long id, int year, int month, BigDecimal amount, String comment) {
    this.id = id;
    this.year = year;
    this.month = month;
    this.amount = amount;
    this.comment = comment;
  }
}
