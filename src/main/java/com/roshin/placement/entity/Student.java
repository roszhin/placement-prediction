package com.roshin.placement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
public class Student extends User {
    private String rollNumber;
    private String college;
    private String university;
    private String course;
    private String passingYear;
    private Double cgpa;
    private String department;
    
    @Column(length = 2000)
    private String technicalSkills;
    
    @Column(length = 2000)
    private String certifications;
    
    @Column(length = 5000)
    private String projects;
    
    @Column(length = 5000)
    private String experience;

    @jakarta.persistence.OneToMany(mappedBy = "student", cascade = jakarta.persistence.CascadeType.ALL, fetch = jakarta.persistence.FetchType.LAZY)
    @jakarta.persistence.OrderBy("uploadedAt DESC")
    private java.util.List<Resume> resumes = new java.util.ArrayList<>();

    public Resume getActiveResume() {
        if (resumes == null || resumes.isEmpty()) return null;
        for (Resume r : resumes) {
            if (r.isActive()) return r;
        }
        return resumes.get(0);
    }
}
