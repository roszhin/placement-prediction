package com.roshin.placement.service;

import com.roshin.placement.entity.Company;
import com.roshin.placement.entity.Job;
import com.roshin.placement.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompanyService {

    @Autowired
    private JobRepository jobRepository;

    @Transactional
    public Job createJob(Job job, Company company) {
        job.setCompany(company);
        job.setActive(true);
        return jobRepository.save(job);
    }
}
