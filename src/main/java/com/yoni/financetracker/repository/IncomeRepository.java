package com.yoni.financetracker.repository;

import com.yoni.financetracker.model.Income;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for managing Income entities in the database. This interface extends
 * JpaRepository, which provides basic CRUD operations and pagination support.
 *
 * <p>The @Repository annotation marks this interface as a Spring Data repository. Spring Data JPA
 * will automatically create an implementation of this interface at runtime.
 */
@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
  /**
   * Finds all income records within a specified date range. This method is useful for generating
   * income reports and analysing income patterns over time.
   *
   * @param dateAfter The start date of the range (inclusive)
   * @param dateBefore The end date of the range (inclusive)
   * @return List of income records within the specified date range
   */
  List<Income> findByDateBetween(LocalDate dateAfter, LocalDate dateBefore);
}
