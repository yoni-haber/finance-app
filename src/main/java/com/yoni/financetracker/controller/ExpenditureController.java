package com.yoni.financetracker.controller;

import com.yoni.financetracker.model.Expenditure;
import com.yoni.financetracker.service.ExpenditureService;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing expenditure-related operations. This controller handles HTTP
 * requests for creating, reading, updating, and deleting expenditure records.
 *
 * <p>The @RestController annotation marks this class as a REST controller.
 * The @RequestMapping("/api/expenditure") annotation specifies the base URL for all endpoints in
 * this controller. The @CrossOrigin annotation allows requests from the frontend development
 * server.
 */
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/expenditure")
public class ExpenditureController {

  private final ExpenditureService service;

  /**
   * Constructor-based dependency injection for the ExpenditureService. @Autowired is optional here
   * as Spring automatically injects dependencies when there's only one constructor.
   */
  @Autowired
  public ExpenditureController(ExpenditureService service) {
    this.service = service;
  }

  /**
   * Creates a new expenditure record.
   *
   * @param expenditure The expenditure record to create
   * @return The created expenditure record with generated ID
   */
  @PostMapping
  public Expenditure addExpenditure(@RequestBody Expenditure expenditure) {
    return service.save(expenditure);
  }

  /**
   * Retrieves all expenditure records for a specific month.
   *
   * @param year The year to search in
   * @param month The month to search in (1-12)
   * @return List of expenditure records for the specified month
   */
  @GetMapping
  public List<Expenditure> getExpenditureByMonth(@RequestParam int year, @RequestParam int month) {
    return service.getByMonth(year, month);
  }

  /**
   * Calculates the total expenditure for a specific month.
   *
   * @param year The year to calculate for
   * @param month The month to calculate for (1-12)
   * @return The total expenditure amount for the specified month
   */
  @GetMapping("/total")
  public double getTotalExpenditure(@RequestParam int year, @RequestParam int month) {
    return service.getTotalExpenditure(year, month);
  }

  /**
   * Updates an existing expenditure record.
   *
   * @param id The ID of the expenditure record to update
   * @param updatedExpenditure The new expenditure data
   * @return The updated expenditure record
   */
  @PutMapping("/{id}")
  public Expenditure updateExpenditure(
      @PathVariable Long id, @RequestBody Expenditure updatedExpenditure) {
    return service.updateExpenditure(id, updatedExpenditure);
  }

  /**
   * Deletes an expenditure record.
   *
   * @param id The ID of the expenditure record to delete
   */
  @DeleteMapping("/{id}")
  public void deleteExpenditure(@PathVariable Long id) {
    service.deleteExpenditure(id);
  }
}
