package com.roshin.placement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private String jobTitle;

    @Column(nullable = false, length = 5000)
    private String jobDescription;

    private String requiredSkills;
    private String eligibilityCriteria;
    private String packageOffered;
    private String location;
    
    @Column(name = "last_date_to_apply")
    private LocalDateTime lastDateToApply;
    
    // New Structured Fields
    private String department;
    private String employmentType;
    private String workMode;
    private Integer salaryLpa;
    private String experienceRequirement;
    private String minimumQualification;
    private Double minimumCgpa;
    
    @Column(length = 2000)
    private String preferredSkills;
    
    @Column(length = 5000)
    private String responsibilities;
    
    private Integer vacancies;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "is_active")
    private boolean isActive = true;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Application> applications = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<AiAnalysis> aiAnalysisList = new java.util.ArrayList<>();
}
