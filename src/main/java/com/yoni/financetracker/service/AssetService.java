package com.yoni.financetracker.service;

import com.yoni.financetracker.dto.AssetDTO;
import com.yoni.financetracker.model.Asset;
import com.yoni.financetracker.repository.AssetRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service class for managing Asset entities. Handles business logic related to assets, such as
 * retrieving, saving, and deleting asset records.
 */
@Slf4j
@Service
public class AssetService {

  private AssetRepository repo;

  /**
   * Constructs an AssetService with the given AssetRepository.
   *
   * @param repo the AssetRepository to use for data access
   */
  @Autowired
  public AssetService(AssetRepository repo) {
    this.repo = repo;
  }

  /**
   * Retrieves all assets for a specific year and month.
   *
   * @param year the year to filter assets
   * @param month the month to filter assets
   * @return a list of AssetDTOs for the specified year and month
   */
  public List<AssetDTO> getAssets(int year, int month) {
    log.info("Retrieving assets for year: {}, month: {}", year, month);
    return repo.findByYearAndMonth(year, month).stream()
        .map(a -> new AssetDTO(a.getId(), a.getYear(), a.getMonth(), a.getAmount(), a.getComment()))
        .collect(Collectors.toList());
  }

  /**
   * Saves a new asset or updates an existing one based on the provided AssetDTO.
   *
   * @param dto the AssetDTO containing asset data
   * @return the saved AssetDTO
   */
  public AssetDTO saveAsset(AssetDTO dto) {
    log.info("Saving asset: {}", dto);
    Asset asset = new Asset(dto.getYear(), dto.getMonth(), dto.getAmount(), dto.getComment());
    if (dto.getId() != null) asset.setId(dto.getId());
    Asset saved = repo.save(asset);
    log.info("Asset saved with ID: {}", saved.getId());
    return new AssetDTO(
        saved.getId(), saved.getYear(), saved.getMonth(), saved.getAmount(), saved.getComment());
  }

  /**
   * Deletes an asset by its ID.
   *
   * @param id the ID of the asset to delete
   */
  public void deleteAsset(Long id) {
    log.info("Deleting asset with ID: {}", id);
    repo.deleteById(id);
  }
}
