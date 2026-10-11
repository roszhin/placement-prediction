package com.roshin.placement.repository;

import com.roshin.placement.entity.Company;
import com.roshin.placement.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByIsActiveTrueOrderByCreatedAtDesc();
    List<Job> findAllByOrderByCreatedAtDesc();
    List<Job> findByCompany(Company company);
    List<Job> findByCompanyAndIsActiveTrueOrderByCreatedAtDesc(Company company);
    List<Job> findByCompanyIdAndIsActiveTrueOrderByCreatedAtDesc(Long companyId);

    @Query("SELECT j.company, COUNT(j) FROM Job j WHERE j.isActive = true GROUP BY j.company ORDER BY j.company.companyName ASC")
    List<Object[]> findCompaniesWithActiveJobCount();
}
