package com.roshin.placement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_analysis")
@Getter
@Setter
@NoArgsConstructor
public class AiAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "overall_match")
    private Double overallMatch;

    @Column(name = "skill_match")
    private Double skillMatchScore;

    @Column(name = "eligibility_score")
    private Double eligibilityScore;

    @Column(name = "missing_skills", length = 2000)
    private String missingSkills;

    @Column(name = "ai_feedback", length = 5000)
    private String aiFeedback;

    @Column(name = "analysis_date")
    private LocalDateTime analysisDate = LocalDateTime.now();
    
    @PrePersist
    @PreUpdate
    public void updateDate() {
        this.analysisDate = LocalDateTime.now();
        if (this.aiFeedback == null || this.aiFeedback.isBlank()) {
            this.aiFeedback = "Analysis unavailable — please re-analyze.";
        }
    }
}
