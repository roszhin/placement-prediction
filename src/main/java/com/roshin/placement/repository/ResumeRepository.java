package com.roshin.placement.repository;

import com.roshin.placement.entity.Resume;
import com.roshin.placement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByStudentOrderByUploadedAtDesc(Student student);
    List<Resume> findByStudent(Student student);
    List<Resume> findByStudentAndIsActiveTrueOrderByUploadedAtDesc(Student student);
    Optional<Resume> findFirstByStudentAndIsActiveTrueOrderByUploadedAtDesc(Student student);
    Optional<Resume> findFirstByStudentIdAndIsActiveTrueOrderByUploadedAtDesc(Long studentId);

    @Modifying
    @Query("UPDATE Resume r SET r.isActive = false WHERE r.student = :student")
    void deactivateAllByStudent(@Param("student") Student student);
}
