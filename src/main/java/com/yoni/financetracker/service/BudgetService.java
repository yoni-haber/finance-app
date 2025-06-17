package com.yoni.financetracker.service;

import com.yoni.financetracker.model.Budget;
import com.yoni.financetracker.model.Category;
import com.yoni.financetracker.repository.BudgetRepository;
import jakarta.persistence.OptimisticLockException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class that handles all business logic related to Budget management. This service acts as
 * a middle layer between the controllers and repositories, implementing business rules and
 * transaction management.
 *
 * <p>The @Service annotation marks this class as a Spring service component.
 */
@Slf4j
@Service
public class BudgetService {

  private final BudgetRepository repo;

  /**
   * Constructor-based dependency injection for the BudgetRepository. @Autowired is optional here as
   * Spring automatically injects dependencies when there's only one constructor.
   */
  @Autowired
  public BudgetService(BudgetRepository repo) {
    this.repo = repo;
  }

  /**
   * Saves a new budget or updates an existing one. @Transactional ensures that the operation is
   * atomic.
   *
   * @param budget The budget to save
   * @return The saved budget with generated ID
   */
  @Transactional
  public Budget save(Budget budget) {
    return repo.save(budget);
  }

  /**
   * Retrieves all budgets within a specified date range. @Transactional(readOnly = true) optimizes
   * the transaction for read-only operations.
   *
   * @param startDate The start date of the range (inclusive)
   * @param endDate The end date of the range (inclusive)
   * @return List of budgets within the date range
   */
  @Transactional(readOnly = true)
  public List<Budget> getByDateRange(LocalDate startDate, LocalDate endDate) {
    return repo.findByDateBetween(startDate, endDate);
  }

  /**
   * Retrieves a budget for a specific category within a date range. @Transactional(readOnly = true)
   * optimizes the transaction for read-only operations.
   *
   * @param category The category to search for
   * @param startDate The start date of the range (inclusive)
   * @param endDate The end date of the range (inclusive)
   * @return Optional containing the budget if found
   */
  @Transactional(readOnly = true)
  public Optional<Budget> getByCategoryAndDateRange(
      Category category, LocalDate startDate, LocalDate endDate) {
    return repo.findByCategoryAndDateBetween(category, startDate, endDate);
  }

  /**
   * Updates an existing budget with new values. Implements optimistic locking to handle concurrent
   * modifications.
   *
   * @param budgetId The ID of the budget to update
   * @param updatedBudget The new budget data
   * @return The updated budget
   * @throws IllegalArgumentException if the budget is not found
   * @throws IllegalStateException if there's a concurrent modification
   */
  @Transactional
  public Budget updateBudget(Long budgetId, Budget updatedBudget) {
    Budget existingBudget =
        repo.findById(budgetId).orElseThrow(() -> new IllegalArgumentException("Budget not found"));

    try {
      existingBudget.setAmount(updatedBudget.getAmount());
      existingBudget.setCategory(updatedBudget.getCategory());
      existingBudget.setDate(updatedBudget.getDate());

      return repo.save(existingBudget);
    } catch (OptimisticLockException e) {
      throw new IllegalStateException(
          "Budget was modified by another user. Please refresh and try again.");
    }
  }

  /**
   * Deletes a budget by its ID.
   *
   * @param budgetId The ID of the budget to delete
   * @throws IllegalArgumentException if the budget is not found
   */
  @Transactional
  public void deleteBudget(Long budgetId) {
    if (!repo.existsById(budgetId)) {
      throw new IllegalArgumentException("Budget not found");
    }
    repo.deleteById(budgetId);
  }
}
