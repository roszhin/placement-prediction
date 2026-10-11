package com.roshin.placement.service;

import com.roshin.placement.entity.Application;
import com.roshin.placement.entity.Job;
import com.roshin.placement.entity.Student;
import com.roshin.placement.repository.ApplicationRepository;
import com.roshin.placement.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private AIService aiService;

    @Transactional
    public Application applyForJob(Long jobId, Student student) throws Exception {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new Exception("Job not found"));
                
        if (student.getTechnicalSkills() == null || student.getTechnicalSkills().isEmpty()) {
            throw new Exception("You must complete your profile (Technical Skills) before applying.");
        }
        
        // Call AI
        Map<String, Object> aiResults = aiService.analyzeProfileAgainstJob(student, job);
        
        // Save Application
        Application application = new Application();
        application.setJob(job);
        application.setStudent(student);
        
        application.setAtsScore((Double) aiResults.get("atsScore"));
        application.setEligibilityScore((Double) aiResults.get("eligibilityScore"));
        application.setSkillMatchScore((Double) aiResults.get("skillMatchScore"));
        application.setMissingSkills((String) aiResults.get("missingSkills"));
        application.setAiFeedback((String) aiResults.get("aiFeedback"));
        
        return applicationRepository.save(application);
    }
}
