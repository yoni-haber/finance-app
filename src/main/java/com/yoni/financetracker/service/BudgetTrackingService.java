package com.yoni.financetracker.service;

import com.yoni.financetracker.dto.BudgetTrackingDTO;
import com.yoni.financetracker.model.Budget;
import com.yoni.financetracker.model.Category;
import com.yoni.financetracker.model.Expenditure;
import com.yoni.financetracker.repository.BudgetRepository;
import com.yoni.financetracker.repository.ExpenditureRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class that handles budget tracking and analysis functionality. This service combines
 * budget and expenditure data to provide insights into spending patterns and budget utilization.
 *
 * <p>The @Slf4j annotation enables logging functionality. The @Service annotation marks this class
 * as a Spring service component. The @RequiredArgsConstructor generates a constructor for all final
 * fields.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BudgetTrackingService {
  private final BudgetRepository budgetRepository;
  private final ExpenditureRepository expenditureRepository;

  /**
   * Generates budget tracking information for a specific month and year. This method: 1. Retrieves
   * all budgets and expenditures for the specified period 2. Groups expenditures by category 3.
   * Calculates spending percentages against budgets 4. Returns a list of DTOs containing the
   * tracking information @Transactional(readOnly = true) optimizes the transaction for read-only
   * operations.
   *
   * @param month The month to track (1-12)
   * @param year The year to track
   * @return List of BudgetTrackingDTO objects containing budget tracking information
   */
  @Transactional(readOnly = true)
  public List<BudgetTrackingDTO> getBudgetTracking(int month, int year) {
    log.info("Fetching budget tracking for month: {} and year: {}", month, year);

    // Calculate the date range for the specified month
    LocalDate startDate = LocalDate.of(year, month, 1);
    LocalDate endDate = startDate.plusMonths(1).minusDays(1);

    // Get all budgets for the specified month and year
    List<Budget> budgets = budgetRepository.findByDateBetween(startDate, endDate);
    log.info("Found {} budgets", budgets.size());

    // Get all expenditures for the specified month and year
    List<Expenditure> expenditures = expenditureRepository.findByDateBetween(startDate, endDate);
    log.info("Found {} expenditures between {} and {}", expenditures.size(), startDate, endDate);

    // Group expenditures by category and sum their amounts
    Map<Category, BigDecimal> expenditureByCategory =
        expenditures.stream()
            .collect(
                Collectors.groupingBy(
                    Expenditure::getCategory,
                    Collectors.mapping(
                        Expenditure::getAmount,
                        Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));
    log.info("Expenditures by category: {}", expenditureByCategory);

    // Create tracking DTOs for each budget
    List<BudgetTrackingDTO> budgetTrackingDTOs =
        budgets.stream()
            .map(
                budget -> {
                  BudgetTrackingDTO dto = new BudgetTrackingDTO();
                  dto.setCategory(budget.getCategory().toString());
                  dto.setBudget(budget.getAmount());

                  // Get total spent for this category, defaulting to zero if no expenditures
                  BigDecimal spent =
                      expenditureByCategory.getOrDefault(budget.getCategory(), BigDecimal.ZERO);
                  dto.setSpent(spent);

                  // Calculate percentage of budget used
                  if (budget.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal percentage =
                        spent
                            .multiply(new BigDecimal("100"))
                            .divide(budget.getAmount(), 2, RoundingMode.HALF_UP);
                    dto.setPercentageUsed(percentage.doubleValue());
                  } else {
                    dto.setPercentageUsed(0.0);
                  }

                  log.info(
                      "Created tracking DTO for category {}: budget={}, spent={}, percentageUsed={}",
                      budget.getCategory(),
                      dto.getBudget(),
                      dto.getSpent(),
                      dto.getPercentageUsed());

                  return dto;
                })
            .collect(Collectors.toList());

    log.info("Returning {} tracking DTOs", budgetTrackingDTOs.size());
    return budgetTrackingDTOs;
  }
}
