package com.yoni.financetracker.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.Data;

/**
 * This entity represents an asset entry for a specific month and year. Assets track what the user
 * owns.
 *
 * <p>The @Entity annotation marks this class as a JPA entity, meaning it will be mapped to a
 * database table. The @Data annotation from Lombok automatically generates getters, setters,
 * toString, equals, and hashCode methods.
 */
@Data
@Entity
@Table(name = "asset")
public class Asset {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "year_value")
  private int year;

  @Column(name = "month_value")
  private int month;

  private BigDecimal amount;

  private String comment;

  public Asset(int year, int month, BigDecimal amount, String comment) {
    this.year = year;
    this.month = month;
    this.amount = amount;
    this.comment = comment;
  }

  public Asset() {}
}
