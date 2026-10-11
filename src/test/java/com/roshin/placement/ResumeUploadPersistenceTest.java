package com.roshin.placement;

import com.roshin.placement.entity.Resume;
import com.roshin.placement.entity.Student;
import com.roshin.placement.repository.ResumeRepository;
import com.roshin.placement.repository.StudentRepository;
import com.roshin.placement.service.StudentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ResumeUploadPersistenceTest {

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Test
    public void testCompleteResumeReplacementFlow() throws Exception {
        Student student = studentRepository.findById(18L).orElse(null);
        assertNotNull(student, "Student 4 must exist");

        // 1. Upload First New PDF
        byte[] pdf1 = "%PDF-1.4 First Candidate Resume Content".getBytes();
        MockMultipartFile file1 = new MockMultipartFile(
                "resumeFile", "Resume_First_Version.pdf", "application/pdf", pdf1);

        Resume saved1 = studentService.saveAndReplaceResume(student.getId(), file1);
        assertNotNull(saved1);
        assertTrue(saved1.isActive(), "First resume should be active");
        assertEquals("Resume_First_Version.pdf", saved1.getFileName());
        assertNotNull(saved1.getFilePath(), "Physical file path must be saved");

        // Verify physical file on disk
        Path path1 = Paths.get(saved1.getFilePath());
        assertTrue(Files.exists(path1), "Physical file must exist on disk");
        assertTrue(Files.size(path1) > 0, "Physical file size must be > 0");

        // Verify active resume retrieval
        Optional<Resume> active1 = studentService.getActiveResumeForStudent(student);
        assertTrue(active1.isPresent());
        assertEquals(saved1.getId(), active1.get().getId());

        // 2. Upload Second Replacement PDF (Old PDF -> New PDF)
        byte[] pdf2 = "%PDF-1.4 Second Updated Candidate Resume Content".getBytes();
        MockMultipartFile file2 = new MockMultipartFile(
                "resumeFile", "Resume_Updated_Version_2026.pdf", "application/pdf", pdf2);

        Resume saved2 = studentService.saveAndReplaceResume(student.getId(), file2);
        assertNotNull(saved2);
        assertTrue(saved2.isActive(), "Second resume must be active");
        assertEquals("Resume_Updated_Version_2026.pdf", saved2.getFileName());

        // Verify physical file for second resume
        Path path2 = Paths.get(saved2.getFilePath());
        assertTrue(Files.exists(path2), "Second physical file must exist on disk");
        assertTrue(Files.size(path2) > 0);

        // Verify first resume was marked inactive
        Resume reloadedSaved1 = resumeRepository.findById(saved1.getId()).orElse(null);
        assertNotNull(reloadedSaved1);
        assertFalse(reloadedSaved1.isActive(), "Old resume must be marked inactive");

        // Verify active resume retrieval now returns second resume
        Optional<Resume> active2 = studentService.getActiveResumeForStudent(student);
        assertTrue(active2.isPresent());
        assertEquals(saved2.getId(), active2.get().getId(), "Active resume must be the new replacement");
        assertEquals("Resume_Updated_Version_2026.pdf", active2.get().getFileName());

        // Verify byte retrieval
        byte[] retrievedBytes = studentService.getResumeFileBytes(active2.get());
        assertArrayEquals(pdf2, retrievedBytes, "Retrieved bytes must match the new resume");
    }

    @Test
    public void testInvalidPdfRejection() {
        Student student = studentRepository.findById(18L).orElse(null);
        assertNotNull(student);

        // Non-PDF extension
        MockMultipartFile txtFile = new MockMultipartFile(
                "resumeFile", "document.txt", "text/plain", "This is plain text".getBytes());
        assertThrows(IllegalArgumentException.class, () -> {
            studentService.saveAndReplaceResume(student.getId(), txtFile);
        });

        // Fake PDF with missing %PDF header
        MockMultipartFile fakePdf = new MockMultipartFile(
                "resumeFile", "fake.pdf", "application/pdf", "Not a real PDF header".getBytes());
        assertThrows(IllegalArgumentException.class, () -> {
            studentService.saveAndReplaceResume(student.getId(), fakePdf);
        });
    }

    @Test
    public void testOversizedPdfRejection() {
        Student student = studentRepository.findById(18L).orElse(null);
        assertNotNull(student);

        // 11MB file
        byte[] bigBytes = new byte[11 * 1024 * 1024];
        bigBytes[0] = 0x25; bigBytes[1] = 0x50; bigBytes[2] = 0x44; bigBytes[3] = 0x46; // %PDF
        MockMultipartFile bigFile = new MockMultipartFile(
                "resumeFile", "large_resume.pdf", "application/pdf", bigBytes);

        assertThrows(IllegalArgumentException.class, () -> {
            studentService.saveAndReplaceResume(student.getId(), bigFile);
        });
    }
}
