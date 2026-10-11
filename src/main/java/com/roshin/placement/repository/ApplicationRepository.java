package com.roshin.placement.repository;

import com.roshin.placement.entity.Application;
import com.roshin.placement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentOrderByAppliedAtDesc(Student student);
    List<Application> findByStudentAndStatusOrderByAppliedAtDesc(Student student, String status);
    List<Application> findByJobId(Long jobId);
    
    java.util.Optional<Application> findByStudentIdAndJobId(Long studentId, Long jobId);
    
    List<Application> findByJobCompanyOrderByAppliedAtDesc(com.roshin.placement.entity.Company company);
}
