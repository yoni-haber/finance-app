package com.yoni.financetracker.repository;

import com.yoni.financetracker.model.Expenditure;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for managing Expenditure entities in the database. This interface extends
 * JpaRepository, which provides basic CRUD operations and pagination support.
 *
 * <p>The @Repository annotation marks this interface as a Spring Data repository. Spring Data JPA
 * will automatically create an implementation of this interface at runtime.
 */
@Repository
public interface ExpenditureRepository extends JpaRepository<Expenditure, Long> {
  /**
   * Finds all expenditure records within a specified date range. This method is useful for
   * generating expense reports and analyzing spending patterns over time.
   *
   * @param startDate The start date of the range (inclusive)
   * @param endDate The end date of the range (inclusive)
   * @return List of expenditure records within the specified date range
   */
  List<Expenditure> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
