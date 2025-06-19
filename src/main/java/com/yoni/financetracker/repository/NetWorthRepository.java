package com.yoni.financetracker.repository;

import com.yoni.financetracker.model.NetWorth;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for managing NetWorth entities in the database. This interface extends
 * JpaRepository, which provides basic CRUD operations and pagination support.
 *
 * <p>The @Repository annotation marks this interface as a Spring Data repository. Spring Data JPA
 * will automatically create an implementation of this interface at runtime.
 */
@Repository
public interface NetWorthRepository extends JpaRepository<NetWorth, Long> {
  /**
   * Finds the net worth record for a specific year and month, if it exists.
   *
   * @param year The year to search for
   * @param month The month to search for
   * @return Optional containing the net worth record if found, empty otherwise
   */
  Optional<NetWorth> findByYearAndMonth(int year, int month);

  // Fetch all net worth records ordered by year and month
  List<NetWorth> findAllByOrderByYearAscMonthAsc();

  // Fetch net worth records in a year/month range (for history)
  List<NetWorth>
      findByYearGreaterThanEqualAndYearLessThanEqualAndMonthGreaterThanEqualAndMonthLessThanEqualOrderByYearAscMonthAsc(
          int startYear, int endYear, int startMonth, int endMonth);
}
