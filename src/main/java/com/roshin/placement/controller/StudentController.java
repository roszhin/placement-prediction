package com.roshin.placement.controller;

import com.roshin.placement.entity.Student;
import com.roshin.placement.entity.Resume;
import com.roshin.placement.repository.ApplicationRepository;
import com.roshin.placement.repository.JobRepository;
import com.roshin.placement.repository.ResumeRepository;
import com.roshin.placement.repository.StudentRepository;
import com.roshin.placement.security.CustomUserDetails;
import com.roshin.placement.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.roshin.placement.entity.Application;
import com.roshin.placement.entity.Company;
import com.roshin.placement.entity.Job;
import com.roshin.placement.dto.CompanyCardDto;
import com.roshin.placement.dto.MatchedJobDto;
import com.roshin.placement.repository.CompanyRepository;
import com.roshin.placement.service.AIService;
import org.springframework.http.*;
import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/student")
public class StudentController {

    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

    @Autowired
    private com.roshin.placement.service.FileUploadService fileUploadService;

    @Autowired
    private StudentService studentService;
    
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private AIService aiService;

    @Autowired
    private com.roshin.placement.service.ResumeAnalysisService resumeAnalysisService;

    @Autowired
    private com.roshin.placement.repository.AiAnalysisRepository aiAnalysisRepository;

    @Autowired
    private CompanyRepository companyRepository;

    private Student getFreshStudent(CustomUserDetails userDetails) {
        if (userDetails == null || userDetails.getUser() == null) return null;
        return studentRepository.findById(userDetails.getUser().getId())
                .orElse((Student) userDetails.getUser());
    }

    @GetMapping("/dashboard")
    public String dashboard(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Student student = getFreshStudent(userDetails);
        model.addAttribute("student", student);
        
        List<Job> allJobs = jobRepository.findAllByOrderByCreatedAtDesc();
        model.addAttribute("jobs", allJobs);
        
        List<Application> allApps = applicationRepository.findByStudentOrderByAppliedAtDesc(student);
        List<Application> actualApps = allApps.stream()
                .filter(a -> !a.getStatus().equals("PREDICTED"))
                .collect(Collectors.toList());
        
        List<Long> appliedJobIds = actualApps.stream().map(a -> a.getJob().getId()).collect(Collectors.toList());
        model.addAttribute("appliedJobIds", appliedJobIds);
        
        model.addAttribute("applications", actualApps);
        
        // Calculate Metrics
        model.addAttribute("totalJobsAvailable", allJobs.size());
        model.addAttribute("jobsApplied", actualApps.size());
        
        long shortlisted = actualApps.stream().filter(a -> a.getStatus().equals("SHORTLISTED") || a.getStatus().equals("INTERVIEW_SCHEDULED")).count();
        long selected = actualApps.stream().filter(a -> a.getStatus().equals("SELECTED")).count();
        
        model.addAttribute("shortlistedCount", shortlisted);
        model.addAttribute("selectedCount", selected);
        // Calculate average placement score using AiAnalysis
        double avgPlacement = actualApps.stream().mapToDouble(a -> {
            com.roshin.placement.entity.AiAnalysis analysis = aiAnalysisRepository.findByStudentIdAndJobId(student.getId(), a.getJob().getId()).orElse(null);
            return analysis != null && analysis.getOverallMatch() != null ? analysis.getOverallMatch() : 0.0;
        }).filter(score -> score > 0.0).average().orElse(0.0);
        model.addAttribute("overallPlacementScore", Math.round(avgPlacement));
        
        // Calculate Profile Completion
        int completedFields = 0;
        int totalFields = 9;
        if (student.getName() != null && !student.getName().isEmpty()) completedFields++;
        if (student.getPhoneNumber() != null && !student.getPhoneNumber().isEmpty()) completedFields++;
        if (student.getAddress() != null && !student.getAddress().isEmpty()) completedFields++;
        if (student.getCourse() != null && !student.getCourse().isEmpty()) completedFields++;
        if (student.getDepartment() != null && !student.getDepartment().isEmpty()) completedFields++;
        if (student.getPassingYear() != null && !student.getPassingYear().isEmpty()) completedFields++;
        if (student.getCgpa() != null) completedFields++;
        if (student.getTechnicalSkills() != null && !student.getTechnicalSkills().isEmpty()) completedFields++;
        if (student.getProfilePicture() != null && !student.getProfilePicture().isEmpty()) completedFields++;
        
        int profileCompletion = (int) Math.round(((double) completedFields / totalFields) * 100);
        model.addAttribute("profileCompletion", profileCompletion);
        
        // Chart Data: Status Overview
        long appliedCount = actualApps.stream().filter(a -> a.getStatus().equals("APPLIED") || a.getStatus().equals("UNDER_REVIEW")).count();
        long rejectedCount = actualApps.stream().filter(a -> a.getStatus().equals("REJECTED")).count();
        model.addAttribute("statusOverview", List.of(appliedCount, shortlisted, selected, rejectedCount));
        
        // Chart Data: Skill Match Across Applied Jobs
        List<String> jobTitles = actualApps.stream().map(a -> a.getJob().getJobTitle()).limit(10).collect(Collectors.toList());
        List<Double> skillMatches = actualApps.stream().map(a -> {
            com.roshin.placement.entity.AiAnalysis analysis = aiAnalysisRepository.findByStudentIdAndJobId(student.getId(), a.getJob().getId()).orElse(null);
            return analysis != null && analysis.getSkillMatchScore() != null ? analysis.getSkillMatchScore() : 0.0;
        }).limit(10).collect(Collectors.toList());
        model.addAttribute("chartJobTitles", jobTitles);
        model.addAttribute("chartSkillMatches", skillMatches);
        
        return "student/dashboard";
    }

