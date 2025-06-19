package com.yoni.financetracker.service;

import com.yoni.financetracker.dto.NetWorthDTO;
import com.yoni.financetracker.model.NetWorth;
import com.yoni.financetracker.repository.NetWorthRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for managing NetWorth entities. Handles business logic related to net worth
 * records, such as retrieving and saving net worth for a specific month and year.
 */
@Slf4j
@Service
public class NetWorthService {

  private final NetWorthRepository repo;

  /**
   * Constructs a NetWorthService with the given NetWorthRepository.
   *
   * @param repo the NetWorthRepository to use for data access
   */
  @Autowired
  public NetWorthService(NetWorthRepository repo) {
    this.repo = repo;
  }

  /**
   * Retrieves the net worth record for a specific year and month.
   *
   * @param year the year to filter net worth
   * @param month the month to filter net worth
   * @return the NetWorthDTO for the specified year and month, or null if not found
   */
  public NetWorthDTO getNetWorth(int year, int month) {
    log.info("Retrieving net worth for year: {}, month: {}", year, month);
    Optional<NetWorth> netWorthOpt = repo.findByYearAndMonth(year, month);
    if (netWorthOpt.isPresent()) {
      NetWorth nw = netWorthOpt.get();
      return new NetWorthDTO(
          nw.getId(), nw.getYear(), nw.getMonth(), nw.getAssets(), nw.getLiabilities());
    }
    return null;
  }

  /**
   * Saves a new net worth record or updates an existing one based on the provided NetWorthDTO.
   *
   * @param dto the NetWorthDTO containing net worth data
   * @return the saved NetWorthDTO
   */
  @Transactional
  public NetWorthDTO saveOrUpdateNetWorth(NetWorthDTO dto) {
    log.info("Saving or updating net worth: {}", dto);
    NetWorth netWorth =
        repo.findByYearAndMonth(dto.getYear(), dto.getMonth()).orElse(new NetWorth());
    netWorth.setYear(dto.getYear());
    netWorth.setMonth(dto.getMonth());
    netWorth.setAssets(dto.getAssets());
    netWorth.setLiabilities(dto.getLiabilities());
    NetWorth saved = repo.save(netWorth);
    log.info("Net worth saved with ID: {}", saved.getId());
    return new NetWorthDTO(
        saved.getId(),
        saved.getYear(),
        saved.getMonth(),
        saved.getAssets(),
        saved.getLiabilities());
  }

  /**
   * Retrieves all net worth records, ordered by year and month.
   *
   * @return list of NetWorthDTOs
   */
  public List<NetWorthDTO> getAllNetWorthHistory() {
    return repo.findAllByOrderByYearAscMonthAsc().stream()
        .map(
            nw ->
                new NetWorthDTO(
                    nw.getId(), nw.getYear(), nw.getMonth(), nw.getAssets(), nw.getLiabilities()))
        .collect(Collectors.toList());
  }

  /**
   * Retrieves net worth records in a given year/month range.
   *
   * @return list of NetWorthDTOs
   */
  public List<NetWorthDTO> getNetWorthHistoryInRange(
      int startYear, int startMonth, int endYear, int endMonth) {
    return repo
        .findByYearGreaterThanEqualAndYearLessThanEqualAndMonthGreaterThanEqualAndMonthLessThanEqualOrderByYearAscMonthAsc(
            startYear, endYear, startMonth, endMonth)
        .stream()
        .map(
            nw ->
                new NetWorthDTO(
                    nw.getId(), nw.getYear(), nw.getMonth(), nw.getAssets(), nw.getLiabilities()))
        .collect(Collectors.toList());
  }
}
