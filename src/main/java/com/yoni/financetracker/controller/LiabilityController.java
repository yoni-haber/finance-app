package com.yoni.financetracker.controller;

import com.yoni.financetracker.dto.LiabilityDTO;
import com.yoni.financetracker.service.LiabilityService;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing liability-related operations. Handles HTTP requests for creating,
 * reading, and deleting liabilities.
 *
 * <p>The @Slf4j annotation enables logging functionality. The @RestController annotation marks this
 * class as a REST controller. The @RequestMapping("/api/liabilities") annotation specifies the base
 * URL for all endpoints in this controller.
 */
@Slf4j
@RestController
@RequestMapping("/api/liabilities")
@Tag(name = "Liability", description = "Liability management APIs")
public class LiabilityController {

  private final LiabilityService liabilityService;

  /** Constructor-based dependency injection for the LiabilityService. */
  public LiabilityController(LiabilityService liabilityService) {
    this.liabilityService = liabilityService;
  }

  /**
   * Retrieves all liabilities for a specific month.
   *
   * @param year The year to search in
   * @param month The month to search in (1-12)
   * @return ResponseEntity containing a list of liabilities
   */
  @GetMapping
  public ResponseEntity<List<LiabilityDTO>> getLiabilities(
      @RequestParam int year, @RequestParam int month) {
    log.info("Fetching liabilities for year: {} and month: {}", year, month);
    try {
      List<LiabilityDTO> liabilities = liabilityService.getLiabilities(year, month);
      log.info("Found {} liabilities", liabilities.size());
      return ResponseEntity.ok(liabilities);
    } catch (Exception e) {
      log.error("Error fetching liabilities", e);
      throw e;
    }
  }

  /**
   * Creates or updates a liability.
   *
   * @param dto The liability data transfer object
   * @return ResponseEntity containing the created/updated liability
   */
  @PostMapping
  public ResponseEntity<LiabilityDTO> saveLiability(@RequestBody LiabilityDTO dto) {
    log.info("Saving liability: {}", dto);
    try {
      LiabilityDTO saved = liabilityService.saveLiability(dto);
      log.info("Successfully saved liability: {}", saved);
      return ResponseEntity.ok(saved);
    } catch (Exception e) {
      log.error("Error saving liability", e);
      throw e;
    }
  }

  /**
   * Deletes a liability.
   *
   * @param id The ID of the liability to delete
   * @return ResponseEntity with no content if successful
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteLiability(@PathVariable Long id) {
    log.info("Deleting liability with id: {}", id);
    try {
      liabilityService.deleteLiability(id);
      log.info("Successfully deleted liability with id: {}", id);
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      log.error("Error deleting liability", e);
      throw e;
    }
  }
}
