package com.roshin.placement;

import com.roshin.placement.entity.AiAnalysis;
import com.roshin.placement.entity.Job;
import com.roshin.placement.entity.Resume;
import com.roshin.placement.entity.Student;
import com.roshin.placement.repository.AiAnalysisRepository;
import com.roshin.placement.repository.JobRepository;
import com.roshin.placement.repository.ResumeRepository;
import com.roshin.placement.repository.StudentRepository;
import com.roshin.placement.security.CustomUserDetails;
import com.roshin.placement.service.AIService;
import com.roshin.placement.service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts.FontName;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class RealResumeTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private AiAnalysisRepository aiAnalysisRepository;

    @Autowired
    private AIService aiService;

    @BeforeEach
    public void ensureRealResumeExistsOnDisk() throws Exception {
        Resume r21 = resumeRepository.findById(21L).orElse(null);
        if (r21 != null && r21.getFileData() != null && r21.getFileData().length > 0) {
            Path targetPath = Paths.get("uploads/resumes/student_4_1789908639797_ef5ad054.pdf");
            if (!Files.exists(targetPath)) {
                Files.createDirectories(targetPath.getParent());
                Files.write(targetPath, r21.getFileData());
            }
            r21.setActive(true);
            resumeRepository.save(r21);
        }
    }

    @Test
    public void testJobDetailsPageRenderingWithoutAnalysis() throws Exception {
        Student student = studentRepository.findById(4L).orElseThrow();
        CustomUserDetails userDetails = new CustomUserDetails(student);

        mockMvc.perform(get("/student/job/96").with(user(userDetails)))
                .andExpect(status().isOk());
    }

    @Test
    public void testAnalyzeAndRenderJobDetails() throws Exception {
        Student student = studentRepository.findById(4L).orElseThrow();
        Job job = jobRepository.findById(96L).orElseThrow();
        CustomUserDetails userDetails = new CustomUserDetails(student);

        // Run AI Analysis
        Map<String, Object> aiResult = aiService.analyzeProfileAgainstJob(student, job);
        assertNotNull(aiResult);
        assertNotNull(aiResult.get("aiFeedback"));
        assertTrue(((Double) aiResult.get("atsScore")) >= 0.0);

        // Verify that /student/job/96 renders cleanly with this analysis
        mockMvc.perform(get("/student/job/96").with(user(userDetails)))
                .andExpect(status().isOk());
    }

    @Test
    public void testAnalyzeEndpointViaRest() throws Exception {
        Student student = studentRepository.findById(4L).orElseThrow();
        CustomUserDetails userDetails = new CustomUserDetails(student);

        // Call POST /api/student/jobs/96/analyze
        mockMvc.perform(post("/api/student/jobs/96/analyze").with(user(userDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.overallMatch").isNumber())
                .andExpect(jsonPath("$.recommendation").isString());
    }

    @Test
    public void testViewAvailableJobsWithAppliedBadge() throws Exception {
        Student student = studentRepository.findById(4L).orElseThrow();
        CustomUserDetails userDetails = new CustomUserDetails(student);

        mockMvc.perform(get("/student/jobs").with(user(userDetails)))
                .andExpect(status().isOk())
                .andExpect(model().attributeExists("jobs"))
                .andExpect(model().attributeExists("appliedJobIds"));
    }

    @Test
    public void testViewMatchedJobsWithActiveResume() throws Exception {
        Student student = studentRepository.findById(4L).orElseThrow();
        CustomUserDetails userDetails = new CustomUserDetails(student);

        mockMvc.perform(get("/student/jobs/matched").with(user(userDetails)))
                .andExpect(status().isOk())
                .andExpect(model().attribute("hasResume", true))
                .andExpect(model().attributeExists("matchedJobs"));
    }

    @Test
    public void testCalculateMatchedJobsEndpoint() throws Exception {
        Student student = studentRepository.findById(4L).orElseThrow();
        CustomUserDetails userDetails = new CustomUserDetails(student);

        mockMvc.perform(post("/student/jobs/matched/calculate").with(user(userDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.hasResume").value(true))
                .andExpect(jsonPath("$.matchedJobs").isArray());
    }

    private byte[] createTestPdf(String title, String summary, String skills) throws IOException {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                PDType1Font fontBold = new PDType1Font(FontName.HELVETICA_BOLD);
                PDType1Font fontRegular = new PDType1Font(FontName.HELVETICA);

                contentStream.beginText();
                contentStream.setFont(fontBold, 16);
                contentStream.setLeading(14.5f);
                contentStream.newLineAtOffset(50, 750);
                contentStream.showText(title);
                contentStream.newLine();
                contentStream.newLine();

                contentStream.setFont(fontBold, 12);
                contentStream.showText("Summary:");
                contentStream.newLine();
                contentStream.setFont(fontRegular, 11);
                contentStream.showText(summary);
                contentStream.newLine();
                contentStream.newLine();

                contentStream.setFont(fontBold, 12);
                contentStream.showText("Technical Skills:");
                contentStream.newLine();
                contentStream.setFont(fontRegular, 11);
                contentStream.showText(skills);
                contentStream.newLine();
                contentStream.endText();
            }
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }

    @Test
    public void testDifferentResumesProduceDifferentAiScoresAndSkills() throws Exception {
        Student student = studentRepository.findById(4L).orElseThrow();
        Job job = jobRepository.findById(96L).orElseThrow();

        // 1. Deactivate any existing resumes
        List<Resume> existingResumes = resumeRepository.findByStudentOrderByUploadedAtDesc(student);
        for (Resume r : existingResumes) {
            r.setActive(false);
            resumeRepository.save(r);
        }

        Resume resume1 = null;
        Resume resume2 = null;

        try {
            // 2. Create Dense Technical Resume matching the job's requirements
            String denseSkills = (job.getRequiredSkills() != null && !job.getRequiredSkills().isBlank())
                    ? job.getRequiredSkills() + ", Python, Shell Scripting, CI/CD"
                    : "Java, Spring Boot, Docker, AWS, Kubernetes, Microservices, CI/CD";

            byte[] pdf1 = createTestPdf("Senior Specialist - " + job.getJobTitle(),
                    "Highly experienced professional with deep expertise in all required technologies",
                    denseSkills);

            resume1 = new Resume();
            resume1.setStudent(student);
            resume1.setFileName("dense_technical_resume.pdf");
            resume1.setFileType("application/pdf");
            resume1.setFileData(pdf1);
            resume1.setActive(true);
            resume1.setUploadedAt(java.time.LocalDateTime.now());
            resume1 = resumeRepository.save(resume1);

            Map<String, Object> result1 = aiService.analyzeProfileAgainstJob(student, job);
            System.out.println("=== TEST RESULT 1 (DENSE TECHNICAL RESUME) ===");
            System.out.println("Score: " + result1.get("atsScore"));
            System.out.println("SkillMatchScore: " + result1.get("skillMatchScore"));
            System.out.println("Matched: " + result1.get("matchedSkills"));
            System.out.println("Missing: " + result1.get("missingSkillsList"));
            System.out.println("Recommendation: " + result1.get("recommendation"));

            // 3. Switch to Minimal Entry-Level Frontend Resume (Non-matching skills)
            resume1.setActive(false);
            resumeRepository.save(resume1);

            byte[] pdf2 = createTestPdf("Junior Graphic Designer",
                    "Entry-level beginner passionate about Photoshop and HTML design",
                    "HTML, CSS, Photoshop, Figma, Photography");

            resume2 = new Resume();
            resume2.setStudent(student);
            resume2.setFileName("minimal_frontend_resume.pdf");
            resume2.setFileType("application/pdf");
            resume2.setFileData(pdf2);
            resume2.setActive(true);
            resume2.setUploadedAt(java.time.LocalDateTime.now());
            resume2 = resumeRepository.save(resume2);

            Map<String, Object> result2 = aiService.analyzeProfileAgainstJob(student, job);
            System.out.println("=== TEST RESULT 2 (MINIMAL FRONTEND RESUME) ===");
            System.out.println("Score: " + result2.get("atsScore"));
            System.out.println("SkillMatchScore: " + result2.get("skillMatchScore"));
            System.out.println("Matched: " + result2.get("matchedSkills"));
            System.out.println("Missing: " + result2.get("missingSkillsList"));
            System.out.println("Recommendation: " + result2.get("recommendation"));

            // 4. Assert that results are genuinely different
            assertNotNull(result1.get("atsScore"));
            assertNotNull(result2.get("atsScore"));
            assertNotEquals(result1.get("atsScore"), result2.get("atsScore"),
                    "AI match score must be different for dense technical vs entry-level frontend resume");
            assertNotEquals(result1.get("matchedSkills"), result2.get("matchedSkills"),
                    "Matched skills must be different for different resumes");
            assertNotEquals(result1.get("missingSkillsList"), result2.get("missingSkillsList"),
                    "Missing skills must be different for different resumes");

            double score1 = (Double) result1.get("atsScore");
            double score2 = (Double) result2.get("atsScore");
            assertTrue(score1 > score2,
                    "Dense technical resume (" + score1 + ") must score higher than minimal frontend resume (" + score2 + ")");

            List<?> matched1 = (List<?>) result1.get("matchedSkills");
            List<?> matched2 = (List<?>) result2.get("matchedSkills");
            assertFalse(matched1.isEmpty(), "Dense matching resume must have matched skills");
            assertTrue(matched2.isEmpty(), "Minimal non-matching resume must have 0 matched skills");

        } finally {
            // Cleanup: delete test resumes and restore original active resume 21
            if (resume1 != null && resume1.getId() != null) {
                resumeRepository.delete(resume1);
            }
            if (resume2 != null && resume2.getId() != null) {
                resumeRepository.delete(resume2);
            }
            Resume r21 = resumeRepository.findById(21L).orElse(null);
            if (r21 != null) {
                r21.setActive(true);
                resumeRepository.save(r21);
            }
        }
    }
}
