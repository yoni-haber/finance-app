package com.yoni.financetracker.service;

import com.yoni.financetracker.dto.LiabilityDTO;
import com.yoni.financetracker.model.Liability;
import com.yoni.financetracker.repository.LiabilityRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service class for managing Liability entities. Handles business logic related to liabilities,
 * such as retrieving, saving, and deleting liability records.
 */
@Slf4j
@Service
public class LiabilityService {

  private LiabilityRepository repo;

  /**
   * Constructs a LiabilityService with the given LiabilityRepository.
   *
   * @param repo the LiabilityRepository to use for data access
   */
  @Autowired
  public LiabilityService(LiabilityRepository repo) {
    this.repo = repo;
  }

  /**
   * Retrieves all liabilities for a specific year and month.
   *
   * @param year the year to filter liabilities
   * @param month the month to filter liabilities
   * @return a list of LiabilityDTOs for the specified year and month
   */
  public List<LiabilityDTO> getLiabilities(int year, int month) {
    log.info("Retrieving liabilities for year: {}, month: {}", year, month);
    return repo.findByYearAndMonth(year, month).stream()
        .map(
            l ->
                new LiabilityDTO(
                    l.getId(), l.getYear(), l.getMonth(), l.getAmount(), l.getComment()))
        .collect(Collectors.toList());
  }

  /**
   * Saves a new liability or updates an existing one based on the provided LiabilityDTO.
   *
   * @param dto the LiabilityDTO containing liability data
   * @return the saved LiabilityDTO
   */
  public LiabilityDTO saveLiability(LiabilityDTO dto) {
    log.info("Saving liability: {}", dto);
    Liability liability =
        new Liability(dto.getYear(), dto.getMonth(), dto.getAmount(), dto.getComment());
    if (dto.getId() != null) liability.setId(dto.getId());
    Liability saved = repo.save(liability);
    log.info("Liability saved with ID: {}", saved.getId());
    return new LiabilityDTO(
        saved.getId(), saved.getYear(), saved.getMonth(), saved.getAmount(), saved.getComment());
  }

  /**
   * Deletes a liability by its ID.
   *
   * @param id the ID of the liability to delete
   */
  public void deleteLiability(Long id) {
    log.info("Deleting liability with ID: {}", id);
    repo.deleteById(id);
  }
}
