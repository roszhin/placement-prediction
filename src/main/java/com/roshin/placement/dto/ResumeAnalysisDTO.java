package com.roshin.placement.dto;

import java.util.List;

public class ResumeAnalysisDTO {

    private int overallMatch;
    private int skillMatch;
    private int eligibilityScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String recommendation;
    private boolean eligible;
    private Long applicationId;

    public ResumeAnalysisDTO() {}

    public int getOverallMatch() {
        return overallMatch;
    }

    public void setOverallMatch(int overallMatch) {
        this.overallMatch = overallMatch;
    }

    public int getSkillMatch() {
        return skillMatch;
    }

    public void setSkillMatch(int skillMatch) {
        this.skillMatch = skillMatch;
    }

    public int getEligibilityScore() {
        return eligibilityScore;
    }

    public void setEligibilityScore(int eligibilityScore) {
        this.eligibilityScore = eligibilityScore;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public boolean isEligible() {
        return eligible;
    }

    public void setEligible(boolean eligible) {
        this.eligible = eligible;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }
}