    @GetMapping("/jobs")
    public String viewAvailableJobs(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Student student = (Student) userDetails.getUser();
        List<Job> allJobs = jobRepository.findAllByOrderByCreatedAtDesc();
        
        List<Application> actualApps = applicationRepository.findByStudentOrderByAppliedAtDesc(student).stream()
                .filter(a -> !a.getStatus().equals("PREDICTED"))
                .collect(Collectors.toList());
        
        List<Long> appliedJobIds = actualApps.stream().map(a -> a.getJob().getId()).collect(Collectors.toList());
        
        model.addAttribute("jobs", allJobs);
        model.addAttribute("appliedJobIds", appliedJobIds);
        
        return "student/jobs";
    }

    @GetMapping("/jobs/matched")
    public String viewMatchedJobs(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Student student = getFreshStudent(userDetails);
        if (student == null) {
            return "redirect:/login";
        }

        // 1. Check if student has an active resume
        Optional<Resume> activeResumeOpt = studentService.getActiveResumeForStudent(student);
        if (activeResumeOpt.isEmpty()) {
            model.addAttribute("hasResume", false);
            model.addAttribute("matchedJobs", List.of());
            return "student/matched-jobs";
        }

        Resume activeResume = activeResumeOpt.get();
        model.addAttribute("hasResume", true);
        model.addAttribute("resume", activeResume);
        model.addAttribute("matchedJobs", List.of());

        // Instant response — analysis is triggered asynchronously via /student/jobs/matched/calculate
        return "student/matched-jobs";
    }

