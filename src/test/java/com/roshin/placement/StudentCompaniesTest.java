package com.roshin.placement;

import com.roshin.placement.dto.CompanyCardDto;
import com.roshin.placement.entity.Company;
import com.roshin.placement.entity.Job;
import com.roshin.placement.entity.Role;
import com.roshin.placement.entity.Student;
import com.roshin.placement.repository.CompanyRepository;
import com.roshin.placement.repository.JobRepository;
import com.roshin.placement.repository.RoleRepository;
import com.roshin.placement.repository.StudentRepository;
import com.roshin.placement.security.CustomUserDetails;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class StudentCompaniesTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Test
    public void testViewCompaniesListingPage() throws Exception {
        Student student = studentRepository.findById(4L).orElseThrow();
        CustomUserDetails userDetails = new CustomUserDetails(student);

        MvcResult result = mockMvc.perform(get("/student/companies").with(user(userDetails)))
                .andExpect(status().isOk())
                .andExpect(model().attributeExists("companies"))
                .andExpect(model().attributeExists("totalCompanies"))
                .andExpect(model().attributeExists("totalOpenJobs"))
                .andReturn();

        @SuppressWarnings("unchecked")
        List<CompanyCardDto> companies = (List<CompanyCardDto>) result.getModelAndView().getModel().get("companies");
        assertNotNull(companies);

        // Every company shown must have at least one active open job
        for (CompanyCardDto card : companies) {
            assertTrue(card.getOpenJobCount() > 0, "Company in listing must have > 0 open jobs: " + card.getCompanyName());
            assertNotNull(card.getCompanyId());
            assertNotNull(card.getCompanyName());
        }
    }

    @Test
    public void testViewCompanyDetailsPageWithOpenJobs() throws Exception {
        Student student = studentRepository.findById(4L).orElseThrow();
        CustomUserDetails userDetails = new CustomUserDetails(student);

        // Find a company that has active jobs
        List<Object[]> activeCompanies = jobRepository.findCompaniesWithActiveJobCount();
        assertFalse(activeCompanies.isEmpty(), "At least one company with active jobs should exist");

        Company targetCompany = (Company) activeCompanies.get(0)[0];
        Long companyId = targetCompany.getId();

        MvcResult result = mockMvc.perform(get("/student/companies/" + companyId).with(user(userDetails)))
                .andExpect(status().isOk())
                .andExpect(model().attributeExists("company"))
                .andExpect(model().attributeExists("jobs"))
                .andExpect(model().attributeExists("appliedJobIds"))
                .andReturn();

        Company companyInModel = (Company) result.getModelAndView().getModel().get("company");
        assertEquals(companyId, companyInModel.getId());

        @SuppressWarnings("unchecked")
        List<Job> jobs = (List<Job>) result.getModelAndView().getModel().get("jobs");
        assertNotNull(jobs);
        assertFalse(jobs.isEmpty());

        // All returned jobs must be active
        for (Job j : jobs) {
            assertTrue(j.isActive(), "Jobs on company details page must be active");
            assertEquals(companyId, j.getCompany().getId());
        }
    }

    @Test
    public void testViewCompanyDetailsByName() throws Exception {
        Student student = studentRepository.findById(4L).orElseThrow();
        CustomUserDetails userDetails = new CustomUserDetails(student);

        List<Object[]> activeCompanies = jobRepository.findCompaniesWithActiveJobCount();
        assertFalse(activeCompanies.isEmpty());

        Company targetCompany = (Company) activeCompanies.get(0)[0];
        String companyName = targetCompany.getCompanyName();
        assertNotNull(companyName);

        mockMvc.perform(get("/student/companies/" + companyName).with(user(userDetails)))
                .andExpect(status().isOk())
                .andExpect(model().attributeExists("company"))
                .andExpect(model().attributeExists("jobs"));
    }

    @Test
    public void testCompanyWithZeroOpenJobsExcludedFromListing() throws Exception {
        Student student = studentRepository.findById(4L).orElseThrow();
        CustomUserDetails userDetails = new CustomUserDetails(student);

        // Create a temporary company with NO open jobs
        Role companyRole = roleRepository.findByName("ROLE_COMPANY").orElse(null);
        Company zeroJobCompany = new Company();
        zeroJobCompany.setName("Zero Job Test Corp");
        zeroJobCompany.setCompanyName("Zero Job Test Corp");
        zeroJobCompany.setEmail("zerojob_test_" + System.currentTimeMillis() + "@example.com");
        zeroJobCompany.setPassword("password123");
        zeroJobCompany.setActive(true);
        zeroJobCompany.setApproved(true);
        zeroJobCompany.setRole(companyRole);
        zeroJobCompany.setIndustry("Testing");
        zeroJobCompany = companyRepository.save(zeroJobCompany);

        // Also add an INACTIVE (closed) job to this company
        Job closedJob = new Job();
        closedJob.setCompany(zeroJobCompany);
        closedJob.setJobTitle("Closed Role");
        closedJob.setJobDescription("Test Description");
        closedJob.setActive(false); // Closed!
        closedJob = jobRepository.save(closedJob);

        try {
            // 1. Verify this company does NOT appear in /student/companies listing
            MvcResult listingResult = mockMvc.perform(get("/student/companies").with(user(userDetails)))
                    .andExpect(status().isOk())
                    .andReturn();

            @SuppressWarnings("unchecked")
            List<CompanyCardDto> companies = (List<CompanyCardDto>) listingResult.getModelAndView().getModel().get("companies");
            for (CompanyCardDto card : companies) {
                assertNotEquals(zeroJobCompany.getId(), card.getCompanyId(),
                        "Company with zero open jobs must not be in the companies listing");
            }

            // 2. Direct navigation to /student/companies/{id} must show empty state cleanly without crashing
            MvcResult detailResult = mockMvc.perform(get("/student/companies/" + zeroJobCompany.getId()).with(user(userDetails)))
                    .andExpect(status().isOk())
                    .andExpect(model().attributeExists("company"))
                    .andExpect(model().attributeExists("jobs"))
                    .andReturn();

            @SuppressWarnings("unchecked")
            List<Job> jobs = (List<Job>) detailResult.getModelAndView().getModel().get("jobs");
            assertTrue(jobs.isEmpty(), "Jobs list for company with 0 open jobs must be empty");

        } finally {
            // Cleanup
            jobRepository.delete(closedJob);
            companyRepository.delete(zeroJobCompany);
        }
    }
}
