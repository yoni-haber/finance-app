package com.yoni.financetracker.controller;

import com.yoni.financetracker.dto.AssetDTO;
import com.yoni.financetracker.service.AssetService;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for managing asset-related operations. Handles HTTP requests for creating,
 * reading, and deleting assets.
 *
 * <p>The @Slf4j annotation enables logging functionality. The @RestController annotation marks this
 * class as a REST controller. The @RequestMapping("/api/assets") annotation specifies the base URL
 * for all endpoints in this controller.
 */
@Tag(name = "Asset", description = "Asset management APIs")
@Slf4j
@RestController
@RequestMapping("/api/assets")
public class AssetController {

  private final AssetService assetService;

  /** Constructor-based dependency injection for the AssetService. */
  public AssetController(AssetService assetService) {
    this.assetService = assetService;
  }

  /**
   * Retrieves all assets for a specific month.
   *
   * @param year The year to search in
   * @param month The month to search in (1-12)
   * @return ResponseEntity containing a list of assets
   */
  @GetMapping
  public ResponseEntity<List<AssetDTO>> getAssets(@RequestParam int year, @RequestParam int month) {
    log.info("Fetching assets for year: {} and month: {}", year, month);
    try {
      List<AssetDTO> assets = assetService.getAssets(year, month);
      log.info("Found {} assets", assets.size());
      return ResponseEntity.ok(assets);
    } catch (Exception e) {
      log.error("Error fetching assets", e);
      throw e;
    }
  }

  /**
   * Creates or updates an asset.
   *
   * @param dto The asset data transfer object
   * @return ResponseEntity containing the created/updated asset
   */
  @PostMapping
  public ResponseEntity<AssetDTO> saveAsset(@RequestBody AssetDTO dto) {
    log.info("Saving asset: {}", dto);
    try {
      AssetDTO saved = assetService.saveAsset(dto);
      log.info("Successfully saved asset: {}", saved);
      return ResponseEntity.ok(saved);
    } catch (Exception e) {
      log.error("Error saving asset", e);
      throw e;
    }
  }

  /**
   * Deletes an asset.
   *
   * @param id The ID of the asset to delete
   * @return ResponseEntity with no content if successful
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteAsset(@PathVariable Long id) {
    log.info("Deleting asset with id: {}", id);
    try {
      assetService.deleteAsset(id);
      log.info("Successfully deleted asset with id: {}", id);
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      log.error("Error deleting asset", e);
      throw e;
    }
  }
}
