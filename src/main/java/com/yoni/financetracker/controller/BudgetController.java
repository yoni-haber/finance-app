package com.yoni.financetracker.controller;

import com.yoni.financetracker.dto.BudgetDTO;
import com.yoni.financetracker.model.Budget;
import com.yoni.financetracker.model.Category;
import com.yoni.financetracker.service.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing budget-related operations. This controller handles HTTP requests for
 * creating, reading, updating, and deleting budgets.
 *
 * <p>The @Slf4j annotation enables logging functionality. The @RestController annotation marks this
 * class as a REST controller. The @RequestMapping("/api/budget") annotation specifies the base URL
 * for all endpoints in this controller. The @CrossOrigin annotation allows requests from the
 * frontend development server.
 */
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/budget")
public class BudgetController {

  private final BudgetService service;

  /** Constructor-based dependency injection for the BudgetService. */
  public BudgetController(BudgetService service) {
    this.service = service;
  }

  /**
   * Creates a new budget or updates an existing one.
   *
   * @param budgetDTO The budget data transfer object containing the budget details
   * @return ResponseEntity containing the created/updated budget
   */
  @Operation(summary = "Create or update a budget")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Budget created/updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input")
      })
  @PostMapping
  public ResponseEntity<Budget> createOrUpdateBudget(@Valid @RequestBody BudgetDTO budgetDTO) {
    log.info("Creating/updating budget: {}", budgetDTO);
    try {
      Budget budget = new Budget();
      budget.setCategory(budgetDTO.getCategory());
      budget.setAmount(budgetDTO.getAmount());
      budget.setDate(budgetDTO.getDate());
      Budget savedBudget = service.save(budget);
      log.info("Successfully created/updated budget: {}", savedBudget);
      return ResponseEntity.ok(savedBudget);
    } catch (Exception e) {
      log.error("Error creating/updating budget", e);
      throw e;
    }
  }

  /**
   * Retrieves all budgets for a specific month.
   *
   * @param year The year to search in
   * @param month The month to search in (1-12)
   * @return ResponseEntity containing a list of budgets
   */
  @Operation(summary = "Get all budgets for a specific month")
  @GetMapping
  public ResponseEntity<List<Budget>> getBudgets(@RequestParam int year, @RequestParam int month) {
    log.info("Fetching budgets for year: {} and month: {}", year, month);
    try {
      LocalDate startDate = LocalDate.of(year, month, 1);
      LocalDate endDate = startDate.plusMonths(1).minusDays(1);
      List<Budget> budgets = service.getByDateRange(startDate, endDate);
      log.info("Found {} budgets", budgets.size());
      return ResponseEntity.ok(budgets);
    } catch (Exception e) {
      log.error("Error fetching budgets", e);
      throw e;
    }
  }

  /**
   * Retrieves a budget for a specific category and month.
   *
   * @param category The category to search for
   * @param year The year to search in
   * @param month The month to search in (1-12)
   * @return ResponseEntity containing the budget if found, or 404 if not found
   */
  @Operation(summary = "Get budget for a specific category and month")
  @GetMapping("/category")
  public ResponseEntity<Budget> getBudgetForCategory(
      @RequestParam Category category, @RequestParam int year, @RequestParam int month) {
    log.info("Fetching budget for category: {}, year: {}, month: {}", category, year, month);
    try {
      LocalDate startDate = LocalDate.of(year, month, 1);
      LocalDate endDate = startDate.plusMonths(1).minusDays(1);
      return service
          .getByCategoryAndDateRange(category, startDate, endDate)
          .map(
              budget -> {
                log.info("Found budget: {}", budget);
                return ResponseEntity.ok(budget);
              })
          .orElseGet(
              () -> {
                log.info("No budget found for category: {}", category);
                return ResponseEntity.notFound().build();
              });
    } catch (Exception e) {
      log.error("Error fetching budget for category", e);
      throw e;
    }
  }

  /**
   * Updates an existing budget.
   *
   * @param id The ID of the budget to update
   * @param budgetDTO The new budget data
   * @return ResponseEntity containing the updated budget
   */
  @Operation(summary = "Update an existing budget")
  @PutMapping("/{id}")
  public ResponseEntity<Budget> updateBudget(
      @PathVariable Long id, @Valid @RequestBody BudgetDTO budgetDTO) {
    log.info("Updating budget with id: {}, data: {}", id, budgetDTO);
    try {
      Budget budget = new Budget();
      budget.setCategory(budgetDTO.getCategory());
      budget.setAmount(budgetDTO.getAmount());
      budget.setDate(budgetDTO.getDate());
      Budget updatedBudget = service.updateBudget(id, budget);
      log.info("Successfully updated budget: {}", updatedBudget);
      return ResponseEntity.ok(updatedBudget);
    } catch (Exception e) {
      log.error("Error updating budget", e);
      throw e;
    }
  }

  /**
   * Deletes a budget.
   *
   * @param id The ID of the budget to delete
   * @return ResponseEntity with no content if successful
   */
  @Operation(summary = "Delete a budget")
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
    log.info("Deleting budget with id: {}", id);
    try {
      service.deleteBudget(id);
      log.info("Successfully deleted budget with id: {}", id);
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      log.error("Error deleting budget", e);
      throw e;
    }
  }
}
