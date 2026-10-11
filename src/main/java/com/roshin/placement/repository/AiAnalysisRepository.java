package com.roshin.placement.repository;

import com.roshin.placement.entity.AiAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AiAnalysisRepository extends JpaRepository<AiAnalysis, Long> {
    java.util.List<AiAnalysis> findAllByStudentIdAndJobIdOrderByAnalysisDateDesc(Long studentId, Long jobId);

    default Optional<AiAnalysis> findByStudentIdAndJobId(Long studentId, Long jobId) {
        java.util.List<AiAnalysis> list = findAllByStudentIdAndJobIdOrderByAnalysisDateDesc(studentId, jobId);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }
    java.util.List<AiAnalysis> findByStudentId(Long studentId);
    java.util.List<AiAnalysis> findByJobId(Long jobId);
    void deleteByStudentId(Long studentId);
    void deleteByJobId(Long jobId);
    void deleteByJob(com.roshin.placement.entity.Job job);
    void deleteByStudent(com.roshin.placement.entity.Student student);
}
