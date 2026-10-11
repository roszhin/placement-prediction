package com.roshin.placement.controller;

import com.roshin.placement.dto.ResumeAnalysisDTO;
import com.roshin.placement.entity.Application;
import com.roshin.placement.entity.Job;
import com.roshin.placement.entity.Resume;
import com.roshin.placement.entity.Student;
import com.roshin.placement.repository.ApplicationRepository;
import com.roshin.placement.repository.JobRepository;
import com.roshin.placement.repository.ResumeRepository;
import com.roshin.placement.security.CustomUserDetails;
import com.roshin.placement.service.ResumeAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/student/jobs")
public class ResumeAnalysisController {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private com.roshin.placement.repository.AiAnalysisRepository aiAnalysisRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private com.roshin.placement.repository.StudentRepository studentRepository;

    @Autowired
    private ResumeAnalysisService resumeAnalysisService;

    @Autowired
    private com.roshin.placement.service.StudentService studentService;

    @Autowired
    private com.roshin.placement.service.AIService aiService;

    @PostMapping("/{jobId}/analyze")
    public ResponseEntity<?> analyzeResume(@PathVariable Long jobId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Student student = studentRepository.findById(userDetails.getUser().getId())
                    .orElse((Student) userDetails.getUser());
            Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

            Optional<Resume> activeResumeOpt = studentService.getActiveResumeForStudent(student);
            if (activeResumeOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please upload your resume first."));
            }
            Resume latestResume = activeResumeOpt.get();

            // Analyze using unified AIService (Multimodal Gemini with fallbacks)
            Map<String, Object> aiResult = aiService.analyzeProfileAgainstJob(student, job);

            double overallMatch = ((Number) aiResult.get("atsScore")).doubleValue();
            double skillMatch = ((Number) aiResult.get("skillMatchScore")).doubleValue();
            double eligibilityScore = ((Number) aiResult.get("eligibilityScore")).doubleValue();
            String missingSkillsStr = (String) aiResult.get("missingSkills");
            String aiFeedbackJson = (String) aiResult.get("aiFeedback");
            @SuppressWarnings("unchecked")
            List<String> matchedSkills = (List<String>) aiResult.get("matchedSkills");
            @SuppressWarnings("unchecked")
            List<String> missingSkills = (List<String>) aiResult.get("missingSkillsList");
            String recommendation = (String) aiResult.get("recommendation");

            // Fetch existing analysis or create new
            com.roshin.placement.entity.AiAnalysis analysis = aiAnalysisRepository.findByStudentIdAndJobId(student.getId(), job.getId())
                .orElse(new com.roshin.placement.entity.AiAnalysis());
            
            analysis.setJob(job);
            analysis.setStudent(student);
            analysis.setOverallMatch(overallMatch);
            analysis.setSkillMatchScore(skillMatch);
            analysis.setEligibilityScore(eligibilityScore);
            analysis.setMissingSkills(missingSkillsStr);
            analysis.setAiFeedback(aiFeedbackJson);
            analysis.setAnalysisDate(java.time.LocalDateTime.now());
            aiAnalysisRepository.save(analysis);

            // Also sync with existing Application if the student already applied
            Optional<Application> appOpt = applicationRepository.findByStudentIdAndJobId(student.getId(), job.getId());
            if (appOpt.isPresent()) {
                Application app = appOpt.get();
                app.setAtsScore(overallMatch);
                app.setSkillMatchScore(skillMatch);
                app.setEligibilityScore(eligibilityScore);
                app.setMissingSkills(missingSkillsStr);
                app.setAiFeedback(aiFeedbackJson);
                app.setResume(latestResume);
                applicationRepository.save(app);
            }

            ResumeAnalysisDTO analysisResponse = new ResumeAnalysisDTO();
            analysisResponse.setOverallMatch((int) Math.round(overallMatch));
            analysisResponse.setSkillMatch((int) Math.round(skillMatch));
            analysisResponse.setEligibilityScore((int) Math.round(eligibilityScore));
            analysisResponse.setMatchedSkills(matchedSkills != null ? matchedSkills : List.of());
            analysisResponse.setMissingSkills(missingSkills != null ? missingSkills : List.of());
            analysisResponse.setRecommendation(recommendation != null ? recommendation : "Analysis complete.");
            analysisResponse.setEligible(overallMatch >= 60);

            return ResponseEntity.ok(analysisResponse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{jobId}/application")
    public ResponseEntity<?> cancelApplication(@PathVariable Long jobId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Student student = studentRepository.findById(userDetails.getUser().getId())
                    .orElse((Student) userDetails.getUser());
            Optional<Application> appOpt = applicationRepository.findByStudentIdAndJobId(student.getId(), jobId);
            
            if (appOpt.isPresent()) {
                Application app = appOpt.get();
                if (!"APPLIED".equals(app.getStatus()) && !"UNDER_REVIEW".equals(app.getStatus()) && !"PREDICTED".equals(app.getStatus())) {
                    return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Cannot withdraw an application that has progressed past the initial stage."));
                }
                applicationRepository.delete(app);
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Application cancelled successfully.");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(404).body(Map.of("success", false, "message", "Application not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
