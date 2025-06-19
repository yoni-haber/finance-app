package com.yoni.financetracker.controller;

import com.yoni.financetracker.dto.BudgetTrackingDTO;
import com.yoni.financetracker.service.BudgetTrackingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing budget tracking operations. This controller handles HTTP requests
 * for retrieving budget tracking information, which combines budget and expenditure data to show
 * spending patterns and budget utilisation.
 *
 * <p>The @Slf4j annotation enables logging functionality. The @RestController annotation marks this
 * class as a REST controller. The @RequestMapping("/api/budget-tracking") annotation specifies the
 * base URL for all endpoints in this controller. The @RequiredArgsConstructor generates a
 * constructor for all final fields.
 */
@Tag(name = "Budget Tracking", description = "Budget tracking APIs")
@Slf4j
@RestController
@RequestMapping("/api/budget-tracking")
@RequiredArgsConstructor
public class BudgetTrackingController {
  private final BudgetTrackingService budgetTrackingService;

  /**
   * Retrieves budget tracking information for a specific month and year. This endpoint combines
   * budget and expenditure data to show: - Budget amounts for each category - Actual spending in
   * each category - Percentage of budget used
   *
   * @param month The month to track (1-12)
   * @param year The year to track
   * @return ResponseEntity containing a list of BudgetTrackingDTO objects with tracking information
   */
  @GetMapping
  public ResponseEntity<List<BudgetTrackingDTO>> getBudgetTracking(
      @RequestParam int month, @RequestParam int year) {
    log.info("Received request for budget tracking - month: {}, year: {}", month, year);
    try {
      List<BudgetTrackingDTO> result = budgetTrackingService.getBudgetTracking(month, year);
      log.info("Returning {} budget tracking items", result.size());
      if (!result.isEmpty()) {
        log.info("First item: {}", result.get(0));
      }
      return ResponseEntity.ok(result);
    } catch (Exception e) {
      log.error("Error getting budget tracking data", e);
      throw e;
    }
  }
}
