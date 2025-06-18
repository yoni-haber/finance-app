package com.yoni.financetracker.service;

import com.yoni.financetracker.model.Expenditure;
import com.yoni.financetracker.repository.ExpenditureRepository;
import jakarta.persistence.OptimisticLockException;
import java.time.LocalDate;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class that handles all business logic related to Expenditure management. This service
 * acts as a middle layer between the controllers and repositories, implementing business rules and
 * transaction management.
 *
 * <p>The @Service annotation marks this class as a Spring service component.
 */
@Slf4j
@Service
public class ExpenditureService {

  private final ExpenditureRepository repo;

  /**
   * Constructor-based dependency injection for the ExpenditureRepository. @Autowired is optional
   * here as Spring automatically injects dependencies when there's only one constructor.
   */
  @Autowired
  public ExpenditureService(ExpenditureRepository repo) {
    this.repo = repo;
  }

  /**
   * Saves a new expenditure record or updates an existing one. @Transactional ensures that the
   * operation is atomic.
   *
   * @param expenditure The expenditure record to save
   * @return The saved expenditure record with generated ID
   */
  @Transactional
  public Expenditure save(Expenditure expenditure) {
    return repo.save(expenditure);
  }

  /**
   * Retrieves all expenditure records for a specific month. @Transactional(readOnly = true)
   * optimises the transaction for read-only operations.
   *
   * @param year The year to search in
   * @param month The month to search in (1-12)
   * @return List of expenditure records for the specified month
   */
  @Transactional(readOnly = true)
  public List<Expenditure> getByMonth(int year, int month) {
    LocalDate dateAfter = LocalDate.of(year, month, 1);
    LocalDate dateBefore = dateAfter.withDayOfMonth(dateAfter.lengthOfMonth());
    return repo.findByDateBetween(dateAfter, dateBefore);
  }

  /**
   * Calculates the total expenditure for a specific month. @Transactional(readOnly = true)
   * optimises the transaction for read-only operations.
   *
   * @param year The year to calculate for
   * @param month The month to calculate for (1-12)
   * @return The total expenditure amount for the specified month
   */
  @Transactional(readOnly = true)
  public double getTotalExpenditure(int year, int month) {
    List<Expenditure> expenditures = getByMonth(year, month);
    return expenditures.stream().mapToDouble(e -> e.getAmount().doubleValue()).sum();
  }

  /**
   * Updates an existing expenditure record with new values. Implements optimistic locking to handle
   * concurrent modifications.
   *
   * @param expenditureId The ID of the expenditure record to update
   * @param updatedExpenditure The new expenditure data
   * @return The updated expenditure record
   * @throws IllegalArgumentException if the expenditure record is not found
   * @throws IllegalStateException if there's a concurrent modification
   */
  @Transactional
  public Expenditure updateExpenditure(Long expenditureId, Expenditure updatedExpenditure) {
    Expenditure existingExpenditure =
        repo.findById(expenditureId)
            .orElseThrow(() -> new IllegalArgumentException("Expenditure not found"));

    try {
      existingExpenditure.setAmount(updatedExpenditure.getAmount());
      existingExpenditure.setDescription(updatedExpenditure.getDescription());
      existingExpenditure.setDate(updatedExpenditure.getDate());
      existingExpenditure.setCategory(updatedExpenditure.getCategory());

      return repo.save(existingExpenditure);
    } catch (OptimisticLockException e) {
      throw new IllegalStateException(
          "Expenditure was modified by another user. Please refresh and try again.");
    }
  }

  /**
   * Deletes an expenditure record by its ID.
   *
   * @param expenditureId The ID of the expenditure record to delete
   * @throws IllegalArgumentException if the expenditure record is not found
   */
  @Transactional
  public void deleteExpenditure(Long expenditureId) {
    if (!repo.existsById(expenditureId)) {
      throw new IllegalArgumentException("Expenditure not found");
    }
    repo.deleteById(expenditureId);
  }
}
