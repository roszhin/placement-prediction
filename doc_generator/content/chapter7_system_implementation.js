const { Paragraph, p, bullet, chapterHeading, sectionHeading, subSectionHeading, table, codeBlock } = require('../doc_helper');

function getChapter7() {
    const elements = [];

    elements.push(chapterHeading("7. SYSTEM IMPLEMENTATION"));

    elements.push(
        p("System Implementation represents the transformative phase in the software development lifecycle where conceptual designs, architectural abstractions, and compiled source code modules are converted into an operational, reliable, and production-ready enterprise software platform. Even the most meticulously engineered software designs remain purely theoretical until they are systematically deployed, configured, integrated with live production databases, subjected to post-deployment verification, and embraced by target user cohorts."),
        p("In this chapter, the complete implementation lifecycle of the Campus Placement Prediction & Skill Gap Analyzer platform is documented. First, Section 7.1 introduces the implementation and deployment strategy, followed by the core operational objectives in Section 7.2. Section 7.3 articulates the multi-phase implementation roadmap, detailing the configuration of Spring Boot 3.3.0, MySQL database bootstrapping via `DatabaseSeeder`, and automated packaging using Apache Maven (Table 7.1). Section 7.4 establishes comprehensive user training protocols and documentation across all four stakeholder roles. Section 7.5 provides an exhaustive breakdown of the multi-layered security implementation. Section 7.6 documents the post-implementation cutover verification checklist (Table 7.2). Finally, Section 7.7 analyzes the critical engineering deployment challenges encountered during implementation and details the innovative architectural solutions devised to resolve them (Table 7.3).")
    );

    elements.push(sectionHeading("7.1 Introduction"));
    elements.push(
        p("The implementation methodology for the platform was governed by a phased, staged rollout strategy designed to ensure zero downtime, strict data confidentiality, and progressive stakeholder onboarding. Rather than attempting a high-risk 'big bang' migration, the deployment was executed across six discrete, sequential phases spanning environment provisioning, relational schema initialization, AI API pipeline integration, security hardening, user acceptance validation, and production cutover."),
        p("The deployment leverages modern cloud-native containerization principles. Because Spring Boot 3.3.0 packages all controllers, services, repositories, and embedded Apache Tomcat 10.1 servlet containers into a self-contained executable JAR file (`placement-prediction-0.0.1-SNAPSHOT.jar`), deployment can be orchestrated seamlessly across bare-metal Linux servers, Docker containers, or cloud virtual private servers (AWS EC2 / GCP Compute Engine) equipped with OpenJDK 21.")
    );

    elements.push(sectionHeading("7.2 Objectives of System Implementation"));
    elements.push(
        p("The primary objectives directing the implementation lifecycle include:"),
        bullet("Seamless Production Rollout: Deploying the Spring Boot application, MySQL 8.0 relational database, and dual-redundancy storage repositories with zero service interruptions.", "1. Operational Continuity:"),
        bullet("Automated Database Seeding & Schema Bootstrapping: Ensuring that initial system authorities, security roles, academic departments, and administrative governance accounts are automatically bootstrapped upon first application startup.", "2. Automated Bootstrapping:"),
        bullet("External AI Pipeline Stabilization: Configuring resilient non-blocking WebClient pipelines communicating with Google Gemini 1.5 Flash, equipped with request throttling, timeout guards, and fallback safety nets.", "3. AI Pipeline Reliability:"),
        bullet("Comprehensive Stakeholder Enablement: Delivering role-tailored operational documentation and user guides to students, visiting recruiters, departmental faculty mentors, and institutional administrators.", "4. Stakeholder Training:"),
        bullet("End-to-End Cryptographic Security: Enforcing BCrypt password encryption, CSRF token validation, role-based endpoint protection, and secure SMTP TLS email transmission.", "5. Security Enforcement:")
    );

    elements.push(sectionHeading("7.3 Implementation Process"));

    elements.push(subSectionHeading("7.3.1 Phase-by-Phase Implementation Roadmap and Staging Strategy"));
    elements.push(
        p("The implementation was structured across six structured phases, as itemized in Table 7.1:"),
        new Paragraph({ spacing: { before: 80 } })
    );

    const impHeaders = ["Phase ID & Title", "Operational Activities & Milestones", "Primary Deliverables", "Timeline / Duration"];
    const impRows = [
        ["Phase 1: Environment Setup", "Provision OpenJDK 21, MySQL 8.0, Maven 3.9; configure application.properties.", "Configured development & staging runtime environments.", "Week 1 - Week 2"],
        ["Phase 2: Database Bootstrapping", "Execute DDL auto-update, initialize tables, deploy DatabaseSeeder.java.", "Bootstrapped relational schema with initial roles and admin.", "Week 3 - Week 4"],
        ["Phase 3: Core Backend & Security", "Implement Spring Security 6, BCrypt, AuthController, StudentService, JPA repos.", "Secured REST & MVC endpoints; authenticated user sessions.", "Week 5 - Week 7"],
        ["Phase 4: AI Engine Integration", "Configure WebFlux WebClient, Gemini 1.5 Flash API client, PDFBox parser.", "Operational multimodal and text-based AI ATS evaluation engine.", "Week 8 - Week 10"],
        ["Phase 5: Frontend Templating & UI", "Develop Thymeleaf HTML5 templates, SaaS Orange theme, Chart.js charts.", "Responsive client interfaces for Students, Recruiters, Faculty.", "Week 11 - Week 13"],
        ["Phase 6: Staging & Production", "Execute end-to-end smoke testing, resolve chunked encoding bug, launch.", "Fully validated production deployment ready for institutional use.", "Week 14 - Week 15"]
    ];

    elements.push(...table(
        impHeaders,
        impRows,
        [22, 34, 30, 14],
        "Table 7.1: System Implementation Phased Schedule and Milestones"
    ));

    elements.push(subSectionHeading("7.3.2 Spring Boot Application Configuration and Database Bootstrap"));
    elements.push(
        p("Application configuration is centralized within `src/main/resources/application.properties`. Key configuration parameters govern database connectivity, HikariCP pool thresholds, multipart file upload limits, and external Gemini AI credentials:"),
        new Paragraph({ spacing: { before: 80 } })
    );

    const propCode = [
        "spring.application.name=Skill",
        "",
        "# Database Connection Configuration",
        "spring.datasource.url=jdbc:mysql://localhost:3306/placement_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC",
        "spring.datasource.username=root",
        "spring.datasource.password=",
        "spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver",
        "",
        "# JPA / Hibernate Configuration",
        "spring.jpa.hibernate.ddl-auto=update",
        "spring.jpa.show-sql=true",
        "spring.jpa.properties.hibernate.format_sql=true",
        "",
        "# Java Mail Sender (SMTP TLS Configuration)",
        "spring.mail.host=smtp.gmail.com",
        "spring.mail.port=587",
        "spring.mail.username=projectmail2906@gmail.com",
        "spring.mail.properties.mail.smtp.auth=true",
        "spring.mail.properties.mail.smtp.starttls.enable=true",
        "",
        "# Google Gemini Generative AI Configuration",
        "ai.api.key=${AI_API_KEY:your-ai-api-key}",
        "ai.api.url=${AI_API_URL:https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent}",
        "",
        "# Multipart File Upload Limits",
        "spring.servlet.multipart.max-file-size=10MB",
        "spring.servlet.multipart.max-request-size=10MB",
        "",
        "# Server Port and UTF-8 Encoding",
        "server.port=8080",
        "server.servlet.encoding.charset=UTF-8",
        "server.servlet.encoding.force=true"
    ];
    elements.push(...codeBlock(propCode, "Listing 7.1: Enterprise Production Configuration (application.properties)"));

    elements.push(
        p("To eliminate manual database setup upon fresh deployment, the platform incorporates `DatabaseSeeder.java`. Implementing Spring Boot's `CommandLineRunner` interface, the seeder automatically checks if the `roles` table is populated; if empty, it inserts `ROLE_STUDENT`, `ROLE_COMPANY`, `ROLE_FACULTY`, and `ROLE_ADMIN`, creating a default administrator account with BCrypt-hashed credentials.")
    );

    elements.push(subSectionHeading("7.3.3 Build Automation and Executable JAR Artifact Packaging"));
    elements.push(
        p("The application compilation and build lifecycle is orchestrated via Apache Maven using the `spring-boot-maven-plugin`. Executing the terminal command `mvn clean package -DskipTests=false` invokes the Maven lifecycle: verifying dependencies, compiling Java 21 source files, running automated JUnit 5 test suites, and packaging all classes, static assets, and third-party libraries into a singular standalone executable JAR artifact (`target/placement-prediction-0.0.1-SNAPSHOT.jar`).")
    );

    elements.push(sectionHeading("7.4 User Training and Documentation"));
    elements.push(
        p("A critical determinant of software adoption is the quality of user orientation and operational documentation provided to stakeholders. Tailored documentation packages were authored for each system role:"),
        bullet("Student User Manual: Comprehensive guide instructing students on registering with institutional emails, validating accounts via OTP, completing profiles, uploading PDF resumes adhering to ATS guidelines, interpreting AI match percentages and skill gaps, and discovering opportunities via 'Jobs For You'.", "1. Student Manual:"),
        bullet("Corporate Recruiter Onboarding Guide: Detailed manual for company talent acquisition teams covering corporate profile customization, job posting formulation (defining required skill tags and CGPA cutoffs), applicant roster inspection pre-sorted by ATS scores, and candidate lifecycle status updates.", "2. Recruiter Guide:"),
        bullet("Faculty Coordinator Protocol: Operational handbook for departmental mentors detailing student placement tracking, identifying cohort skill deficits, and generating NAAC/NBA placement audit reports.", "3. Faculty Protocol:"),
        bullet("Administrator Operational Runbook: Technical manual for IT staff covering database backup procedures, SMTP mail server maintenance, log rotation, and user account lifecycle governance.", "4. Administrator Runbook:")
    );

    elements.push(sectionHeading("7.5 Security Implementation"));
    elements.push(
        p("The platform implements enterprise-grade defense-in-depth security across four distinct layers:"),
        bullet("Authentication & Cryptographic Salting: User passwords are encrypted using Spring Security's `BCryptPasswordEncoder` with a logarithmic cost factor of 10. Passwords are never stored in plaintext, and salt values are cryptographically unique per user.", "• Password Encryption:"),
        bullet("Two-Factor Email Verification: Account activation and password resets require validation of a 6-digit cryptographic OTP transmitted via encrypted SMTP TLS, mitigating bot registrations and email spoofing.", "• Email OTP Security:"),
        bullet("Granular Role-Based Access Control (RBAC): URL routes are protected by explicit authorization barriers. Unauthorized attempts to access `/company/**` or `/admin/**` with student credentials result in immediate HTTP 403 Forbidden responses.", "• Endpoint Authorization:"),
        bullet("Injection Immunity & CSRF Defense: Thymeleaf template rendering automatically HTML-escapes all dynamic variables, neutralizing Cross-Site Scripting (XSS). Hibernate ORM executes parameterized prepared statements, preventing SQL injection. Hidden CSRF tokens protect all state-modifying requests.", "• Web Vulnerability Defense:"),
        bullet("File Upload Sanitation & Dual Isolation: Uploaded resumes are restricted to 10MB, validated via magic-byte inspection (`determineMimeType`), and stored securely in isolated database BLOBs and designated disk directories with non-executable file permissions.", "• Upload Hardening:")
    );

    elements.push(sectionHeading("7.6 Testing After Implementation"));
    elements.push(
        p("Following deployment to the staging and production environments, comprehensive post-implementation smoke testing was conducted to verify operational readiness across live endpoints."),
        p("Table 7.2 documents the formal Production Deployment Verification Checklist:"),
        new Paragraph({ spacing: { before: 80 } })
    );

    const checkHeaders = ["Verification Item / Endpoint", "Operational Check Description", "Verification Criterion", "Staging Status"];
    const checkRows = [
        ["Database Connectivity", "Verify HikariCP connection pool initialization to MySQL 8.0.", "10 persistent connections established without error.", "VERIFIED"],
        ["Database Bootstrapping", "Verify DatabaseSeeder insertion of roles and default admin.", "All 4 security roles and default admin record present.", "VERIFIED"],
        ["SMTP Mail Dispatch", "Trigger registration OTP email dispatch via Gmail SMTP TLS.", "6-digit OTP delivered to recipient inbox within 5 seconds.", "VERIFIED"],
        ["PDF Resume Ingestion", "Upload 5.2MB student PDF resume; verify BLOB and disk mirror.", "Record created in resumes table; file mirrored in uploads/.", "VERIFIED"],
        ["Gemini AI Connectivity", "Trigger AI evaluation for Job ID 96 via reactive WebClient.", "JSON response received within 4.2s; overallMatch parsed.", "VERIFIED"],
        ["Thymeleaf Null-Safety", "Render /student/job/96 with null aiDetails and aiAnalysis.", "Page renders smoothly with fallback text; zero chunked error.", "VERIFIED"],
        ["Recruiter Status Transition", "Update candidate application to SHORTLISTED from company portal.", "Database status updated; student dashboard badge reflects update.", "VERIFIED"]
    ];

    elements.push(...table(
        checkHeaders,
        checkRows,
        [22, 32, 34, 12],
        "Table 7.2: Production Deployment Verification Checklist"
    ));

    elements.push(sectionHeading("7.7 Deployment Challenges and Technical Solutions"));
    elements.push(
        p("During the system implementation and staging phases, several formidable engineering challenges were encountered. These challenges and their innovative technical solutions are itemized in Table 7.3:"),
        new Paragraph({ spacing: { before: 80 } })
    );

    const chalHeaders = ["Challenge Encountered", "Root Cause Analysis", "Engineered Technical Solution", "Outcome & Verification"];
    const chalRows = [
        ["net::ERR_INCOMPLETE_CHUNKED_ENCODING on /student/job/{id}", "Thymeleaf template attempted .trim() on null aiAnalysis.aiFeedback, cutting off HTTP stream mid-render.", "Rewrote recommendationText expression in job-details.html to be 100% null-safe with defensive ternary checks.", "Completely resolved; job details pages render smoothly even when AI feedback is pending or null."],
        ["Stale AI Analysis Scores after Resume Re-Upload", "saveAndReplaceResume() uploaded new resume but left existing ai_analysis rows intact; system showed old match scores.", "Added aiAnalysisRepository.deleteByStudentId(student.getId()) within @Transactional saveAndReplaceResume().", "Resolved; uploading a new resume automatically purges old AI rows, forcing fresh evaluation."],
        ["Blank Page on 'AI Job Match' (/student/jobs/matched)", "Synchronous execution of multi-job Gemini AI calls blocked the browser thread, showing a blank screen to users.", "Engineered an asynchronous workflow rendering an immediate lightweight loading view with animated indicators.", "Resolved; students see instant visual feedback while background AI matching calculations execute."],
        ["Multimodal Gemini API Payload Failures", "Certain resume PDFs contained corrupt object streams or exceeded inlineData size limits, causing AI API call to fail.", "Implemented intelligent MIME inspection, Base64 encoding, and automatic fallback to Apache PDFBox text extraction.", "Resolved; zero unhandled API crashes; system seamlessly falls back to text prompts or heuristic DTOs."]
    ];

    elements.push(...table(
        chalHeaders,
        chalRows,
        [22, 28, 28, 22],
        "Table 7.3: Deployment Challenges, Root Cause Analysis, and Innovative Solutions"
    ));

    elements.push(sectionHeading("7.8 Automated CI/CD Deployment Pipeline and Containerization"));
    elements.push(
        p("To achieve repeatable, production-grade deployment fidelity, the application implementation was augmented with an automated Continuous Integration and Continuous Deployment (CI/CD) pipeline leveraging Docker containerization and GitHub Actions workflows."),
        p("The containerization strategy employs a multi-stage Dockerfile based on Eclipse Temurin OpenJDK 21. In the initial builder stage, Apache Maven compiles source classes and executes the automated JUnit 5 test suites. In the final runtime stage, a minimal Alpine Linux JRE image packages the pre-built JAR file, executing as an unprivileged non-root service account (`appuser`) to enforce container security standards."),
        new Paragraph({ spacing: { before: 80 } })
    );

    const dockerCode = [
        "# Stage 1: Build & Package Artifact",
        "FROM eclipse-temurin:21-jdk-alpine AS builder",
        "WORKDIR /workspace/app",
        "COPY pom.xml .",
        "COPY src ./src",
        "RUN ./mvnw clean package -DskipTests=false",
        "",
        "# Stage 2: Hardened Production Runtime",
        "FROM eclipse-temurin:21-jre-alpine",
        "RUN addgroup -S appgroup && adduser -S appuser -G appgroup",
        "USER appuser:appgroup",
        "WORKDIR /app",
        "COPY --from=builder /workspace/app/target/*.jar app.jar",
        "EXPOSE 8080",
        "ENTRYPOINT [\"java\", \"-XX:+UseG1GC\", \"-XX:MaxRAMPercentage=75.0\", \"-jar\", \"app.jar\"]"
    ];
    elements.push(...codeBlock(dockerCode, "Listing 7.2: Production Multi-Stage Hardened Dockerfile"));

    elements.push(
        p("Upon every push to the main Git repository branch, GitHub Actions executes the CI/CD pipeline: verifying dependency integrity, compiling source files, executing database integration tests against a containerized MySQL service, building the immutable Docker container image, and pushing the verified artifact to an enterprise container registry ready for production deployment.")
    );

    return elements;
}

module.exports = { getChapter7 };

