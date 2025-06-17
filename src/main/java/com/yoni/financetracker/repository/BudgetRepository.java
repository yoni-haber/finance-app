package com.yoni.financetracker.repository;

import com.yoni.financetracker.model.Budget;
import com.yoni.financetracker.model.Category;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for managing Budget entities in the database. This interface extends
 * JpaRepository, which provides basic CRUD operations and pagination support.
 *
 * <p>The @Repository annotation marks this interface as a Spring Data repository. Spring Data JPA
 * will automatically create an implementation of this interface at runtime.
 */
@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
  /**
   * Finds all budgets within a specified date range.
   *
   * @param startDate The start date of the range (inclusive)
   * @param endDate The end date of the range (inclusive)
   * @return List of budgets within the specified date range
   */
  List<Budget> findByDateBetween(LocalDate startDate, LocalDate endDate);

  /**
   * Finds a budget for a specific category within a date range.
   *
   * @param category The category to search for
   * @param startDate The start date of the range (inclusive)
   * @param endDate The end date of the range (inclusive)
   * @return Optional containing the budget if found, empty otherwise
   */
  Optional<Budget> findByCategoryAndDateBetween(
      Category category, LocalDate startDate, LocalDate endDate);
}
