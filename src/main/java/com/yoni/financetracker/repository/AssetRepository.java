package com.yoni.financetracker.repository;

import com.yoni.financetracker.model.Asset;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for managing Asset entities in the database. This interface extends
 * JpaRepository, which provides basic CRUD operations and pagination support.
 *
 * <p>The @Repository annotation marks this interface as a Spring Data repository. Spring Data JPA
 * will automatically create an implementation of this interface at runtime.
 */
@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
  /**
   * Finds all assets for a specific year and month.
   *
   * @param year The year to search for
   * @param month The month to search for
   * @return List of assets for the specified year and month
   */
  List<Asset> findByYearAndMonth(int year, int month);
}
