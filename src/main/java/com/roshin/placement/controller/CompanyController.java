package com.roshin.placement.controller;

import com.roshin.placement.entity.Application;
import com.roshin.placement.entity.Company;
import com.roshin.placement.entity.Job;
import com.roshin.placement.entity.Resume;
import com.roshin.placement.repository.ApplicationRepository;
import com.roshin.placement.repository.JobRepository;
import com.roshin.placement.repository.ResumeRepository;
import com.roshin.placement.security.CustomUserDetails;
import com.roshin.placement.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/company")
public class CompanyController {

    @Autowired
    private com.roshin.placement.service.FileUploadService fileUploadService;

    @Autowired
    private com.roshin.placement.repository.CompanyRepository companyRepository;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private com.roshin.placement.repository.AiAnalysisRepository aiAnalysisRepository;

    @Autowired
    private com.roshin.placement.service.StudentService studentService;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private Company getFreshCompany(CustomUserDetails userDetails) {
        if (userDetails == null || userDetails.getUser() == null) return null;
        return companyRepository.findById(userDetails.getUser().getId())
                .orElse((Company) userDetails.getUser());
    }

    @GetMapping("/dashboard")
    public String dashboard(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Company company = getFreshCompany(userDetails);
        model.addAttribute("company", company);
        model.addAttribute("newJob", new Job());
        
        List<Job> jobs = jobRepository.findByCompany(company);
        model.addAttribute("jobs", jobs);
        
        // Calculate metrics
        long activeJobs = jobs.stream().filter(Job::isActive).count();
        
        List<Application> allApps = new ArrayList<>();
        for (Job job : jobs) {
            allApps.addAll(applicationRepository.findByJobId(job.getId()));
        }
        
        long newApps = allApps.stream().filter(a -> "APPLIED".equals(a.getStatus())).count();
        long shortlisted = allApps.stream().filter(a -> "SHORTLISTED".equals(a.getStatus())).count();
        long selected = allApps.stream().filter(a -> "SELECTED".equals(a.getStatus())).count();
        
        model.addAttribute("activeJobs", activeJobs);
        model.addAttribute("totalApplications", allApps.size());
        model.addAttribute("newApplications", newApps);
        model.addAttribute("shortlistedCandidates", shortlisted);
        model.addAttribute("selectedCandidates", selected);
        
        // Chart data: Applications per Job
        List<String> jobTitles = jobs.stream().map(Job::getJobTitle).collect(Collectors.toList());
        List<Long> appsPerJob = jobs.stream().map(j -> (long) applicationRepository.findByJobId(j.getId()).size()).collect(Collectors.toList());
        
        model.addAttribute("jobTitles", jobTitles);
        model.addAttribute("appsPerJob", appsPerJob);
        
        // Chart data: Status Distribution
        long rejected = allApps.stream().filter(a -> "REJECTED".equals(a.getStatus())).count();
        model.addAttribute("statusDistribution", List.of(newApps, shortlisted, selected, rejected));
        
        return "company/dashboard";
    }

    @GetMapping("/job/create")
    public String createJobForm(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Company company = (Company) userDetails.getUser();
        model.addAttribute("company", company);
        model.addAttribute("job", new Job());
        return "company/post-job";
    }

    @PostMapping("/post-job")
    public String postJob(@AuthenticationPrincipal CustomUserDetails userDetails, Job job, RedirectAttributes redirectAttributes) {
        try {
            Company company = getFreshCompany(userDetails);
            // Map legacy packageOffered string for compatibility
            if (job.getSalaryLpa() != null) {
                job.setPackageOffered(job.getSalaryLpa() + " LPA");
            }
            companyService.createJob(job, company);
            redirectAttributes.addFlashAttribute("success", "Job posted successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Failed to post job: " + e.getMessage());
        }
        return "redirect:/company/jobs";
    }
    
    @GetMapping("/jobs")
    public String manageJobs(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Company company = getFreshCompany(userDetails);
        model.addAttribute("company", company);
        model.addAttribute("newJob", new Job());
        
        List<Job> jobs = jobRepository.findByCompany(company);
        
        // Count applications for each job to show in the table
        Map<Long, Long> applicationCounts = new HashMap<>();
        for (Job j : jobs) {
            applicationCounts.put(j.getId(), (long) applicationRepository.findByJobId(j.getId()).size());
        }
        
        model.addAttribute("jobs", jobs);
        model.addAttribute("applicationCounts", applicationCounts);
        return "company/jobs";
    }

