package com.yoni.financetracker.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.Data;

/**
 * This entity represents a net worth record for a specific month and year. Net worth is calculated
 * as assets minus liabilities.
 *
 * <p>The @Entity annotation marks this class as a JPA entity, meaning it will be mapped to a
 * database table. The @Data annotation from Lombok automatically generates getters, setters,
 * toString, equals, and hashCode methods.
 */
@Data
@Entity
@Table(
    name = "net_worth",
    uniqueConstraints = @UniqueConstraint(columnNames = {"year_value", "month_value"}))
public class NetWorth {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "year_value")
  private int year;

  @Column(name = "month_value")
  private int month;

  private BigDecimal assets;

  private BigDecimal liabilities;
}
