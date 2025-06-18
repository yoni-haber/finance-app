package com.yoni.financetracker.service;

import com.yoni.financetracker.model.Income;
import com.yoni.financetracker.repository.IncomeRepository;
import jakarta.persistence.OptimisticLockException;
import java.time.LocalDate;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class that handles all business logic related to Income management. This service acts as
 * a middle layer between the controllers and repositories, implementing business rules and
 * transaction management.
 *
 * <p>The @Service annotation marks this class as a Spring service component.
 */
@Slf4j
@Service
public class IncomeService {

  private final IncomeRepository repo;

  /**
   * Constructor-based dependency injection for the IncomeRepository. @Autowired is optional here as
   * Spring automatically injects dependencies when there's only one constructor.
   */
  @Autowired
  public IncomeService(IncomeRepository repo) {
    this.repo = repo;
  }

  /**
   * Saves a new income record or updates an existing one. @Transactional ensures that the operation
   * is atomic.
   *
   * @param income The income record to save
   * @return The saved income record with generated ID
   */
  @Transactional
  public Income save(Income income) {
    return repo.save(income);
  }

  /**
   * Retrieves all income records for a specific month. @Transactional(readOnly = true) optimises
   * the transaction for read-only operations.
   *
   * @param year The year to search in
   * @param month The month to search in (1-12)
   * @return List of income records for the specified month
   */
  @Transactional(readOnly = true)
  public List<Income> getByMonth(int year, int month) {
    LocalDate dateAfter = LocalDate.of(year, month, 1);
    LocalDate dateBefore = dateAfter.withDayOfMonth(dateAfter.lengthOfMonth());
    return repo.findByDateBetween(dateAfter, dateBefore);
  }

  /**
   * Calculates the total income for a specific month. @Transactional(readOnly = true) optimises the
   * transaction for read-only operations.
   *
   * @param year The year to calculate for
   * @param month The month to calculate for (1-12)
   * @return The total income amount for the specified month
   */
  @Transactional(readOnly = true)
  public double getTotalIncome(int year, int month) {
    List<Income> income = getByMonth(year, month);
    return income.stream().mapToDouble(e -> e.getAmount().doubleValue()).sum();
  }

  /**
   * Updates an existing income record with new values. Implements optimistic locking to handle
   * concurrent modifications.
   *
   * @param incomeId The ID of the income record to update
   * @param updatedIncome The new income data
   * @return The updated income record
   * @throws IllegalArgumentException if the income record is not found
   * @throws IllegalStateException if there's a concurrent modification
   */
  @Transactional
  public Income updateIncome(Long incomeId, Income updatedIncome) {
    Income existingIncome =
        repo.findById(incomeId).orElseThrow(() -> new IllegalArgumentException("Income not found"));

    try {
      existingIncome.setAmount(updatedIncome.getAmount());
      existingIncome.setDescription(updatedIncome.getDescription());
      existingIncome.setDate(updatedIncome.getDate());

      return repo.save(existingIncome);
    } catch (OptimisticLockException e) {
      throw new IllegalStateException(
          "Income was modified by another user. Please refresh and try again.");
    }
  }

  /**
   * Deletes an income record by its ID.
   *
   * @param incomeId The ID of the income record to delete
   * @throws IllegalArgumentException if the income record is not found
   */
  @Transactional
  public void deleteIncome(Long incomeId) {
    if (!repo.existsById(incomeId)) {
      throw new IllegalArgumentException("Income not found");
    }
    repo.deleteById(incomeId);
  }
}
