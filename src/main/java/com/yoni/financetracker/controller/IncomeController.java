package com.yoni.financetracker.controller;

import com.yoni.financetracker.dto.IncomeDTO;
import com.yoni.financetracker.model.Income;
import com.yoni.financetracker.service.IncomeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing income-related operations. This controller handles HTTP requests for
 * creating, reading, updating, and deleting income records.
 *
 * <p>The @Tag annotation provides metadata for the Swagger/OpenAPI documentation.
 * The @RestController annotation marks this class as a REST controller.
 * The @RequestMapping("/api/income") annotation specifies the base URL for all endpoints in this
 * controller.
 */
@Slf4j
@Tag(name = "Income", description = "Income management APIs")
@RestController
@RequestMapping("/api/income")
public class IncomeController {

  private final IncomeService service;

  /**
   * Constructor-based dependency injection for the IncomeService. @Autowired is optional here as
   * Spring automatically injects dependencies when there's only one constructor.
   */
  @Autowired
  public IncomeController(IncomeService service) {
    this.service = service;
  }

  /**
   * Creates a new income record.
   *
   * @param incomeDTO The income data transfer object containing the income details
   * @return ResponseEntity containing the created income record
   */
  @Operation(summary = "Add new income", description = "Creates a new income record")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Income created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
      })
  @PostMapping
  public ResponseEntity<Income> addIncome(@Valid @RequestBody IncomeDTO incomeDTO) {
    Income income = new Income();
    income.setAmount(incomeDTO.getAmount());
    income.setDescription(incomeDTO.getDescription());
    income.setDate(incomeDTO.getDate());
    return ResponseEntity.ok(service.save(income));
  }

  /**
   * Retrieves all income records for a specific month.
   *
   * @param year The year to search in
   * @param month The month to search in (1-12)
   * @return ResponseEntity containing a list of income records
   */
  @Operation(
      summary = "Get income by month",
      description = "Retrieves all income records for a specific month")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved income records"),
        @ApiResponse(responseCode = "400", description = "Invalid month/year"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
      })
  @GetMapping
  public ResponseEntity<List<Income>> getIncomeByMonth(
      @Parameter(description = "Year of the income records") @RequestParam int year,
      @Parameter(description = "Month of the income records (1-12)") @RequestParam int month) {
    return ResponseEntity.ok(service.getByMonth(year, month));
  }

  /**
   * Calculates the total income for a specific month.
   *
   * @param year The year to calculate for
   * @param month The month to calculate for (1-12)
   * @return ResponseEntity containing the total income amount
   */
  @Operation(
      summary = "Get total income",
      description = "Calculates total income for a specific month")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Successfully calculated total income"),
        @ApiResponse(responseCode = "400", description = "Invalid month/year"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
      })
  @GetMapping("/total")
  public ResponseEntity<Double> getTotalIncome(
      @Parameter(description = "Year to calculate total income") @RequestParam int year,
      @Parameter(description = "Month to calculate total income (1-12)") @RequestParam int month) {
    return ResponseEntity.ok(service.getTotalIncome(year, month));
  }

  /**
   * Updates an existing income record.
   *
   * @param id The ID of the income record to update
   * @param incomeDTO The new income data
   * @return ResponseEntity containing the updated income record
   */
  @Operation(summary = "Update income", description = "Updates an existing income record")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Income updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "404", description = "Income not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
      })
  @PutMapping("/{id}")
  public ResponseEntity<Income> updateIncome(
      @Parameter(description = "ID of the income to update") @PathVariable Long id,
      @Valid @RequestBody IncomeDTO incomeDTO) {
    Income income = new Income();
    income.setAmount(incomeDTO.getAmount());
    income.setDescription(incomeDTO.getDescription());
    income.setDate(incomeDTO.getDate());
    return ResponseEntity.ok(service.updateIncome(id, income));
  }

  /**
   * Deletes an income record.
   *
   * @param id The ID of the income record to delete
   * @return ResponseEntity with no content if successful
   */
  @Operation(summary = "Delete income", description = "Deletes an income record")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Income deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Income not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
      })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteIncome(
      @Parameter(description = "ID of the income to delete") @PathVariable Long id) {
    service.deleteIncome(id);
    return ResponseEntity.ok().build();
  }
}
