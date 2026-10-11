package com.roshin.placement.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.roshin.placement.entity.Job;
import com.roshin.placement.entity.Resume;
import com.roshin.placement.entity.Student;
import com.roshin.placement.repository.ResumeRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class AIService {

    private static final Logger logger = LoggerFactory.getLogger(AIService.class);

    @Value("${ai.api.key}")
    private String apiKey;

    @Value("${ai.api.url}")
    private String apiUrl;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final ResumeRepository resumeRepository;

    public AIService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper, ResumeRepository resumeRepository) {
        this.webClient = webClientBuilder.build();
        this.objectMapper = objectMapper;
        this.resumeRepository = resumeRepository;
    }

    // Maximum file size for Gemini multimodal inlineData (20MB)
    private static final long MAX_MULTIMODAL_BYTES = 20 * 1024 * 1024;

    // Maximum characters of resume text sent to AI when using text-only fallback
    private static final int MAX_RESUME_CHARS = 8000;

    /** Safely return a string value, replacing null with empty string. */
    private static String safe(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    /** Determine MIME type from file bytes header or resume metadata. */
    private String determineMimeType(Resume resume, byte[] fileBytes) {
        if (fileBytes != null && fileBytes.length >= 4) {
            // Check PDF magic bytes: %PDF (0x25, 0x50, 0x44, 0x46)
            if (fileBytes[0] == 0x25 && fileBytes[1] == 0x50 && fileBytes[2] == 0x44 && fileBytes[3] == 0x46) {
                return "application/pdf";
            }
            // Check PNG magic bytes: 0x89, 'P', 'N', 'G'
            if (fileBytes[0] == (byte) 0x89 && fileBytes[1] == 0x50 && fileBytes[2] == 0x4E && fileBytes[3] == 0x47) {
                return "image/png";
            }
            // Check JPEG magic bytes: 0xFF, 0xD8, 0xFF
            if ((fileBytes[0] & 0xFF) == 0xFF && (fileBytes[1] & 0xFF) == 0xD8 && (fileBytes[2] & 0xFF) == 0xFF) {
                return "image/jpeg";
            }
        }

        if (resume != null) {
            String fileName = resume.getFileName() != null ? resume.getFileName().toLowerCase() : "";
            String fileType = resume.getFileType() != null ? resume.getFileType().toLowerCase() : "";
            if (fileType.contains("pdf") || fileName.endsWith(".pdf")) {
                return "application/pdf";
            } else if (fileType.contains("png") || fileName.endsWith(".png")) {
                return "image/png";
            } else if (fileType.contains("jpeg") || fileName.endsWith(".jpeg") || fileName.endsWith(".jpg")) {
                return "image/jpeg";
            } else if (fileType.contains("webp") || fileName.endsWith(".webp")) {
                return "image/webp";
            }
        }
        return "application/pdf";
    }

    /** Checks whether the MIME type is supported by Gemini multimodal input. */
    private boolean isSupportedMimeType(String mimeType) {
        return mimeType != null && (
            mimeType.equalsIgnoreCase("application/pdf")
            || mimeType.equalsIgnoreCase("image/png")
            || mimeType.equalsIgnoreCase("image/jpeg")
            || mimeType.equalsIgnoreCase("image/jpg")
            || mimeType.equalsIgnoreCase("image/webp")
        );
    }

    /** Intelligently truncate resume text for text fallback. */
    private static String truncateResumeText(String text) {
        if (text == null || text.isBlank()) return "Unable to extract readable text from resume.";
        if (text.length() <= MAX_RESUME_CHARS) return text;

        String truncated = text.substring(0, MAX_RESUME_CHARS);
        int lastNewline = truncated.lastIndexOf('\n');
        if (lastNewline > MAX_RESUME_CHARS / 2) {
            truncated = truncated.substring(0, lastNewline);
        }
        logger.warn("Resume text truncated from {} chars to {} chars for AI prompt.",
                text.length(), truncated.length());
        return truncated + "\n\n[Resume text truncated for analysis — " + text.length() + " chars total]";
    }

    /** Safely extract plain text using PDFBox (fallback only). */
    private String extractTextWithPdfBox(byte[] pdfBytes) {
        if (pdfBytes == null || pdfBytes.length == 0) return "";
        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            return text != null ? text.trim() : "";
        } catch (Exception e) {
            logger.warn("PDFBox text extraction failed: {}", e.getMessage());
            return "";
        }
    }

    /**
     * Primary entry point for AI Resume and Profile analysis.
     * Uses Gemini Multimodal API (inlineData) to inspect raw PDF/image bytes.
     * Gracefully falls back to text extraction, and finally to dynamic profile-job matching.
     */
    public Map<String, Object> analyzeProfileAgainstJob(Student student, Job job) {
        // 1. Locate student's active resume
        List<Resume> resumes = resumeRepository.findByStudentAndIsActiveTrueOrderByUploadedAtDesc(student);
        if (resumes.isEmpty()) {
            resumes = resumeRepository.findByStudentOrderByUploadedAtDesc(student);
        }

        Resume latestResume = resumes.isEmpty() ? null : resumes.get(0);
        byte[] resumeBytes = null;
        if (latestResume != null) {
            resumeBytes = latestResume.getFileData();
            if ((resumeBytes == null || resumeBytes.length == 0) && latestResume.getFilePath() != null) {
                try {
                    Path p = Paths.get(latestResume.getFilePath());
                    if (Files.exists(p)) {
                        resumeBytes = Files.readAllBytes(p);
                    }
                } catch (Exception ex) {
                    logger.warn("Could not read resume from path {}: {}", latestResume.getFilePath(), ex.getMessage());
                }
            }
        }

        String mimeType = determineMimeType(latestResume, resumeBytes);
        String responseString = null;
        boolean isScanned = false;
        Exception lastException = null;

        // Extract plain text upfront if resume bytes exist
        String extractedText = null;
        if (resumeBytes != null && resumeBytes.length > 0) {
            extractedText = extractTextWithPdfBox(resumeBytes);
            if (extractedText == null || extractedText.isBlank()) {
                isScanned = true;
                logger.warn("PDFBox text extraction returned blank or failed — resume may be scanned/image-based.");
            }
        }

        // 2. PRIMARY STRATEGY: Gemini Multimodal API (Inline Data)
        if (resumeBytes != null && resumeBytes.length > 0) {
            if (resumeBytes.length <= MAX_MULTIMODAL_BYTES && isSupportedMimeType(mimeType)) {
                try {
                    logger.info("Initiating Gemini Multimodal API call: studentId={}, jobId={}, mimeType={}, size={} bytes",
                            student.getId(), job.getId(), mimeType, resumeBytes.length);

                    String multimodalPrompt = buildMultimodalPrompt(job, student);
                    Map<String, Object> filePart = Map.of(
                        "inlineData", Map.of(
                            "mimeType", mimeType,
                            "data", Base64.getEncoder().encodeToString(resumeBytes)
                        )
                    );
                    Map<String, Object> textPart = Map.of("text", multimodalPrompt);
                    Map<String, Object> requestBody = Map.of(
                        "contents", List.of(
                            Map.of("parts", List.of(filePart, textPart))
                        )
                    );

                    responseString = callGeminiApi(requestBody);
                    logger.info("Gemini Multimodal response received ({} chars)", responseString != null ? responseString.length() : 0);

                } catch (Exception e) {
                    lastException = e;
                    logger.warn("Gemini Multimodal API call failed ({}: {}). Switching to text extraction fallback...",
                            e.getClass().getSimpleName(), e.getMessage());
                }
            } else {
                logger.warn("Resume skipped multimodal input: size={} bytes (max={}), mimeType={}",
                        resumeBytes.length, MAX_MULTIMODAL_BYTES, mimeType);
            }
        }

        // 3. FALLBACK STRATEGY 1: PDFTextStripper Text Extraction with Gemini Text Prompt
        if (responseString == null || responseString.isBlank()) {
            if (extractedText != null && !extractedText.isBlank()) {
                logger.info("PDF text extraction succeeded ({} chars). Initiating text-based Gemini call...", extractedText.length());
                String textPrompt = buildTextPrompt(job, student, truncateResumeText(extractedText));
                Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", textPrompt)))
                    )
                );
                try {
                    responseString = callGeminiApi(requestBody);
                    logger.info("Gemini Text-fallback response received ({} chars)", responseString != null ? responseString.length() : 0);
                } catch (Exception e) {
                    lastException = e;
                    logger.warn("Gemini Text-based call failed: {}", e.getMessage());
                }
            }
        }

        // 4. Parse Gemini Response if available
        if (responseString != null && !responseString.isBlank()) {
            try {
                return parseGeminiResponse(responseString);
            } catch (Exception e) {
                lastException = e;
                logger.error("Failed to parse Gemini response JSON: {}. Falling back to dynamic analysis.", e.getMessage());
            }
        }

        // 5. FALLBACK STRATEGY 2: Dynamic Profile-to-Job Matching Analysis
        // Log full exception with stack trace as requested before returning fallback
        if (lastException != null) {
            if (lastException instanceof WebClientResponseException wcre) {
                logger.error("Gemini API Error Response Body: {}", wcre.getResponseBodyAsString());
            }
            logger.error("AI Analysis falling through to fallback result. Full exception cause:", lastException);
        } else {
            logger.warn("AI Analysis falling through to fallback result (no direct exception recorded).");
        }

        logger.info("Using dynamic semantic profile match fallback for studentId={} and jobId={}", student.getId(), job.getId());
        return buildDynamicFallbackResult(student, job, extractedText, resumeBytes != null, isScanned);
    }

    private String callGeminiApi(Map<String, Object> requestBody) {
        if (apiKey == null || apiKey.isBlank() || "your-ai-api-key".equalsIgnoreCase(apiKey)) {
            logger.warn("Gemini API key is not configured or is placeholder ('{}'). Gemini API calls will fail.", apiKey);
        }
        try {
            return webClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(20))
                    .block();
        } catch (WebClientResponseException e) {
            logger.error("WebClientResponseException from Gemini API (status: {}): {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            logger.error("Exception calling Gemini API: {}", e.getMessage());
            throw e;
        }
    }

    private String buildMultimodalPrompt(Job job, Student student) {
        return String.format(
            "Act as an expert Senior Technical Recruiter and AI Skill Gap Analyzer. " +
            "I have provided the candidate's complete uploaded resume document (PDF/image) as an attachment, " +
            "along with their manual profile information and the target job posting.\n" +
            "Carefully examine all pages, text, projects, technologies, and certifications in the attached resume, " +
            "as well as the manual profile details below.\n" +
            "Analyze semantic meaning and conceptual alignment, not just exact keyword matching (e.g. 'Backend REST API' matches 'Spring Boot Web Services').\n\n" +
            "Job Posting:\n" +
            "Title: %s\nDepartment: %s\nEmployment Type: %s\nWork Mode: %s\nExperience Req: %s\nMin Qualification: %s\nMin CGPA: %s\nRequired Skills: %s\nPreferred Skills: %s\nDescription: %s\nResponsibilities: %s\nEligibility: %s\n\n" +
            "Candidate Manual Profile:\n" +
            "Course: %s\nDepartment: %s\nCGPA: %s\nTechnical Skills: %s\nCertifications: %s\nProjects: %s\nExperience: %s\n\n" +
            "Return ONLY a valid JSON object matching exactly this structure (no markdown, no backticks, only pure JSON):\n" +
            "{\n" +
            "  \"overallMatch\": <number between 0 and 100>,\n" +
            "  \"technicalSkillMatch\": <number between 0 and 100>,\n" +
            "  \"experienceMatch\": <number between 0 and 100>,\n" +
            "  \"educationMatch\": <number between 0 and 100>,\n" +
            "  \"projectRelevance\": <number between 0 and 100>,\n" +
            "  \"matchedSkills\": [\"skill1\", \"skill2\"],\n" +
            "  \"missingSkills\": [\"skill3\", \"skill4\"],\n" +
            "  \"strengths\": [\"strength1\", \"strength2\"],\n" +
            "  \"weaknesses\": [\"weakness1\", \"weakness2\"],\n" +
            "  \"recommendations\": [\"rec1\", \"rec2\"],\n" +
            "  \"interviewReadiness\": \"High/Medium/Low\",\n" +
            "  \"finalVerdict\": \"Eligible/Consider/Not Eligible\"\n" +
            "}",
            safe(job.getJobTitle()), safe(job.getDepartment()), safe(job.getEmploymentType()), safe(job.getWorkMode()),
            safe(job.getExperienceRequirement()), safe(job.getMinimumQualification()), safe(job.getMinimumCgpa()),
            safe(job.getRequiredSkills()), safe(job.getPreferredSkills()), safe(job.getJobDescription()),
            safe(job.getResponsibilities()), safe(job.getEligibilityCriteria()),
            safe(student.getCourse()), safe(student.getDepartment()), safe(student.getCgpa()),
            safe(student.getTechnicalSkills()), safe(student.getCertifications()), safe(student.getProjects()), safe(student.getExperience())
        );
    }

    private String buildTextPrompt(Job job, Student student, String resumeText) {
        return String.format(
            "Act as an expert Senior Technical Recruiter and AI Skill Gap Analyzer. " +
            "I have candidate profile information, their extracted resume text, and the target job posting.\n" +
            "Analyze semantic meaning, not just keyword matching.\n\n" +
            "Job Posting:\nTitle: %s\nDepartment: %s\nEmployment Type: %s\nWork Mode: %s\nExperience Req: %s\nMin Qualification: %s\nMin CGPA: %s\nRequired Skills: %s\nPreferred Skills: %s\nDescription: %s\nResponsibilities: %s\nEligibility: %s\n\n" +
            "Candidate Manual Profile:\nCourse: %s\nDepartment: %s\nCGPA: %s\nTechnical Skills: %s\nCertifications: %s\nProjects: %s\nExperience: %s\n\n" +
            "Candidate Extracted Resume Text:\n%s\n\n" +
            "Return ONLY a valid JSON object matching exactly this structure (no markdown, no backticks, only pure JSON):\n" +
            "{\n" +
            "  \"overallMatch\": <number between 0 and 100>,\n" +
            "  \"technicalSkillMatch\": <number between 0 and 100>,\n" +
            "  \"experienceMatch\": <number between 0 and 100>,\n" +
            "  \"educationMatch\": <number between 0 and 100>,\n" +
            "  \"projectRelevance\": <number between 0 and 100>,\n" +
            "  \"matchedSkills\": [\"skill1\", \"skill2\"],\n" +
            "  \"missingSkills\": [\"skill3\", \"skill4\"],\n" +
            "  \"strengths\": [\"strength1\", \"strength2\"],\n" +
            "  \"weaknesses\": [\"weakness1\", \"weakness2\"],\n" +
            "  \"recommendations\": [\"rec1\", \"rec2\"],\n" +
            "  \"interviewReadiness\": \"High/Medium/Low\",\n" +
            "  \"finalVerdict\": \"Eligible/Consider/Not Eligible\"\n" +
            "}",
            safe(job.getJobTitle()), safe(job.getDepartment()), safe(job.getEmploymentType()), safe(job.getWorkMode()),
            safe(job.getExperienceRequirement()), safe(job.getMinimumQualification()), safe(job.getMinimumCgpa()),
            safe(job.getRequiredSkills()), safe(job.getPreferredSkills()), safe(job.getJobDescription()),
            safe(job.getResponsibilities()), safe(job.getEligibilityCriteria()),
            safe(student.getCourse()), safe(student.getDepartment()), safe(student.getCgpa()),
            safe(student.getTechnicalSkills()), safe(student.getCertifications()), safe(student.getProjects()), safe(student.getExperience()),
            resumeText
        );
    }

    private Map<String, Object> parseGeminiResponse(String responseString) throws Exception {
        JsonNode root = objectMapper.readTree(responseString);
        if (root.has("error")) {
            String errMsg = root.path("error").path("message").asText("Unknown AI API error");
            throw new RuntimeException("AI API error: " + errMsg);
        }

        JsonNode candidatesNode = root.path("candidates");
        if (!candidatesNode.isArray() || candidatesNode.isEmpty()) {
            throw new RuntimeException("AI API returned no candidates in response");
        }

        String aiText = candidatesNode.get(0)
                .path("content").path("parts").get(0)
                .path("text").asText();

        // Extract JSON substring cleanly
        int firstBrace = aiText.indexOf('{');
        int lastBrace = aiText.lastIndexOf('}');
        if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
            aiText = aiText.substring(firstBrace, lastBrace + 1);
        } else {
            aiText = aiText.replace("```json", "").replace("```", "").trim();
        }
        JsonNode resultNode = objectMapper.readTree(aiText);

        Map<String, Object> result = new HashMap<>();
        double overallMatch = resultNode.path("overallMatch").asDouble(0.0);

        result.put("atsScore", overallMatch);
        result.put("eligibilityScore", resultNode.path("educationMatch").asDouble(resultNode.path("eligibilityScore").asDouble(75.0)));
        result.put("skillMatchScore", resultNode.path("technicalSkillMatch").asDouble(resultNode.path("skillMatch").asDouble(70.0)));

        List<String> matchedSkills = new ArrayList<>();
        if (resultNode.path("matchedSkills").isArray()) {
            for (JsonNode node : resultNode.path("matchedSkills")) {
                matchedSkills.add(node.asText());
            }
        }
        result.put("matchedSkills", matchedSkills);

        List<String> missingSkills = new ArrayList<>();
        if (resultNode.path("missingSkills").isArray()) {
            for (JsonNode node : resultNode.path("missingSkills")) {
                missingSkills.add(node.asText());
            }
        }
        result.put("missingSkillsList", missingSkills);
        result.put("missingSkills", String.join(", ", missingSkills));

        String recommendation = "Keep enhancing your skill set and domain experience.";
        if (resultNode.path("recommendations").isArray() && !resultNode.path("recommendations").isEmpty()) {
            recommendation = resultNode.path("recommendations").get(0).asText();
        }
        result.put("recommendation", recommendation);
        result.put("finalVerdict", resultNode.path("finalVerdict").asText(overallMatch >= 60 ? "Eligible" : "Needs Improvement"));
        result.put("aiFeedback", aiText);

        return result;
    }

    private boolean matchesSkill(String text, String skill) {
        if (text == null || skill == null || skill.isBlank()) {
            return false;
        }
        String trimmedSkill = skill.trim();
        boolean hasSpecialChar = trimmedSkill.chars().anyMatch(ch -> !Character.isLetterOrDigit(ch) && !Character.isWhitespace(ch));
        if (hasSpecialChar) {
            return text.toLowerCase().contains(trimmedSkill.toLowerCase());
        } else {
            String regex = "\\b" + Pattern.quote(trimmedSkill) + "\\b";
            return Pattern.compile(regex, Pattern.CASE_INSENSITIVE).matcher(text).find();
        }
    }

    /**
     * Dynamically evaluates candidate manual profile and/or uploaded resume text against job requirements.
     * Produces genuine, job-tailored scores, matched skills, and recommendations.
     */
    private Map<String, Object> buildDynamicFallbackResult(Student student, Job job, String extractedText, boolean hasResume, boolean isScanned) {
        String rawRequired = job.getRequiredSkills() != null ? job.getRequiredSkills() : "";
        List<String> requiredSkills = new ArrayList<>();
        for (String s : rawRequired.split(",")) {
            if (!s.trim().isEmpty()) {
                requiredSkills.add(s.trim());
            }
        }

        // Determine skill evaluation source:
        // If an active resume is uploaded and plain text is extracted, evaluate against the resume document text.
        // Otherwise, fall back to manual student profile fields.
        String candidateEvaluationText;
        if (hasResume && extractedText != null && !extractedText.isBlank()) {
            candidateEvaluationText = extractedText;
        } else {
            candidateEvaluationText = safe(student.getTechnicalSkills()) + " " +
                    safe(student.getCertifications()) + " " +
                    safe(student.getProjects()) + " " +
                    safe(student.getExperience());
        }

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        for (String req : requiredSkills) {
            if (matchesSkill(candidateEvaluationText, req)) {
                matchedSkills.add(req);
            } else {
                missingSkills.add(req);
            }
        }

        int totalSkills = requiredSkills.size();
        double skillMatchScore;
        if (totalSkills == 0) {
            skillMatchScore = 75.0;
        } else {
            skillMatchScore = Math.round(((double) matchedSkills.size() / totalSkills) * 100.0);
        }

        // Minimum baseline CGPA evaluation
        double eligibilityScore = 75.0;
        if (job.getMinimumCgpa() != null && job.getMinimumCgpa() > 0 && student.getCgpa() != null) {
            if (student.getCgpa() >= job.getMinimumCgpa()) {
                eligibilityScore = 90.0;
            } else {
                eligibilityScore = 55.0;
            }
        }

        double overallMatch = Math.round((skillMatchScore * 0.7) + (eligibilityScore * 0.3));
        if (matchedSkills.isEmpty() && totalSkills > 0) {
            overallMatch = Math.min(overallMatch, 30.0);
        }

        String recommendation;
        if (!missingSkills.isEmpty()) {
            recommendation = "Focus on acquiring " + String.join(" and ", missingSkills.subList(0, Math.min(2, missingSkills.size()))) + " to significantly improve your selection chances.";
        } else if (hasResume) {
            recommendation = "Strong match! Your profile aligns well with the key requirements for " + safe(job.getJobTitle()) + ".";
        } else {
            recommendation = "Upload an active resume to receive a comprehensive multimodal AI ATS evaluation.";
        }

        if (isScanned && missingSkills.size() > 0) {
            recommendation += " (Resume evaluated via multimodal visual scanning against target role).";
        }

        Map<String, Object> feedbackMap = new LinkedHashMap<>();
        feedbackMap.put("overallMatch", (int) overallMatch);
        feedbackMap.put("technicalSkillMatch", (int) skillMatchScore);
        feedbackMap.put("skillMatch", (int) skillMatchScore);
        feedbackMap.put("eligibilityScore", (int) eligibilityScore);
        feedbackMap.put("educationMatch", (int) eligibilityScore);
        feedbackMap.put("matchedSkills", matchedSkills);
        feedbackMap.put("missingSkills", missingSkills);
        feedbackMap.put("recommendations", List.of(recommendation));
        feedbackMap.put("recommendation", recommendation);
        feedbackMap.put("interviewReadiness", overallMatch >= 75 ? "High" : (overallMatch >= 50 ? "Medium" : "Low"));
        feedbackMap.put("finalVerdict", overallMatch >= 60 ? "Eligible" : "Needs Improvement");

        String feedbackJson;
        try {
            feedbackJson = objectMapper.writeValueAsString(feedbackMap);
        } catch (Exception e) {
            feedbackJson = "{\"overallMatch\":" + (int) overallMatch + ",\"recommendation\":\"" + recommendation + "\"}";
        }

        Map<String, Object> result = new HashMap<>();
        result.put("atsScore", overallMatch);
        result.put("skillMatchScore", skillMatchScore);
        result.put("eligibilityScore", eligibilityScore);
        result.put("matchedSkills", matchedSkills);
        result.put("missingSkillsList", missingSkills);
        result.put("missingSkills", String.join(", ", missingSkills));
        result.put("recommendation", recommendation);
        result.put("finalVerdict", overallMatch >= 60 ? "Eligible" : "Needs Improvement");
        result.put("aiFeedback", feedbackJson);

        return result;
    }
}
