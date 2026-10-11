package com.roshin.placement.service;

import com.roshin.placement.dto.ResumeAnalysisDTO;
import com.roshin.placement.entity.Job;
import com.roshin.placement.entity.Resume;
import com.roshin.placement.entity.Student;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class ResumeAnalysisService {

    public ResumeAnalysisDTO analyzeResume(Student student, Job job, Resume resume) {
        String resumeText = extractTextFromPDF(resume.getFileData());
        // Guard against null/empty extracted text
        if (resumeText == null || resumeText.isBlank()) {
            resumeText = "";
        }
        String normalizedResumeText = resumeText.toLowerCase();

        // 1. Skill Match Logic
        String rawSkills = job.getRequiredSkills();
        List<String> requiredSkills = (rawSkills != null && !rawSkills.isBlank())
                ? Arrays.asList(rawSkills.split(","))
                : new ArrayList<>();
        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        for (String skill : requiredSkills) {
            String trimmedSkill = skill.trim();
            if (trimmedSkill.isEmpty()) continue;
            
            // Basic substring search for skill matching
            if (normalizedResumeText.contains(trimmedSkill.toLowerCase())) {
                matchedSkills.add(trimmedSkill);
            } else {
                missingSkills.add(trimmedSkill);
            }
        }

        int totalSkills = matchedSkills.size() + missingSkills.size();
        int skillMatchScore = 0;
        if (totalSkills > 0) {
            skillMatchScore = (int) Math.round(((double) matchedSkills.size() / totalSkills) * 100);
        } else {
            skillMatchScore = 100; // No skills required
        }

        // 2. Eligibility Score Logic
        // Simple heuristics based on matching key job requirements with resume text
        int eligibilityScore = 80; // Baseline
        if (job.getEligibilityCriteria() != null && !job.getEligibilityCriteria().isEmpty()) {
            String[] criteriaWords = job.getEligibilityCriteria().toLowerCase().split(" ");
            int matchedCriteria = 0;
            for (String word : criteriaWords) {
                if (word.length() > 3 && normalizedResumeText.contains(word)) {
                    matchedCriteria++;
                }
            }
            if (criteriaWords.length > 0) {
                // Adjust score based on simple keyword matches from criteria
                eligibilityScore += Math.min(20, (matchedCriteria * 5));
            }
        }
        
        // Ensure max 100
        eligibilityScore = Math.min(100, eligibilityScore);

        // 3. Overall Job Match
        int overallMatch = (int) Math.round((skillMatchScore * 0.7) + (eligibilityScore * 0.3));

        // 4. Recommendation Logic
        String recommendation;
        boolean eligible = overallMatch >= 60;
        
        if (overallMatch >= 85) {
            recommendation = "Excellent Match! You satisfy almost all job requirements.";
        } else if (overallMatch >= 70) {
            recommendation = "Good Match! You have most of the required skills.";
        } else {
            if (!missingSkills.isEmpty()) {
                recommendation = "You should improve " + String.join(" and ", missingSkills.subList(0, Math.min(2, missingSkills.size()))) + " skills to increase your hiring chances.";
            } else {
                recommendation = "Consider gaining more relevant experience for this role.";
            }
        }

        ResumeAnalysisDTO response = new ResumeAnalysisDTO();
        response.setOverallMatch(overallMatch);
        response.setSkillMatch(skillMatchScore);
        response.setEligibilityScore(eligibilityScore);
        response.setMatchedSkills(matchedSkills);
        response.setMissingSkills(missingSkills);
        response.setRecommendation(recommendation);
        response.setEligible(eligible);

        return response;
    }

    private String extractTextFromPDF(byte[] pdfData) {
        try (PDDocument document = Loader.loadPDF(pdfData)) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            return pdfStripper.getText(document);
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }
}
