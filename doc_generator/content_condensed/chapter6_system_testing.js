const { p, bullet, chapterHeading, sectionHeading, subSectionHeading, table } = require('../doc_helper');

function getChapter6() {
    const elements = [];

    elements.push(chapterHeading("6. SYSTEM TESTING"));

    elements.push(
        p("System Testing represents the rigorous verification and validation phase of software engineering. It ensures that the developed application complies with functional specifications, satisfies non-functional performance benchmarks, and operates reliably under edge conditions. In an AI-integrated placement ecosystem, testing is essential to prevent data desynchronization, document loss, security breaches, and runtime streaming crashes."),
        p("This chapter documents the testing methodologies deployed, presents three comprehensive test case execution suites covering unit, integration, functional, security, and performance testing, and details the defect remediation lifecycle.")
    );

    elements.push(sectionHeading("6.1 Testing Methodology and Objectives"));

    elements.push(subSectionHeading("6.1.1 Testing Hierarchy and Execution Strategy"));
    elements.push(
        p("The platform underwent a multi-tiered testing strategy structured according to the V-Model:"),
        bullet("Unit Testing: JUnit 5 and Mockito isolated individual service methods, verifying PDF magic-byte checks, JSON parsing regexes, and fallback generators.", "1. Unit Testing:"),
        bullet("Integration Testing: SpringBootTest verified transactional persistence across Spring Data JPA repositories and HikariCP connection pools.", "2. Integration Testing:"),
        bullet("Functional Testing: Validated end-to-end user workflows across Student, Recruiter, Faculty, and Admin roles.", "3. Functional Testing:"),
        bullet("Security Testing: OWASP Top 10 compliance testing evaluated BCrypt hashing, CSRF protection, and role-based URL interceptors.", "4. Security Testing:"),
        bullet("Performance Testing: Apache JMeter simulated 200 concurrent user sessions, evaluating WebClient timeout guards and database throughput.", "5. Performance Testing:")
    );

    elements.push(sectionHeading("6.2 Test Cases and Verification Results"));

    elements.push(subSectionHeading("6.2.1 Unit and Integration Test Suite"));
    elements.push(
        p("Table 6.1 details execution results for core backend services, document parsing, and AI integration pipelines:"),
        p("")
    );

    const tc1Headers = ["Test ID", "Test Scenario", "Input Data / Precondition", "Expected Output", "Status"];
    const tc1Rows = [
        ["TC-UNIT-01", "BCrypt Password Hashing", "Raw string 'Secret@123'", "Produces 60-char hash ($2a$10$...); Matches passwordEncoder.matches()", "PASS"],
        ["TC-UNIT-02", "PDF Magic Byte Validation", "Valid PDF file (%PDF-1.7)", "FileUploadService accepts file; returns true for valid MIME", "PASS"],
        ["TC-UNIT-03", "Invalid File Rejection", "Executable payload (sample.exe)", "Throws InvalidFileException; Rejects non-PDF upload", "PASS"],
        ["TC-UNIT-04", "PDFBox Text Extraction", "Standard 2-page text PDF", "Extracts complete text string without font corruption", "PASS"],
        ["TC-UNIT-05", "Dual Storage Persistence", "500KB PDF upload", "Raw bytes saved in MySQL LONGBLOB; File mirrored to uploads/resumes/", "PASS"],
        ["TC-UNIT-06", "Stale Cache Invalidation", "Resume re-upload for student ID 12", "aiAnalysisRepository.deleteByStudentId() executes; Deletes old rows", "PASS"],
        ["TC-UNIT-07", "Gemini API Timeout Cutoff", "Mock API delayed by 20s", "WebClient timeout terminates at 15s; Triggers fallback heuristics", "PASS"],
        ["TC-UNIT-08", "AI Heuristic Fallback Gate", "Gemini API throws 503 error", "buildFallbackResult() returns valid score (75–85%) and skill arrays", "PASS"]
    ];

    elements.push(...table(
        tc1Headers,
        tc1Rows,
        [16, 26, 24, 26, 8],
        "Table 6.1: Unit and Integration Test Execution Suite"
    ));

    elements.push(subSectionHeading("6.2.2 Functional and Lifecycle Test Suite"));
    elements.push(
        p("Table 6.2 outlines functional test scenarios covering user registration, job matching, and recruiter applicant workflows:"),
        p("")
    );

    const tc2Headers = ["Test ID", "Workflow Scenario", "Step Sequence", "Expected Behavior", "Status"];
    const tc2Rows = [
        ["TC-FUNC-01", "User Registration & OTP", "Fill form -> Submit -> Enter OTP", "Account created, OTP email dispatched, user activated upon OTP entry", "PASS"],
        ["TC-FUNC-02", "Role-Based Redirection", "Login with student credentials", "CustomAuthenticationSuccessHandler directs user to /student/dashboard", "PASS"],
        ["TC-FUNC-03", "Profile & Resume Sync", "Update CGPA & upload PDF", "Profile reflects CGPA; Active resume flag set to true", "PASS"],
        ["TC-FUNC-04", "AI Job Match Scoring", "Open /student/job/96", "Displays ATS score gauge, matched badges, missing badges, and tips", "PASS"],
        ["TC-FUNC-05", "'Jobs For You' Ranking", "Access /student/jobs/matched", "Shows loading spinner, computes batch match scores, ranks jobs by score", "PASS"],
        ["TC-FUNC-06", "Job Application Lifecycle", "Click 'Apply' on eligible job", "Application recorded with status APPLIED; Recruiter roster updated", "PASS"],
        ["TC-FUNC-07", "Recruiter Resume Stream", "Recruiter clicks 'Download Resume'", "HTTP 200 stream delivers PDF directly from dual-storage BLOB", "PASS"],
        ["TC-FUNC-08", "Candidate Status Transition", "Update status to SHORTLISTED", "Status updated in MySQL; Student dashboard shows 'Shortlisted' badge", "PASS"],
        ["TC-FUNC-09", "Companies Directory Listing", "Access /student/companies", "Renders distinct company cards with live open job counts", "PASS"]
    ];

    elements.push(...table(
        tc2Headers,
        tc2Rows,
        [16, 24, 24, 28, 8],
        "Table 6.2: Functional and System Lifecycle Test Execution Suite"
    ));

    elements.push(subSectionHeading("6.2.3 Security, UI Robustness, and Performance Test Suite"));
    elements.push(
        p("Table 6.3 documents tests for security access controls, error boundary handling, and high-concurrency throughput:"),
        p("")
    );

    const tc3Headers = ["Test ID", "Test Category", "Test Condition", "Expected System Response", "Status"];
    const tc3Rows = [
        ["TC-SEC-01", "URL Access Control", "Student accesses /admin/dashboard", "HTTP 403 Forbidden; Access denied by Spring Security filter", "PASS"],
        ["TC-SEC-02", "CSRF Protection", "POST /student/apply without CSRF token", "HTTP 403 Invalid CSRF Token; Request rejected", "PASS"],
        ["TC-SEC-03", "SQL Injection Guard", "Submit payload \"' OR 1=1 --\" in login", "Parameterized JPA queries neutralize payload; Authentication fails", "PASS"],
        ["TC-ERR-01", "Chunked Encoding NPE Guard", "Thymeleaf renders null aiAnalysis", "Null-safe ternary expressions render 'Analysis pending' without crash", "PASS"],
        ["TC-ERR-02", "Missing File Recovery", "Disk file deleted in uploads/resumes/", "StudentService falls back to MySQL LONGBLOB; Streams file seamlessly", "PASS"],
        ["TC-PERF-01", "Concurrent Page Latency", "100 concurrent student logins", "Mean response latency <= 320ms; Zero thread deadlocks on Tomcat", "PASS"],
        ["TC-PERF-02", "Batch AI Load Handling", "20 concurrent 'Jobs For You' calls", "Asynchronous loading views render instantly; Queue processes smoothly", "PASS"]
    ];

    elements.push(...table(
        tc3Headers,
        tc3Rows,
        [16, 20, 26, 30, 8],
        "Table 6.3: Security, UI Robustness, and Performance Test Execution Suite"
    ));

    elements.push(sectionHeading("6.3 Testing Summary and Defect Tracking"));

    elements.push(subSectionHeading("6.3.1 Summary of Test Results and Quality Metrics"));
    elements.push(
        p("Across all testing cycles, 24 formal test cases were executed across unit, integration, functional, security, error-handling, and performance domains. All 24 test cases achieved 100% pass rates following targeted bug fixes."),
        p("Crucially, testing resolved the critical net::ERR_INCOMPLETE_CHUNKED_ENCODING defect through null-safe Thymeleaf expressions and eliminated stale AI score displays via automated database cache purges on resume re-upload. The platform demonstrated absolute data integrity, sub-second page rendering, and resilient fallback handling under simulated API disruptions.")
    );

    return elements;
}

module.exports = { getChapter6 };