    /**
     * Dedicated asynchronous AJAX endpoint for calculating and ranking AI job matches.
     * Allows matched-jobs.html to render instantly with a loading experience while calculation runs.
     */
    @RequestMapping(value = "/jobs/matched/calculate", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public ResponseEntity<?> calculateMatchedJobsAsync(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Student student = getFreshStudent(userDetails);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "User session expired. Please log in again."));
        }

        Optional<Resume> activeResumeOpt = studentService.getActiveResumeForStudent(student);
        if (activeResumeOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "hasResume", false,
                    "message", "No active resume found.",
                    "matchedJobs", List.of()
            ));
        }

        List<MatchedJobDto> matchedJobs = calculateRankedMatchesForStudent(student);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "hasResume", true,
                "matchedJobs", matchedJobs,
                "count", matchedJobs.size()
        ));
    }

    public List<MatchedJobDto> calculateRankedMatchesForStudent(Student student) {
        // Fetch all active open jobs
        List<Job> openJobs = jobRepository.findByIsActiveTrueOrderByCreatedAtDesc();
        if (openJobs.isEmpty()) {
            return new ArrayList<>();
        }

        // Get applied jobs for this student
        List<Application> actualApps = applicationRepository.findByStudentOrderByAppliedAtDesc(student).stream()
                .filter(a -> !"PREDICTED".equals(a.getStatus()))
                .collect(Collectors.toList());
        List<Long> appliedJobIds = actualApps.stream().map(a -> a.getJob().getId()).collect(Collectors.toList());

        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        List<MatchedJobDto> matchedJobs = new ArrayList<>();

        for (Job job : openJobs) {
            com.roshin.placement.entity.AiAnalysis analysis = aiAnalysisRepository
                    .findByStudentIdAndJobId(student.getId(), job.getId())
                    .orElse(null);

            if (analysis == null) {
                try {
                    Map<String, Object> aiResult = aiService.analyzeProfileAgainstJob(student, job);
                    analysis = new com.roshin.placement.entity.AiAnalysis();
                    analysis.setJob(job);
                    analysis.setStudent(student);

                    Double atsScore = (Double) aiResult.get("atsScore");
                    Double eligibilityScore = (Double) aiResult.get("eligibilityScore");
                    Double skillMatchScore = (Double) aiResult.get("skillMatchScore");
                    String missingSkillsStr = (String) aiResult.get("missingSkills");
                    String feedback = (String) aiResult.get("aiFeedback");

                    analysis.setOverallMatch(atsScore != null ? atsScore : 50.0);
                    analysis.setEligibilityScore(eligibilityScore != null ? eligibilityScore : 50.0);
                    analysis.setSkillMatchScore(skillMatchScore != null ? skillMatchScore : 50.0);
                    analysis.setMissingSkills(missingSkillsStr != null ? missingSkillsStr : "None identified");
                    analysis.setAiFeedback(feedback != null && !feedback.isBlank() ? feedback : "Analysis completed.");
                    analysis.setAnalysisDate(LocalDateTime.now());
                    analysis = aiAnalysisRepository.save(analysis);
                } catch (Exception e) {
                    logger.error("Error analyzing job {} for student {}: {}", job.getId(), student.getId(), e.getMessage());
                    analysis = new com.roshin.placement.entity.AiAnalysis();
                    analysis.setJob(job);
                    analysis.setStudent(student);
                    analysis.setOverallMatch(50.0);
                    analysis.setEligibilityScore(60.0);
                    analysis.setSkillMatchScore(50.0);
                    analysis.setMissingSkills("None identified");
                    analysis.setAiFeedback("Analysis completed with basic profile match.");
                    analysis.setAnalysisDate(LocalDateTime.now());
                    analysis = aiAnalysisRepository.save(analysis);
                }
            }

            MatchedJobDto dto = new MatchedJobDto();
            dto.setJob(job);
            dto.setAnalysis(analysis);

            double score = analysis.getOverallMatch() != null ? analysis.getOverallMatch() : 0.0;
            dto.setScore(Math.round(score * 10.0) / 10.0);
            dto.setSkillMatchScore(analysis.getSkillMatchScore() != null ? Math.round(analysis.getSkillMatchScore() * 10.0) / 10.0 : 0.0);
            dto.setEligibilityScore(analysis.getEligibilityScore() != null ? Math.round(analysis.getEligibilityScore() * 10.0) / 10.0 : 0.0);
            dto.setApplied(appliedJobIds.contains(job.getId()));

            // Parse missing skills list
            if (analysis.getMissingSkills() != null && !analysis.getMissingSkills().isBlank()) {
                String[] ms = analysis.getMissingSkills().split(",");
                List<String> list = new ArrayList<>();
                for (String s : ms) {
                    String trimmed = s.trim();
                    if (!trimmed.isEmpty() && !trimmed.equalsIgnoreCase("None") && !trimmed.equalsIgnoreCase("None identified")) {
                        list.add(trimmed);
                    }
                }
                dto.setMissingSkills(list);
            }

            // Extract recommendation and matched skills if available
            String recommendation = "Analysis available.";
            if (analysis.getAiFeedback() != null && analysis.getAiFeedback().trim().startsWith("{")) {
                try {
                    Map<String, Object> aiDetails = mapper.readValue(analysis.getAiFeedback(), new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>(){});
                    if (aiDetails.get("recommendation") != null) {
                        recommendation = String.valueOf(aiDetails.get("recommendation"));
                    }
                    if (aiDetails.get("matchedSkills") instanceof List) {
                        @SuppressWarnings("unchecked")
                        List<String> ms = (List<String>) aiDetails.get("matchedSkills");
                        dto.setMatchedSkills(ms);
                    }
                } catch (Exception ignored) {}
            } else if (analysis.getAiFeedback() != null && !analysis.getAiFeedback().isBlank()) {
                recommendation = analysis.getAiFeedback();
            }
            dto.setRecommendation(recommendation);

            matchedJobs.add(dto);
        }

        // Sort descending by overall match score
        matchedJobs.sort(Comparator.comparingDouble(MatchedJobDto::getScore).reversed());

        // Assign ranks and badges
        for (int i = 0; i < matchedJobs.size(); i++) {
            MatchedJobDto dto = matchedJobs.get(i);
            int rank = i + 1;
            dto.setRank(rank);

            if (rank == 1 && dto.getScore() >= 70) {
                dto.setBadge("#1 Best Match");
                dto.setBadgeClass("badge bg-warning text-dark border border-warning shadow-sm");
            } else if (dto.getScore() >= 80) {
                dto.setBadge("Top Match");
                dto.setBadgeClass("badge bg-success bg-opacity-10 text-success border border-success border-opacity-25");
            } else if (dto.getScore() >= 65) {
                dto.setBadge("Good Match");
                dto.setBadgeClass("badge bg-info bg-opacity-10 text-info border border-info border-opacity-25");
            } else if (dto.getScore() >= 50) {
                dto.setBadge("Moderate Match");
                dto.setBadgeClass("badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25");
            } else {
                dto.setBadge("Low Match");
                dto.setBadgeClass("badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25");
            }
        }

        return matchedJobs;
    }

    @GetMapping("/companies")
    public String viewCompanies(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Student student = getFreshStudent(userDetails);
        if (student == null) {
            return "redirect:/login";
        }

        List<Object[]> results = jobRepository.findCompaniesWithActiveJobCount();
        List<CompanyCardDto> companies = new ArrayList<>();
        long totalOpenJobs = 0;
        for (Object[] row : results) {
            Company company = (Company) row[0];
            long jobCount = ((Number) row[1]).longValue();
            companies.add(new CompanyCardDto(company, jobCount));
            totalOpenJobs += jobCount;
        }

        model.addAttribute("student", student);
        model.addAttribute("companies", companies);
        model.addAttribute("totalCompanies", companies.size());
        model.addAttribute("totalOpenJobs", totalOpenJobs);

        return "student/companies";
    }

    @GetMapping("/companies/{identifier}")
    public String viewCompanyDetails(@PathVariable String identifier,
                                     @AuthenticationPrincipal CustomUserDetails userDetails,
                                     Model model) {
        Student student = getFreshStudent(userDetails);
        if (student == null) {
            return "redirect:/login";
        }

        Company company = null;
        try {
            Long id = Long.parseLong(identifier);
            company = companyRepository.findById(id).orElse(null);
        } catch (NumberFormatException ignored) {}

        if (company == null) {
            company = companyRepository.findByCompanyNameIgnoreCase(identifier).orElse(null);
        }

        if (company == null) {
            return "redirect:/student/companies";
        }

        List<Job> openJobs = jobRepository.findByCompanyIdAndIsActiveTrueOrderByCreatedAtDesc(company.getId());

        List<Application> actualApps = applicationRepository.findByStudentOrderByAppliedAtDesc(student).stream()
                .filter(a -> !a.getStatus().equals("PREDICTED"))
                .collect(Collectors.toList());
        List<Long> appliedJobIds = actualApps.stream().map(a -> a.getJob().getId()).collect(Collectors.toList());

        model.addAttribute("student", student);
        model.addAttribute("company", company);
        model.addAttribute("jobs", openJobs);
        model.addAttribute("appliedJobIds", appliedJobIds);

        return "student/company-details";
    }

    @GetMapping("/applications")
    public String myApplications(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Student student = getFreshStudent(userDetails);
        List<Application> applications = applicationRepository.findByStudentOrderByAppliedAtDesc(student).stream()
                .filter(a -> !a.getStatus().equals("PREDICTED"))
                .collect(Collectors.toList());
        
        java.util.Map<Long, Double> aiScores = new java.util.HashMap<>();
        for (Application app : applications) {
            com.roshin.placement.entity.AiAnalysis analysis = aiAnalysisRepository.findByStudentIdAndJobId(student.getId(), app.getJob().getId()).orElse(null);
            if (analysis != null && analysis.getOverallMatch() != null) {
                aiScores.put(app.getId(), Math.round(analysis.getOverallMatch() * 10.0) / 10.0);
            }
        }
        
        model.addAttribute("aiScores", aiScores);
        model.addAttribute("applications", applications);
        return "student/applications";
    }
    
    @PostMapping("/application/{appId}/withdraw")
    public String withdrawApplication(@PathVariable Long appId, @AuthenticationPrincipal CustomUserDetails userDetails, RedirectAttributes redirectAttributes) {
        Student student = getFreshStudent(userDetails);
        Application app = applicationRepository.findById(appId).orElseThrow();
        
        if (app.getStudent().getId().equals(student.getId())) {
            if (app.getStatus().equals("APPLIED") || app.getStatus().equals("UNDER_REVIEW") || app.getStatus().equals("PREDICTED")) {
                applicationRepository.delete(app);
                redirectAttributes.addFlashAttribute("success", "Application successfully withdrawn.");
            } else {
                redirectAttributes.addFlashAttribute("error", "Cannot withdraw an application that has progressed past the initial stage.");
            }
        }
        return "redirect:/student/applications";
    }

    @GetMapping("/job/{jobId}")
    public String viewJobDetails(@PathVariable Long jobId, @AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Student student = getFreshStudent(userDetails);
        Job job = jobRepository.findById(jobId).orElseThrow();
        
        java.util.Optional<Application> appOpt = applicationRepository.findByStudentIdAndJobId(student.getId(), job.getId());
        Application existingApp = appOpt.orElse(null);
        
        // Ignore legacy AI Analysis records that were stored as PREDICTED applications
        if (existingApp != null && "PREDICTED".equals(existingApp.getStatus())) {
            existingApp = null;
        }
        
        boolean isApplied = (existingApp != null);
        model.addAttribute("isApplied", isApplied);
        
        // Fetch AI Analysis separately
        com.roshin.placement.entity.AiAnalysis aiAnalysis = aiAnalysisRepository.findByStudentIdAndJobId(student.getId(), job.getId()).orElse(null);
        
        String recommendationText = "Analysis not available.";
        if (aiAnalysis != null && aiAnalysis.getAiFeedback() != null && aiAnalysis.getAiFeedback().trim().startsWith("{")) {
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                Map<String, Object> aiDetails = mapper.readValue(aiAnalysis.getAiFeedback(), new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>(){});
                model.addAttribute("aiDetails", aiDetails);
                if (aiDetails.get("recommendation") != null) {
                    recommendationText = String.valueOf(aiDetails.get("recommendation"));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else if (aiAnalysis != null && aiAnalysis.getAiFeedback() != null && !aiAnalysis.getAiFeedback().isBlank()) {
            recommendationText = aiAnalysis.getAiFeedback();
        }
        model.addAttribute("recommendationText", recommendationText);
        
        boolean hasResume = studentService.getActiveResumeForStudent(student).isPresent();
        model.addAttribute("hasResume", hasResume);
        
        model.addAttribute("job", job);
        model.addAttribute("application", existingApp);
        model.addAttribute("aiAnalysis", aiAnalysis);
        model.addAttribute("student", student);
        
        return "student/job-details";
    }

    @PostMapping("/predict/{jobId}")
    public String predict(@PathVariable Long jobId, @AuthenticationPrincipal CustomUserDetails userDetails, RedirectAttributes redirectAttributes) {
        Student student = getFreshStudent(userDetails);
        Job job = jobRepository.findById(jobId).orElseThrow();

        if (student.getTechnicalSkills() == null || student.getTechnicalSkills().trim().isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Please complete your Profile (Technical Skills) before predicting.");
            return "redirect:/student/profile";
        }

        try {
            Map<String, Object> aiResult = aiService.analyzeProfileAgainstJob(student, job);

            com.roshin.placement.entity.AiAnalysis analysis = aiAnalysisRepository.findByStudentIdAndJobId(student.getId(), job.getId())
                .orElse(new com.roshin.placement.entity.AiAnalysis());
            analysis.setJob(job);
            analysis.setStudent(student);
            analysis.setOverallMatch((Double) aiResult.get("atsScore"));
            analysis.setEligibilityScore((Double) aiResult.get("eligibilityScore"));
            analysis.setSkillMatchScore((Double) aiResult.get("skillMatchScore"));
            analysis.setMissingSkills((String) aiResult.get("missingSkills"));
            String feedback = (String) aiResult.get("aiFeedback");
            if (feedback == null || feedback.isBlank()) {
                feedback = "Analysis unavailable — please re-analyze.";
            }
            analysis.setAiFeedback(feedback);

            aiAnalysisRepository.save(analysis);

            return "redirect:/student/job/" + jobId;
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Prediction failed: " + e.getMessage());
            return "redirect:/student/dashboard";
        }
    }

    @GetMapping("/predict-result/{appId}")
    public String predictResult(@PathVariable Long appId) {
        // Keeping endpoint for backward compatibility, redirect to details
        return "redirect:/student/application/" + appId + "/details";
    }
    
    @GetMapping("/application/{appId}/details")
    public String applicationDetails(@PathVariable Long appId, @AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Application app = applicationRepository.findById(appId).orElseThrow();
        Student student = getFreshStudent(userDetails);
        
        if (!app.getStudent().getId().equals(student.getId())) {
            return "redirect:/student/dashboard";
        }

        // Fetch AI Analysis separately
        com.roshin.placement.entity.AiAnalysis aiAnalysis = aiAnalysisRepository.findByStudentIdAndJobId(student.getId(), app.getJob().getId()).orElse(null);

        if (aiAnalysis != null && aiAnalysis.getAiFeedback() != null && aiAnalysis.getAiFeedback().trim().startsWith("{")) {
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                Map<String, Object> aiDetails = mapper.readValue(aiAnalysis.getAiFeedback(), new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>(){});
                model.addAttribute("aiDetails", aiDetails);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        model.addAttribute("application", app);
        model.addAttribute("aiAnalysis", aiAnalysis);
        model.addAttribute("student", student);
        model.addAttribute("job", app.getJob());
        model.addAttribute("company", app.getJob().getCompany());
        return "student/application-details";
    }

    @PostMapping("/jobs/{jobId}/apply")
    public String applyForJob(@PathVariable Long jobId, @AuthenticationPrincipal CustomUserDetails userDetails, RedirectAttributes redirectAttributes) {
        Student student = getFreshStudent(userDetails);
        Job job = jobRepository.findById(jobId).orElseThrow();
        
        Resume latestResume = studentService.getActiveResumeForStudent(student).orElse(null);
        
        java.util.Optional<Application> appOpt = applicationRepository.findByStudentIdAndJobId(student.getId(), jobId);
        
        Application app = appOpt.orElseGet(Application::new);
        app.setJob(job);
        app.setStudent(student);
        if (latestResume != null) {
            app.setResume(latestResume);
        }
        
        // Link existing or computed AI analysis
        java.util.Optional<com.roshin.placement.entity.AiAnalysis> analysisOpt = aiAnalysisRepository.findByStudentIdAndJobId(student.getId(), jobId);
        if (analysisOpt.isPresent()) {
            com.roshin.placement.entity.AiAnalysis analysis = analysisOpt.get();
            app.setAtsScore(analysis.getOverallMatch());
            app.setEligibilityScore(analysis.getEligibilityScore());
            app.setSkillMatchScore(analysis.getSkillMatchScore());
            app.setMissingSkills(analysis.getMissingSkills() != null ? analysis.getMissingSkills() : "None identified");
            app.setAiFeedback(analysis.getAiFeedback() != null ? analysis.getAiFeedback() : "AI evaluation completed.");
        } else if (latestResume != null) {
            try {
                com.roshin.placement.dto.ResumeAnalysisDTO analysisDto = resumeAnalysisService.analyzeResume(student, job, latestResume);
                app.setAtsScore((double) analysisDto.getOverallMatch());
                app.setEligibilityScore((double) analysisDto.getEligibilityScore());
                app.setSkillMatchScore((double) analysisDto.getSkillMatch());
                app.setMissingSkills(analysisDto.getMissingSkills() != null ? String.join(", ", analysisDto.getMissingSkills()) : "None identified");
                app.setAiFeedback(analysisDto.getRecommendation());
                
                // Save AI Analysis record
                com.roshin.placement.entity.AiAnalysis newAnalysis = new com.roshin.placement.entity.AiAnalysis();
                newAnalysis.setJob(job);
                newAnalysis.setStudent(student);
                newAnalysis.setOverallMatch((double) analysisDto.getOverallMatch());
                newAnalysis.setEligibilityScore((double) analysisDto.getEligibilityScore());
                newAnalysis.setSkillMatchScore((double) analysisDto.getSkillMatch());
                newAnalysis.setMissingSkills(app.getMissingSkills());
                String feedback = app.getAiFeedback();
                if (feedback == null || feedback.isBlank()) {
                    feedback = "Analysis unavailable — please re-analyze.";
                }
                newAnalysis.setAiFeedback(feedback);
                aiAnalysisRepository.save(newAnalysis);
            } catch (Exception e) {
                app.setAtsScore(75.0);
                app.setEligibilityScore(80.0);
                app.setSkillMatchScore(75.0);
                app.setMissingSkills("None identified");
                app.setAiFeedback("Application submitted with resume.");
            }
        } else {
            app.setAtsScore(50.0);
            app.setEligibilityScore(60.0);
            app.setSkillMatchScore(50.0);
            app.setMissingSkills("Resume not yet uploaded");
            app.setAiFeedback("Please upload a resume in your profile for a full AI evaluation.");
        }

        app.setStatus("APPLIED");
        app.setUpdatedAt(LocalDateTime.now());
        app = applicationRepository.save(app);
        
        redirectAttributes.addFlashAttribute("success", "Successfully applied for " + app.getJob().getJobTitle() + "!");
        return "redirect:/student/job/" + jobId;
    }

    @GetMapping("/profile")
    public String profile(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Student student = getFreshStudent(userDetails);
        model.addAttribute("student", student);
        
        studentService.getActiveResumeForStudent(student)
                .ifPresent(r -> model.addAttribute("latestResume", r));
        
        return "student/profile";
    }

    /**
     * Dedicated AJAX endpoint for uploading and replacing a student's resume.
     * Provides immediate feedback and saves file to disk and DB.
     */
    @PostMapping("/profile/resume")
    @ResponseBody
    public ResponseEntity<?> uploadResumeAsync(@RequestParam("resumeFile") MultipartFile resumeFile,
                                              @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Student currentStudent = getFreshStudent(userDetails);
            if (currentStudent == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "User session expired. Please log in again."));
            }

            Resume savedResume = studentService.saveAndReplaceResume(currentStudent.getId(), resumeFile);

            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("message", "Resume uploaded and saved successfully!");
            resp.put("resumeId", savedResume.getId());
            resp.put("resumeFileName", savedResume.getFileName());
            resp.put("downloadUrl", "/student/resume/" + savedResume.getId() + "/download");
            resp.put("viewUrl", "/student/resume/" + savedResume.getId() + "/view");
            return ResponseEntity.ok(resp);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Resume upload failed: " + e.getMessage()));
        }
    }

    @PostMapping("/profile/update")
    public Object updateProfile(@RequestParam(value = "file", required = false) MultipartFile file,
                                @RequestParam(value = "resumeFile", required = false) MultipartFile resumeFile,
                                @ModelAttribute Student updatedStudent,
                                @AuthenticationPrincipal CustomUserDetails userDetails,
                                HttpServletRequest request,
                                RedirectAttributes redirectAttributes) {
        boolean isAjax = "XMLHttpRequest".equalsIgnoreCase(request.getHeader("X-Requested-With"))
                || (request.getHeader("Accept") != null && request.getHeader("Accept").contains("application/json"));

        try {
            Student currentStudent = getFreshStudent(userDetails);
            if (currentStudent == null) {
                if (isAjax) {
                    Map<String, Object> errResp = new HashMap<>();
                    errResp.put("success", false);
                    errResp.put("message", "User session expired. Please log in again.");
                    return ResponseEntity.status(401).body(errResp);
                }
                return "redirect:/login";
            }

            // Optional profile picture update via file parameter if supplied
            if (file != null && !file.isEmpty()) {
                String imgUrl = fileUploadService.saveProfilePicture(file);
                currentStudent.setProfilePicture(imgUrl);
                studentRepository.save(currentStudent);
            }

            Resume savedResume = studentService.updateStudentProfile(currentStudent.getId(), updatedStudent, resumeFile);

            if (isAjax) {
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", true);
                resp.put("message", "Profile updated successfully!");
                if (savedResume != null) {
                    resp.put("resumeFileName", savedResume.getFileName());
                    resp.put("resumeId", savedResume.getId());
                    resp.put("downloadUrl", "/student/resume/" + savedResume.getId() + "/download");
                    resp.put("viewUrl", "/student/resume/" + savedResume.getId() + "/view");
                }
                return ResponseEntity.ok(resp);
            }

            redirectAttributes.addFlashAttribute("success", "Profile updated successfully!");
        } catch (Exception e) {
            if (isAjax) {
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", false);
                resp.put("message", "Failed to update profile: " + e.getMessage());
                return ResponseEntity.badRequest().body(resp);
            }
            redirectAttributes.addFlashAttribute("error", "Failed to update profile: " + e.getMessage());
        }
        return "redirect:/student/profile";
    }

    @GetMapping("/resume/{id}/download")
    public ResponseEntity<byte[]> downloadResumeById(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Student currentStudent = getFreshStudent(userDetails);
        if (currentStudent == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Resume resume = resumeRepository.findById(id).orElse(null);
        if (resume == null) {
            return ResponseEntity.notFound().build();
        }
        // Strict student ownership check: Student can only download their own resume
        if (!resume.getStudent().getId().equals(currentStudent.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            byte[] data = studentService.getResumeFileBytes(resume);
            if (data == null || data.length == 0) {
                return ResponseEntity.notFound().build();
            }
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.attachment().filename(resume.getFileName()).build());
            headers.setCacheControl(CacheControl.noCache().mustRevalidate());
            return new ResponseEntity<>(data, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/resume/download")
    public ResponseEntity<byte[]> downloadCurrentResume(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Student currentStudent = getFreshStudent(userDetails);
        if (currentStudent == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<Resume> activeOpt = studentService.getActiveResumeForStudent(currentStudent);
        if (activeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return downloadResumeById(activeOpt.get().getId(), userDetails);
    }

    @GetMapping("/resume/{id}/view")
    public ResponseEntity<byte[]> viewResumeById(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Student currentStudent = getFreshStudent(userDetails);
        if (currentStudent == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Resume resume = resumeRepository.findById(id).orElse(null);
        if (resume == null) {
            return ResponseEntity.notFound().build();
        }
        // Strict student ownership check: Student can only view their own resume
        if (!resume.getStudent().getId().equals(currentStudent.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            byte[] data = studentService.getResumeFileBytes(resume);
            if (data == null || data.length == 0) {
                return ResponseEntity.notFound().build();
            }
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.inline().filename(resume.getFileName()).build());
            headers.setCacheControl(CacheControl.noCache().mustRevalidate());
            return new ResponseEntity<>(data, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/resume/view")
    public ResponseEntity<byte[]> viewCurrentResume(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Student currentStudent = getFreshStudent(userDetails);
        if (currentStudent == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<Resume> activeOpt = studentService.getActiveResumeForStudent(currentStudent);
        if (activeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return viewResumeById(activeOpt.get().getId(), userDetails);
    }
    @PostMapping("/profile/picture")
    @ResponseBody
    public org.springframework.http.ResponseEntity<?> updateProfilePicture(@RequestParam("file") org.springframework.web.multipart.MultipartFile file, @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Student user = studentRepository.findById(userDetails.getUser().getId()).orElse(null);
            if (user != null) {
                String imageUrl = fileUploadService.saveProfilePicture(file);
                user.setProfilePicture(imageUrl);
                studentRepository.save(user);
                
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
    public org.springframework.http.ResponseEntity<?> removeProfilePicture(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Student student = studentRepository.findById(userDetails.getUser().getId()).orElse(null);
            if (student != null) {
                student.setProfilePicture(null);
                studentRepository.save(student);
                return org.springframework.http.ResponseEntity.ok().build();
            }
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", "Failed to remove picture"));
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(500).body(java.util.Collections.singletonMap("error", "Server error"));
        }
    }
}
