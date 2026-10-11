package com.roshin.placement.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.roshin.placement.entity.AiAnalysis;
import com.roshin.placement.entity.Job;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class MatchedJobDto {

    @JsonIgnore
    private Job job;

    @JsonIgnore
    private AiAnalysis analysis;

    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String location;
    private String packageOffered;
    private String employmentType;
    private String workMode;
    private String requiredSkills;
    private String postedDate;

    private int rank;
    private double score;
    private double skillMatchScore;
    private double eligibilityScore;
    private String badge;
    private String badgeClass;
    private boolean applied;
    private List<String> matchedSkills = new ArrayList<>();
    private List<String> missingSkills = new ArrayList<>();
    private String recommendation;

    public void setJob(Job job) {
        this.job = job;
        if (job != null) {
            this.jobId = job.getId();
            this.jobTitle = job.getJobTitle();
            if (job.getCompany() != null) {
                this.companyName = job.getCompany().getCompanyName();
            }
            this.location = job.getLocation();
            this.packageOffered = job.getPackageOffered();
            this.employmentType = job.getEmploymentType();
            this.workMode = job.getWorkMode();
            this.requiredSkills = job.getRequiredSkills();
            if (job.getCreatedAt() != null) {
                this.postedDate = job.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
            }
        }
    }
}
