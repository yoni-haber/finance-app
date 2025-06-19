package com.yoni.financetracker.controller;

import com.yoni.financetracker.dto.NetWorthDTO;
import com.yoni.financetracker.service.NetWorthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing net worth operations. Handles HTTP requests for retrieving and
 * saving net worth data for a given month.
 *
 * <p>The @Slf4j annotation enables logging functionality. The @RestController annotation marks this
 * class as a REST controller. The @RequestMapping("/api/networth") annotation specifies the base
 * URL for all endpoints in this controller.
 */
@Slf4j
@RestController
@RequestMapping("/api/networth")
@Tag(name = "Net Worth", description = "Net worth management APIs")
public class NetWorthController {

  private final NetWorthService netWorthService;

  /** Constructor-based dependency injection for the NetWorthService. */
  public NetWorthController(NetWorthService netWorthService) {
    this.netWorthService = netWorthService;
  }

  /**
   * Retrieves net worth for a specific month.
   *
   * @param year The year to search in
   * @param month The month to search in (1-12)
   * @return ResponseEntity containing the net worth data
   */
  @GetMapping
  public ResponseEntity<NetWorthDTO> getNetWorth(@RequestParam int year, @RequestParam int month) {
    log.info("Fetching net worth for year: {} and month: {}", year, month);
    try {
      NetWorthDTO dto = netWorthService.getNetWorth(year, month);
      log.info("Net worth data: {}", dto);
      return ResponseEntity.ok(dto);
    } catch (Exception e) {
      log.error("Error fetching net worth", e);
      throw e;
    }
  }

  /**
   * Saves or updates net worth for a specific month.
   *
   * @param dto The net worth data transfer object
   * @return ResponseEntity containing the saved/updated net worth data
   */
  @PostMapping
  public ResponseEntity<NetWorthDTO> saveOrUpdateNetWorth(@RequestBody NetWorthDTO dto) {
    log.info("Saving/updating net worth: {}", dto);
    try {
      NetWorthDTO saved = netWorthService.saveOrUpdateNetWorth(dto);
      log.info("Successfully saved/updated net worth: {}", saved);
      return ResponseEntity.ok(saved);
    } catch (Exception e) {
      log.error("Error saving/updating net worth", e);
      throw e;
    }
  }

  /**
   * Retrieves net worth history for all time or a given range.
   *
   * @param startYear Optional start year
   * @param startMonth Optional start month
   * @param endYear Optional end year
   * @param endMonth Optional end month
   * @return List of NetWorthDTOs
   */
  @GetMapping("/history")
  public ResponseEntity<List<NetWorthDTO>> getNetWorthHistory(
      @RequestParam(required = false) Integer startYear,
      @RequestParam(required = false) Integer startMonth,
      @RequestParam(required = false) Integer endYear,
      @RequestParam(required = false) Integer endMonth) {
    log.info(
        "Fetching net worth history: startYear={}, startMonth={}, endYear={}, endMonth={}",
        startYear,
        startMonth,
        endYear,
        endMonth);
    List<NetWorthDTO> history;
    if (startYear != null && startMonth != null && endYear != null && endMonth != null) {
      history = netWorthService.getNetWorthHistoryInRange(startYear, startMonth, endYear, endMonth);
    } else {
      history = netWorthService.getAllNetWorthHistory();
    }
    return ResponseEntity.ok(history);
  }
}