    @GetMapping("/job/{id}/edit")
    public String editJobForm(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails, Model model, RedirectAttributes redirectAttributes) {
        Company company = getFreshCompany(userDetails);
        Job job = jobRepository.findById(id).orElse(null);
        if (job != null && job.getCompany().getId().equals(company.getId())) {
            model.addAttribute("company", company);
            model.addAttribute("job", job);
            return "company/post-job"; // We will reuse post-job for editing
        }
        redirectAttributes.addFlashAttribute("error", "Invalid job.");
        return "redirect:/company/jobs";
    }

    @PostMapping("/job/{id}/edit")
    public String editJob(@PathVariable Long id, @ModelAttribute Job updatedJob, @AuthenticationPrincipal CustomUserDetails userDetails, RedirectAttributes redirectAttributes) {
        Company company = getFreshCompany(userDetails);
        Job job = jobRepository.findById(id).orElse(null);
        
        if (job != null && job.getCompany().getId().equals(company.getId())) {
            job.setJobTitle(updatedJob.getJobTitle());
            job.setRequiredSkills(updatedJob.getRequiredSkills());
            
            if (updatedJob.getSalaryLpa() != null) {
                job.setSalaryLpa(updatedJob.getSalaryLpa());
                job.setPackageOffered(updatedJob.getSalaryLpa() + " LPA");
            }
            
            job.setJobDescription(updatedJob.getJobDescription());
            job.setLocation(updatedJob.getLocation());
            job.setEligibilityCriteria(updatedJob.getEligibilityCriteria());
            
            // New Structured Fields
            job.setDepartment(updatedJob.getDepartment());
            job.setEmploymentType(updatedJob.getEmploymentType());
            job.setWorkMode(updatedJob.getWorkMode());
            job.setExperienceRequirement(updatedJob.getExperienceRequirement());
            job.setMinimumQualification(updatedJob.getMinimumQualification());
            job.setMinimumCgpa(updatedJob.getMinimumCgpa());
            job.setPreferredSkills(updatedJob.getPreferredSkills());
            job.setResponsibilities(updatedJob.getResponsibilities());
            job.setVacancies(updatedJob.getVacancies());
            job.setLastDateToApply(updatedJob.getLastDateToApply());
            
            jobRepository.save(job);
            redirectAttributes.addFlashAttribute("success", "Job updated successfully!");
        } else {
            redirectAttributes.addFlashAttribute("error", "Failed to update job.");
        }
        return "redirect:/company/jobs";
    }

    @PostMapping("/job/{id}/toggle-status")
    @ResponseBody
    public org.springframework.http.ResponseEntity<?> toggleJobStatus(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody(required = false) Map<String, Boolean> payload) {
        Company company = getFreshCompany(userDetails);
        Job job = jobRepository.findById(id).orElse(null);
        
        if (job != null && job.getCompany().getId().equals(company.getId())) {
            boolean isCurrentlyActive = job.isActive();
            boolean extendDeadline = payload != null && Boolean.TRUE.equals(payload.get("extendDeadline"));
            
            // Toggle status
            job.setActive(!isCurrentlyActive);
            
            // If reopening and extendDeadline is true, extend deadline by 14 days
            if (!isCurrentlyActive && extendDeadline) {
                job.setLastDateToApply(LocalDateTime.now().plusDays(14));
            }
            
            jobRepository.save(job);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("isActive", job.isActive());
            response.put("message", job.isActive() ? "Job reopened successfully." : "Job closed successfully.");
            return org.springframework.http.ResponseEntity.ok(response);
        } else {
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", "Failed to toggle job status."));
        }
    }

