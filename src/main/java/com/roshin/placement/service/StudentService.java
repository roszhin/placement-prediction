package com.roshin.placement.service;

import com.roshin.placement.entity.Resume;
import com.roshin.placement.entity.Student;
import com.roshin.placement.repository.AiAnalysisRepository;
import com.roshin.placement.repository.ResumeRepository;
import com.roshin.placement.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StudentService {

    private static final Logger logger = LoggerFactory.getLogger(StudentService.class);
    private static final String RESUME_STORAGE_DIR = "uploads/resumes";
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private AiAnalysisRepository aiAnalysisRepository;

    public Optional<Student> findById(Long id) {
        return studentRepository.findById(id);
    }

    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    /**
     * Retrieve the currently active resume for the given student.
     * Falls back to the latest uploaded resume if none are explicitly active.
     */
    public Optional<Resume> getActiveResumeForStudent(Student student) {
        if (student == null || student.getId() == null) {
            return Optional.empty();
        }
        Optional<Resume> activeOpt = resumeRepository.findFirstByStudentAndIsActiveTrueOrderByUploadedAtDesc(student);
        if (activeOpt.isPresent()) {
            return activeOpt;
        }
        // Fallback: if existing records exist without active flag set, activate the newest one
        List<Resume> allResumes = resumeRepository.findByStudentOrderByUploadedAtDesc(student);
        if (!allResumes.isEmpty()) {
            Resume newest = allResumes.get(0);
            newest.setActive(true);
            resumeRepository.save(newest);
            return Optional.of(newest);
        }
        return Optional.empty();
    }

    /**
     * Retrieve resume binary content reliably from DB BLOB or disk storage.
     */
    public byte[] getResumeFileBytes(Resume resume) throws IOException {
        if (resume == null) {
            return new byte[0];
        }
        if (resume.getFileData() != null && resume.getFileData().length > 0) {
            return resume.getFileData();
        }
        if (resume.getFilePath() != null) {
            Path path = Paths.get(resume.getFilePath());
            if (Files.exists(path) && Files.isReadable(path)) {
                return Files.readAllBytes(path);
            }
        }
        return new byte[0];
    }

    /**
     * Dedicated method for uploading, physically writing, and safely replacing a student's resume.
     * Guarantees that:
     * 1. The physical file is written with a unique stored filename.
     * 2. Physical existence and non-zero size are verified.
     * 3. Previous resumes are deactivated.
     * 4. The DB record is persisted and associated with the student.
     * 5. If DB persistence fails, the newly written file is cleaned up.
     */
    @Transactional
    public Resume saveAndReplaceResume(Long studentId, MultipartFile resumeFile) throws IOException {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));

        if (resumeFile == null || resumeFile.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload an empty resume file.");
        }

        if (resumeFile.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Resume file size exceeds maximum limit of 10MB. File size: " 
                    + (resumeFile.getSize() / (1024 * 1024)) + "MB");
        }

        String originalFilename = resumeFile.getOriginalFilename();
        String contentType = resumeFile.getContentType();

        boolean isPdf = (contentType != null && "application/pdf".equalsIgnoreCase(contentType))
                || (originalFilename != null && originalFilename.toLowerCase().endsWith(".pdf"));

        if (!isPdf) {
            throw new IllegalArgumentException("Only PDF files are allowed for resumes. Detected type: " + contentType);
        }

        // Validate PDF magic bytes (%PDF)
        byte[] fileBytes = resumeFile.getBytes();
        if (fileBytes.length < 4 || fileBytes[0] != 0x25 || fileBytes[1] != 0x50 || fileBytes[2] != 0x44 || fileBytes[3] != 0x46) {
            throw new IllegalArgumentException("The uploaded file is not a valid PDF document (missing %PDF header).");
        }

        logger.info("RESUME UPLOAD START - studentId={}, uploadedFilename={}, size={} bytes", 
                studentId, originalFilename, fileBytes.length);

        // Prepare physical storage directory
        Path storageDir = Paths.get(RESUME_STORAGE_DIR);
        if (!Files.exists(storageDir)) {
            Files.createDirectories(storageDir);
        }

        // Generate unique stored filename pattern: student_{id}_{timestamp}_{uuid}.pdf
        String uniqueSuffix = System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8);
        String storedFilename = "student_" + studentId + "_" + uniqueSuffix + ".pdf";
        Path targetPath = storageDir.resolve(storedFilename);

        Path writtenPath = null;
        try {
            // Physically write the new file
            Files.write(targetPath, fileBytes, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            writtenPath = targetPath;

            // Verify physical existence and size
            if (!Files.exists(targetPath) || Files.size(targetPath) == 0) {
                throw new IOException("Verification failed: Physical resume file is missing or zero-sized after write.");
            }
            logger.info("RESUME PHYSICAL FILE WRITTEN - path={}, size={} bytes", 
                    targetPath.toAbsolutePath(), Files.size(targetPath));

            // Deactivate all previous resumes for this student
            List<Resume> existingResumes = resumeRepository.findByStudent(student);
            for (Resume oldResume : existingResumes) {
                oldResume.setActive(false);
                resumeRepository.save(oldResume);
            }

            // Clear all stale AI analysis rows for this student.
            // Old analysis was generated against the previous resume — it is no longer valid.
            // Deleting here forces fresh re-analysis when the student next opens any job page.
            aiAnalysisRepository.deleteByStudentId(studentId);
            logger.info("RESUME UPLOAD - cleared stale AI analysis rows for studentId={}", studentId);

            // Create and persist new Resume entity
            Resume newResume = new Resume();
            newResume.setStudent(student);
            newResume.setFileName(originalFilename != null ? originalFilename : storedFilename);
            newResume.setFileType("application/pdf");
            newResume.setFilePath(targetPath.toAbsolutePath().toString().replace('\\', '/'));
            newResume.setFileSize(Files.size(targetPath));
            newResume.setFileData(fileBytes);
            newResume.setUploadedAt(LocalDateTime.now());
            newResume.setActive(true);

            // Update owning side & student collection
            Resume savedResume = resumeRepository.save(newResume);
            student.getResumes().add(savedResume);
            studentRepository.save(student);

            logger.info("RESUME DB UPDATED - studentId={}, resumeId={}, fileName={}, filePath={}", 
                    studentId, savedResume.getId(), savedResume.getFileName(), savedResume.getFilePath());

            // Safe cleanup of obsolete physical files for previously deactivated resumes
            for (Resume oldResume : existingResumes) {
                if (oldResume.getFilePath() != null && !oldResume.getFilePath().equals(savedResume.getFilePath())) {
                    try {
                        Path oldPath = Paths.get(oldResume.getFilePath());
                        if (Files.exists(oldPath) && !oldPath.equals(targetPath)) {
                            Files.deleteIfExists(oldPath);
                            logger.info("Old physical resume file cleaned up: {}", oldPath);
                        }
                    } catch (Exception ex) {
                        logger.warn("Could not delete old resume file {}: {}", oldResume.getFilePath(), ex.getMessage());
                    }
                }
            }

            return savedResume;

        } catch (Exception e) {
            // Transaction failure safety: clean up newly created file if DB update fails
            if (writtenPath != null) {
                try {
                    Files.deleteIfExists(writtenPath);
                    logger.warn("Cleaned up orphaned resume file after failure: {}", writtenPath);
                } catch (Exception ex) {
                    logger.error("Failed to delete orphaned resume file: {}", writtenPath, ex);
                }
            }
            logger.error("RESUME UPLOAD FAILED - studentId={}, error={}", studentId, e.getMessage(), e);
            throw e;
        }
    }

    @Transactional
    public Resume updateStudentProfile(Long studentId, Student updatedData, MultipartFile resumeFile) throws IOException {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));

        student.setName(updatedData.getName());
        student.setPhoneNumber(updatedData.getPhoneNumber());
        student.setGender(updatedData.getGender());
        student.setDateOfBirth(updatedData.getDateOfBirth());
        student.setAddress(updatedData.getAddress());
        student.setRollNumber(updatedData.getRollNumber());
        student.setCollege(updatedData.getCollege());
        student.setUniversity(updatedData.getUniversity());
        student.setCourse(updatedData.getCourse());
        student.setDepartment(updatedData.getDepartment());
        student.setPassingYear(updatedData.getPassingYear());
        student.setCgpa(updatedData.getCgpa());

        // Skills, Certifications, Experience, Projects
        student.setTechnicalSkills(updatedData.getTechnicalSkills());
        student.setCertifications(updatedData.getCertifications());
        student.setProjects(updatedData.getProjects());
        student.setExperience(updatedData.getExperience());

        studentRepository.save(student);

        Resume savedResume = null;
        if (resumeFile != null && !resumeFile.isEmpty()) {
            savedResume = saveAndReplaceResume(studentId, resumeFile);
        }

        return savedResume;
    }

}
