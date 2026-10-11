package com.roshin.placement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    private Resume resume;

    @Column(nullable = false)
    private String status = "APPLIED"; // APPLIED, SHORTLISTED, REJECTED, SELECTED
    
    // AI Generated scores stored per application
    private Double atsScore;
    private Double eligibilityScore;
    private Double skillMatchScore;
    
    @Column(length = 2000)
    private String missingSkills;
    
    @Column(length = 5000)
    private String aiFeedback;

    @Column(length = 5000)
    private String recruiterNotes;
    
    private String interviewDate;
    private String interviewTime;
    private String interviewLink;
    private String interviewMode;

    @Column(name = "applied_at")
    private LocalDateTime appliedAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "status_updated_at")
    private LocalDateTime statusUpdatedAt;

    @Column(name = "under_review_at")
    private LocalDateTime underReviewAt;

    @Column(name = "shortlisted_at")
    private LocalDateTime shortlistedAt;

    @Column(name = "selected_at")
    private LocalDateTime selectedAt;

    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;
}