    @PostMapping("/job/{id}/delete")
    @org.springframework.transaction.annotation.Transactional
    public String deleteJob(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails, RedirectAttributes redirectAttributes) {
        Company company = getFreshCompany(userDetails);
        Job job = jobRepository.findById(id).orElse(null);
        
        if (job != null && job.getCompany().getId().equals(company.getId())) {
            List<Application> apps = applicationRepository.findByJobId(id);
            if (!apps.isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "This job has applications. Close the job instead.");
                return "redirect:/company/jobs";
            }
            
            // Clean up any AI analysis associated with this job before deleting
            aiAnalysisRepository.deleteByJob(job);
            
            jobRepository.delete(job);
            redirectAttributes.addFlashAttribute("success", "Job deleted successfully.");
        } else {
            redirectAttributes.addFlashAttribute("error", "Failed to delete job.");
        }
        return "redirect:/company/jobs";
    }
    
    // Feature 2: Applicant Management
    @GetMapping("/applicants")
    public String viewAllApplicants(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Company company = getFreshCompany(userDetails);
        
        List<Application> applicants = applicationRepository.findByJobCompanyOrderByAppliedAtDesc(company);
        
        // Find all active jobs for the company to use in the Job filter dropdown
        List<Job> activeJobs = jobRepository.findByCompany(company).stream()
                .filter(Job::isActive)
                .collect(Collectors.toList());
        
        model.addAttribute("company", company);
        model.addAttribute("applicants", applicants);
        model.addAttribute("activeJobs", activeJobs);
        return "company/applicants";
    }

    @GetMapping("/job/{jobId}/applicants")
    public String viewApplicants(@PathVariable Long jobId, @AuthenticationPrincipal CustomUserDetails userDetails, Model model, RedirectAttributes redirectAttributes) {
        Company company = getFreshCompany(userDetails);
        Job job = jobRepository.findById(jobId).orElse(null);
        
        if (job == null || !job.getCompany().getId().equals(company.getId())) {
            redirectAttributes.addFlashAttribute("error", "Invalid job selected.");
            return "redirect:/company/dashboard";
        }
        
        List<Application> applicants = applicationRepository.findByJobId(jobId);
        
        model.addAttribute("job", job);
        model.addAttribute("applicants", applicants);
        return "company/applicants"; // reusing the same template for job-specific view
    }
    
    @PostMapping("/application/{appId}/status")
    @ResponseBody
    public org.springframework.http.ResponseEntity<?> updateApplicationStatusAjax(@PathVariable Long appId, @RequestBody Map<String, String> payload, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Company company = getFreshCompany(userDetails);
        Application app = applicationRepository.findById(appId).orElse(null);
        
        if (app != null && app.getJob().getCompany().getId().equals(company.getId())) {
            String newStatus = payload.get("status");
            String currentStatus = app.getStatus();
            String rejectionReason = payload.get("rejectionReason");
            
            // State Machine Rules
            if ("SELECTED".equals(currentStatus) && "REJECTED".equals(newStatus)) {
                return org.springframework.http.ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", "Cannot reject a selected candidate."));
            }
            if ("REJECTED".equals(currentStatus) && "SELECTED".equals(newStatus)) {
                return org.springframework.http.ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", "Cannot select a rejected candidate."));
            }
            if ("SELECTED".equals(currentStatus)) {
                 return org.springframework.http.ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", "Candidate is already selected."));
            }
            
            app.setStatus(newStatus);
            app.setUpdatedAt(LocalDateTime.now());
            app.setStatusUpdatedAt(LocalDateTime.now());
            
            // Set timestamps based on new status
            switch (newStatus) {
                case "UNDER_REVIEW":
                    if (app.getUnderReviewAt() == null) app.setUnderReviewAt(LocalDateTime.now());
                    break;
                case "SHORTLISTED":
                    if (app.getShortlistedAt() == null) app.setShortlistedAt(LocalDateTime.now());
                    System.out.println("Email Notification: Application Shortlisted for student " + app.getStudent().getEmail());
                    break;
                case "SELECTED":
                    if (app.getSelectedAt() == null) app.setSelectedAt(LocalDateTime.now());
                    System.out.println("Email Notification: Application Selected for student " + app.getStudent().getEmail());
                    break;
                case "REJECTED":
                    if (app.getRejectedAt() == null) app.setRejectedAt(LocalDateTime.now());
                    if (rejectionReason != null) app.setRejectionReason(rejectionReason);
                    System.out.println("Email Notification: Application Rejected for student " + app.getStudent().getEmail());
                    break;
            }
            
            applicationRepository.save(app);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("status", newStatus);
            
            // Format timestamps for UI rendering if needed
            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
            if (app.getUnderReviewAt() != null) response.put("underReviewAt", app.getUnderReviewAt().format(formatter));
            if (app.getShortlistedAt() != null) response.put("shortlistedAt", app.getShortlistedAt().format(formatter));
            if (app.getSelectedAt() != null) response.put("selectedAt", app.getSelectedAt().format(formatter));
            if (app.getRejectedAt() != null) response.put("rejectedAt", app.getRejectedAt().format(formatter));
            if (app.getRejectionReason() != null) response.put("rejectionReason", app.getRejectionReason());
            
            System.out.println("Application ID: " + appId);
            System.out.println("Current Status: " + currentStatus);
            System.out.println("New Status: " + newStatus);
            System.out.println("Database Updated Successfully");
            
            return org.springframework.http.ResponseEntity.ok(response);
        }
        return org.springframework.http.ResponseEntity.status(403).body(java.util.Collections.singletonMap("error", "Unauthorized access."));
    }

    @PostMapping("/application/{appId}/notes")
    @ResponseBody
    public org.springframework.http.ResponseEntity<?> saveRecruiterNotes(@PathVariable Long appId, @RequestBody Map<String, String> payload, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Company company = getFreshCompany(userDetails);
        Application app = applicationRepository.findById(appId).orElse(null);
        
        if (app != null && app.getJob().getCompany().getId().equals(company.getId())) {
            app.setRecruiterNotes(payload.get("notes"));
            applicationRepository.save(app);
            return org.springframework.http.ResponseEntity.ok(java.util.Collections.singletonMap("success", true));
        }
        return org.springframework.http.ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", "Invalid application"));
    }

    @PostMapping("/application/{appId}/schedule-interview")
    @ResponseBody
    public org.springframework.http.ResponseEntity<?> scheduleInterview(@PathVariable Long appId, @RequestBody Map<String, String> payload, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Company company = getFreshCompany(userDetails);
        Application app = applicationRepository.findById(appId).orElse(null);
        
        if (app != null && app.getJob().getCompany().getId().equals(company.getId())) {
            app.setInterviewDate(payload.get("date"));
            app.setInterviewTime(payload.get("time"));
            app.setInterviewMode(payload.get("mode"));
            app.setInterviewLink(payload.get("link"));
            
            // Optionally update status to something like INTERVIEW_SCHEDULED if desired, but sticking to standard statuses
            
            applicationRepository.save(app);
            return org.springframework.http.ResponseEntity.ok(java.util.Collections.singletonMap("success", true));
        }
        return org.springframework.http.ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", "Invalid application"));
    }

    @PostMapping("/application/{appId}/send-email")
    @ResponseBody
    public org.springframework.http.ResponseEntity<?> sendEmail(@PathVariable Long appId, @RequestBody Map<String, String> payload, @AuthenticationPrincipal CustomUserDetails userDetails) {
        // Placeholder for actual email sending logic
        System.out.println("Simulating Email Sending to Application " + appId + ": " + payload.get("message"));
        return org.springframework.http.ResponseEntity.ok(java.util.Collections.singletonMap("success", true));
    }

    @PostMapping("/application/{appId}/request-documents")
    @ResponseBody
    public org.springframework.http.ResponseEntity<?> requestDocuments(@PathVariable Long appId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        // Placeholder for actual document request logic
        System.out.println("Simulating Document Request to Application " + appId);
        return org.springframework.http.ResponseEntity.ok(java.util.Collections.singletonMap("success", true));
    }

    // Feature 3: Resume Viewer
    @GetMapping("/resume/view/{id}")
    public ResponseEntity<byte[]> viewResume(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Resume resume = resumeRepository.findById(id).orElse(null);
        if (resume == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            byte[] fileBytes = studentService.getResumeFileBytes(resume);
            if (fileBytes == null || fileBytes.length == 0) {
                return ResponseEntity.notFound().build();
            }
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(resume.getFileType() != null ? resume.getFileType() : "application/pdf"));
            headers.setContentDispositionFormData("inline", resume.getFileName());
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/resume/download/{id}")
    public ResponseEntity<byte[]> downloadResume(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Resume resume = resumeRepository.findById(id).orElse(null);
        if (resume == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            byte[] fileBytes = studentService.getResumeFileBytes(resume);
            if (fileBytes == null || fileBytes.length == 0) {
                return ResponseEntity.notFound().build();
            }
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", resume.getFileName());
            return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Feature 4: Candidate Profile Viewer
    @GetMapping("/candidate/{appId}")
    public String candidateProfile(@PathVariable Long appId, @AuthenticationPrincipal CustomUserDetails userDetails, Model model, RedirectAttributes redirectAttributes) {
        Company company = getFreshCompany(userDetails);
        Application app = applicationRepository.findById(appId).orElse(null);
        
        if (app == null || !app.getJob().getCompany().getId().equals(company.getId())) {
            redirectAttributes.addFlashAttribute("error", "Invalid application profile.");
            return "redirect:/company/dashboard";
        }
        
        // Find active resume if not attached to application
        Resume latestResume = app.getResume();
        if (latestResume == null) {
            latestResume = studentService.getActiveResumeForStudent(app.getStudent()).orElse(null);
        }
        
        model.addAttribute("application", app);
        model.addAttribute("student", app.getStudent());
        model.addAttribute("resume", latestResume);
        
        return "company/candidate-profile";
    }
    @GetMapping("/profile")
    public String profile(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Company company = getFreshCompany(userDetails);
        model.addAttribute("company", company);
        return "company/profile";
    }

    @PostMapping("/profile")
    public String updateProfile(@AuthenticationPrincipal CustomUserDetails userDetails,
                                @ModelAttribute Company updatedCompany,
                                @RequestParam(required = false) String newPassword,
                                RedirectAttributes redirectAttributes) {
        Company company = getFreshCompany(userDetails);
        if (company != null) {
            company.setName(updatedCompany.getName());
            company.setCompanyName(updatedCompany.getCompanyName());
            company.setPhoneNumber(updatedCompany.getPhoneNumber());
            company.setWebsite(updatedCompany.getWebsite());
            company.setIndustry(updatedCompany.getIndustry());
            company.setAddress(updatedCompany.getAddress()); 
            company.setCompanySize(updatedCompany.getCompanySize());
            company.setFoundedYear(updatedCompany.getFoundedYear());
            company.setCompanyDescription(updatedCompany.getCompanyDescription());
            if (newPassword != null && !newPassword.trim().isEmpty()) {
                company.setPassword(passwordEncoder.encode(newPassword));
            }
            companyRepository.save(company);
            redirectAttributes.addFlashAttribute("success", "Profile updated successfully!");
        }
        return "redirect:/company/profile";
    }

    @PostMapping("/profile/picture")
    @ResponseBody
    public org.springframework.http.ResponseEntity<?> updateProfilePicture(@RequestParam("file") org.springframework.web.multipart.MultipartFile file, @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Company user = companyRepository.findById(userDetails.getUser().getId()).orElse(null);
            if (user != null) {
                String imageUrl = fileUploadService.saveProfilePicture(file);
                user.setProfilePicture(imageUrl);
                companyRepository.save(user);
                
                java.util.Map<String, String> response = new java.util.HashMap<>();
                response.put("success", "true");
                response.put("imageUrl", imageUrl);
                return org.springframework.http.ResponseEntity.ok(response);
            }
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", "User not found"));
        } catch (IllegalArgumentException e) {
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", e.getMessage()));
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(500).body(java.util.Collections.singletonMap("error", "Server exception: " + e.getMessage()));
        }
    }

    @PostMapping("/profile/picture/remove")
    @ResponseBody
    public org.springframework.http.ResponseEntity<?> removeProfilePicture(@AuthenticationPrincipal CustomUserDetails userDetails, @Autowired com.roshin.placement.repository.CompanyRepository companyRepository) {
        try {
            Company company = companyRepository.findById(userDetails.getUser().getId()).orElse(null);
            if (company != null) {
                company.setProfilePicture(null);
                companyRepository.save(company);
                return org.springframework.http.ResponseEntity.ok().build();
            }
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", "Failed to remove picture"));
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(500).body(java.util.Collections.singletonMap("error", "Server error"));
        }
    }
}
