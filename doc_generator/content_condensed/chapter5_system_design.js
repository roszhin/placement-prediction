const path = require('path');
const { p, bullet, chapterHeading, sectionHeading, subSectionHeading, figure, table } = require('../doc_helper');

function getChapter5() {
    const elements = [];

    elements.push(chapterHeading("5. SYSTEM DESIGN"));

    elements.push(
        p("System Design translates conceptual requirements into a structured, verifiable engineering blueprint. In enterprise software development, system design ensures that procedural workflows, data flow architectures, entity relationships, input interfaces, and database schemas are mathematically sound, modular, and resilient against runtime exceptions."),
        p("This chapter documents the complete technical design of the platform: Section 5.1 presents the System Flow Chart (Figure 5.1); Section 5.2 provides the Data Flow Diagrams across Levels 0 through 3 (Figures 5.2–5.5); Section 5.3 presents the Entity-Relationship Diagram (Figure 5.6); Section 5.4 details Input Form Design (Tables 5.1–5.3); Section 5.5 provides complete schema definitions for all 11 database tables (Tables 5.4–5.14); and Section 5.6 outlines Output Design specifications.")
    );

    // ==========================================
    // 5.1 SYSTEM FLOW CHART
    // ==========================================
    elements.push(sectionHeading("5.1 Flow Chart"));

    elements.push(subSectionHeading("5.1.1 System Flow Chart Diagram"));
    elements.push(
        p("Figure 5.1 visualizes the holistic operational trajectory of the platform, tracing execution pathways across Students, Recruiters, Faculty, and Administrators from initial authentication to final corporate selection:"),
        p("")
    );

    const flowImgPath = path.join(__dirname, '..', 'diagrams', 'flowchart_diagram.png');
    elements.push(...figure(
        flowImgPath,
        "Figure 5.1: End-to-End Placement & AI ATS Evaluation System Flow Chart",
        480,
        250
    ));

    elements.push(subSectionHeading("5.1.2 Flow Chart Process Description"));
    elements.push(
        p("The end-to-end processing sequence comprises twelve sequential execution stages:"),
        bullet("1. Registration & OTP: Users register with email and credentials; AuthService dispatches a 6-digit OTP via JavaMailSender over SMTP TLS for verification.", "Phase 1:"),
        bullet("2. Authentication & Routing: Spring Security 6 verifies BCrypt password hashes and routes authenticated actors to role-specific dashboards via CustomAuthenticationSuccessHandler.", "Phase 2:"),
        bullet("3. Profile Completion & Resume Upload: Students submit academic CGPA and upload PDF resumes. StudentService inspects %PDF magic bytes, saves binary streams to MySQL LONGBLOB, and mirrors files to uploads/resumes/.", "Phase 3:"),
        bullet("4. Cache Purge: StudentService executes aiAnalysisRepository.deleteByStudentId() to invalidate existing analysis rows, ensuring evaluations reflect updated resumes.", "Phase 4:"),
        bullet("5. Job Discovery & Ranking: Students browse jobs or view 'Jobs For You' (/student/jobs/matched), which dynamically ranks active openings by resume compatibility with asynchronous loading states.", "Phase 5:"),
        bullet("6. AI ATS Evaluation Trigger: Opening a job page (/student/job/{id}) checks for existing analysis; if absent, AIService initiates evaluation using active resume bytes.", "Phase 6:"),
        bullet("7. Non-Blocking AI Call: Spring WebClient sends a structured JSON prompt to Gemini 1.5 Flash with a 15-second response timeout.", "Phase 7:"),
        bullet("8. Response Parsing & Fallback: AIService extracts match percentage, matched skills, missing skills, and advice. If the API fails or times out, deterministic heuristic fallbacks are returned.", "Phase 8:"),
        bullet("9. UI Diagnostic Rendering: Thymeleaf renders null-safe evaluation cards, displaying circular score gauges, skill badges, and preparation recommendations.", "Phase 9:"),
        bullet("10. Job Application Submission: Eligible students submit single-click applications, recorded as Application entities with initial status APPLIED.", "Phase 10:"),
        bullet("11. Recruiter Pipeline Review: Recruiters inspect candidate rosters pre-sorted by ATS scores, stream candidate PDFs from dual storage, and update statuses (APPLIED -> SHORTLISTED -> SELECTED / REJECTED).", "Phase 11:"),
        bullet("12. Governance & Analytics: Faculty and Administrators monitor Chart.js placement visualizers, cohort skill deficits, and audit logs.", "Phase 12:")
    );

    // ==========================================
    // 5.2 DATA FLOW DIAGRAMS (DFDs)
    // ==========================================
    elements.push(sectionHeading("5.2 Data Flow Diagrams (DFDs)"));

    elements.push(subSectionHeading("5.2.1 DFD Level-0 Context Diagram"));
    elements.push(
        p("Figure 5.2 models the platform as a single centralized process (0.0: Campus Placement Prediction & AI ATS Skill Gap Analyzer) interfacing with external entities: Students, Company Recruiters, Faculty Coordinators, System Administrators, and Google Gemini AI:"),
        p("")
    );

    const dfd0ImgPath = path.join(__dirname, '..', 'diagrams', 'dfd0_diagram.png');
    elements.push(...figure(
        dfd0ImgPath,
        "Figure 5.2: Data Flow Diagram: Level-0 Context Diagram",
        480,
        250
    ));

    elements.push(
        p("The context diagram illustrates primary data boundaries: Students supply profile credentials, resume PDFs, and job applications, receiving ATS scorecards and matched job lists; Recruiters supply job specifications and candidate status updates, receiving filtered candidate rosters and resume streams; Faculty and Administrators receive institutional placement statistics; and the Gemini AI API processes structured prompts to return semantic ATS evaluation payloads.")
    );

    elements.push(subSectionHeading("5.2.2 DFD Level-1 Overview Decomposition"));
    elements.push(
        p("Figure 5.3 decomposes the central system into five core functional sub-processes: Process 1.0 (Authentication & User Identity), Process 2.0 (Student Profile & Resume Management), Process 3.0 (Job Posting & Company Management), Process 4.0 (AI ATS Resume Evaluation & Skill Gap Analysis), and Process 5.0 (Application Processing & Analytics):"),
        p("")
    );

    const dfd1ImgPath = path.join(__dirname, '..', 'diagrams', 'dfd1_diagram.png');
    elements.push(...figure(
        dfd1ImgPath,
        "Figure 5.3: Data Flow Diagram: Level-1 Overview Decomposition Diagram",
        480,
        250
    ));

    elements.push(
        p("Level-1 shows how data flows across persistent datastores: D1 (users), D2 (students), D3 (resumes), D4 (jobs), D5 (applications), D6 (ai_analysis), and D7 (companies). Uploading a resume writes to D3 and triggers an automatic deletion cascade on D6, ensuring immediate cache consistency.")
    );

    elements.push(subSectionHeading("5.2.3 DFD Level-2 AI ATS Evaluation Subsystem"));
    elements.push(
        p("Figure 5.4 details the computational sub-processes of Process 4.0: 4.1 (Resume Text Extraction via Apache PDFBox), 4.2 (Prompt Construction & Formatting), 4.3 (Reactive WebClient Dispatch & 15s Timeout), 4.4 (JSON Response Parsing & Regex Extraction), and 4.5 (Heuristic Fallback Handler):"),
        p("")
    );

    const dfd2ImgPath = path.join(__dirname, '..', 'diagrams', 'dfd2_diagram.png');
    elements.push(...figure(
        dfd2ImgPath,
        "Figure 5.4: Data Flow Diagram: Level-2 AI ATS Resume Evaluation Subsystem",
        480,
        250
    ));

    elements.push(
        p("Process 4.1 extracts textual tokens from PDF streams. Process 4.2 constructs JSON payloads with system instructions. Process 4.3 dispatches non-blocking HTTP requests to Gemini 1.5 Flash. If successful, Process 4.4 normalizes JSON fields and persists records into D6; otherwise, Process 4.5 intercepts exceptions and generates deterministic heuristic fallback scores.")
    );

    elements.push(subSectionHeading("5.2.4 DFD Level-3 Application Lifecycle Subsystem"));
    elements.push(
        p("Figure 5.5 details the recruiter-candidate application lifecycle (Process 5.0): 5.1 (Application Submission), 5.2 (Eligibility Filtering & CGPA Verification), 5.3 (Recruiter Applicant Review & Resume Streaming), and 5.4 (Candidate Status Transition):"),
        p("")
    );

    const dfd3ImgPath = path.join(__dirname, '..', 'diagrams', 'dfd3_diagram.png');
    elements.push(...figure(
        dfd3ImgPath,
        "Figure 5.5: Data Flow Diagram: Level-3 Recruiter Candidate Lifecycle Subsystem",
        480,
        250
    ));

    elements.push(
        p("When students apply, Process 5.1 validates eligibility against job criteria (5.2). Recruiters inspect candidate rosters pre-sorted by ATS scores (5.3) and stream PDF resumes directly from dual storage. When recruiters transition candidate statuses (5.4), updates are persisted in D5 and reflected across student dashboards.")
    );

    // ==========================================
    // 5.3 ENTITY-RELATIONSHIP (E-R) DIAGRAM
    // ==========================================
    elements.push(sectionHeading("5.3 Entity Relationship Diagram"));

    elements.push(subSectionHeading("5.3.1 Conceptual Entity-Relationship Model"));
    elements.push(
        p("Figure 5.6 details the complete Entity-Relationship (ER) model across all ten domain entities: User, Role, Student, Company, Faculty, Admin, Job, Resume, Application, and AiAnalysis:"),
        p("")
    );

    const erImgPath = path.join(__dirname, '..', 'diagrams', 'er_diagram.png');
    elements.push(...figure(
        erImgPath,
        "Figure 5.6: Entity-Relationship (ER) Diagram with Relational Cardinalities",
        480,
        260
    ));

    elements.push(subSectionHeading("5.3.2 Cardinalities and Relational Constraints"));
    elements.push(
        p("The ER model enforces strict relational cardinalities and integrity constraints:"),
        bullet("User to Student / Company / Faculty / Admin: One-to-One (1:1) polymorphic extension via foreign keys.", "1. User Hierarchies:"),
        bullet("User to Role: Many-to-Many (M:N) mediated by join table `user_roles`.", "2. Security Roles:"),
        bullet("Student to Resume: One-to-Many (1:N) with active resume tracked by boolean `is_active`.", "3. Resumes:"),
        bullet("Company to Job: One-to-Many (1:N); corporate recruiters publish and manage multiple job vacancies.", "4. Job Postings:"),
        bullet("Student to Application to Job: Many-to-Many (M:N) resolved via association entity `applications`.", "5. Applications:"),
        bullet("Student to AiAnalysis to Job: Many-to-Many (M:N) resolved via analytical entity `ai_analysis`.", "6. AI Evaluations:")
    );

    // ==========================================
    // 5.4 INPUT DESIGN
    // ==========================================
    elements.push(sectionHeading("5.4 Input Design"));

    elements.push(subSectionHeading("5.4.1 Input Form Validation Specifications"));
    elements.push(
        p("Input design governs data collection across user interfaces, enforcing strict field-level constraints and validation rules:"),
        p("")
    );

    const inForm1Headers = ["Field Name", "Data Type", "UI Control", "Validation Constraints", "Error Handling"];
    const inForm1Rows = [
        ["Email Address", "String", "Email Input Box", "Valid email regex; Must be unique", "Displays 'Email is required and must be unique.'"],
        ["Password", "String", "Password Field", "Min 8 chars; uppercase, lowercase, digit", "Displays 'Password does not meet complexity rules.'"],
        ["Full Name", "String", "Text Input Box", "2 to 100 characters; Alphabetic only", "Displays 'Please enter your complete legal name.'"],
        ["User Role", "Enum", "Radio Button Group", "Selection from {STUDENT, COMPANY, FACULTY}", "Displays 'Please select a valid user role.'"],
        ["OTP Code", "String", "Numeric Input Box", "Exactly 6 digits; 10-minute expiry", "Displays 'Invalid or expired OTP code entered.'"]
    ];
    elements.push(...table(inForm1Headers, inForm1Rows, [20, 14, 18, 24, 24], "Table 5.1: Input Form Specifications: User Registration & Authentication"));

    const inForm2Headers = ["Field Name", "Data Type", "UI Control", "Validation Constraints", "Error Handling"];
    const inForm2Rows = [
        ["Register Number", "String", "Text Input Box", "Alphanumeric (e.g. 7376221CS101); Unique", "Displays 'Register number is required and unique.'"],
        ["Department", "String", "Dropdown Select", "Selected from {CSE, IT, ECE, EEE, MECH}", "Displays 'Please select an accredited department.'"],
        ["Cumulative CGPA", "Double", "Decimal Input", "Range: 0.00 to 10.00; Step: 0.01", "Displays 'CGPA must be a valid decimal (0.0–10.0).'"],
        ["Contact Phone", "String", "Tel Input Box", "10-digit numeric format", "Displays 'Please enter a valid 10-digit phone number.'"],
        ["Resume File", "MultipartFile", "File Chooser (.pdf)", "MIME: application/pdf; Magic bytes: %PDF; <=10MB", "Displays 'Only valid PDF resumes <= 10MB permitted.'"]
    ];
    elements.push(...table(inForm2Headers, inForm2Rows, [20, 14, 18, 24, 24], "Table 5.2: Input Form Specifications: Student Profile & Resume Ingestion"));

    const inForm3Headers = ["Field Name", "Data Type", "UI Control", "Validation Constraints", "Error Handling"];
    const inForm3Rows = [
        ["Job Title", "String", "Text Input Box", "Min 5, Max 150 characters", "Displays 'Job title must be 5–150 characters.'"],
        ["Job Description", "String", "Rich Textarea", "Min 20 characters; Required", "Displays 'Job description must detail role duties.'"],
        ["Required Skills", "String", "Textarea / Tags", "Comma-delimited skills; Max 1000 chars", "Displays 'List required skills separated by commas.'"],
        ["Minimum CGPA", "Double", "Decimal Input", "Range: 0.00 to 10.00", "Displays 'Minimum CGPA must be 0.0 to 10.0.'"],
        ["Salary Package", "String", "Text Input Box", "e.g. '8.5 LPA', '12 - 15 LPA'", "Displays 'Please specify compensation structure.'"],
        ["Deadline", "Date", "Datepicker Control", "Future date; Cannot be in past", "Displays 'Deadline must be a valid future date.'"]
    ];
    elements.push(...table(inForm3Headers, inForm3Rows, [20, 14, 18, 24, 24], "Table 5.3: Input Form Specifications: Job Posting Management"));

    // ==========================================
    // 5.5 DATABASE DESIGN
    // ==========================================
    elements.push(sectionHeading("5.5 Database Design"));

    elements.push(subSectionHeading("5.5.1 Relational Normalization Analysis"));
    elements.push(
        p("The database schema was normalized to 3NF/BCNF standards: 1NF ensures atomic columns with primary keys; 2NF eliminates partial functional dependencies across composite keys; 3NF eliminates transitive dependencies by isolating company and student profiles; and BCNF ensures every determinant is a candidate key.")
    );

    elements.push(subSectionHeading("5.5.2 Relational Database Schema Tables (All 11 Entities)"));
    elements.push(
        p("Tables 5.4 through 5.14 define the complete relational database schema for the MySQL 8.0 `placement_db` database:"),
        p("")
    );

    // Table 5.4: users
    const uHeaders = ["Column Name", "Data Type", "Constraints", "Key Type", "Default", "Description"];
    const uRows = [
        ["id", "BIGINT", "NOT NULL, AUTO_INCREMENT", "Primary Key (PK)", "AUTO", "Unique identifier for user account"],
        ["email", "VARCHAR(100)", "NOT NULL, UNIQUE", "Unique Key", "None", "Institutional email used for authentication"],
        ["password", "VARCHAR(255)", "NOT NULL", "None", "None", "Cryptographically salted BCrypt password hash"],
        ["role", "VARCHAR(20)", "NOT NULL", "None", "ROLE_STUDENT", "User security role authority identifier"],
        ["enabled", "BOOLEAN", "NOT NULL", "None", "FALSE", "Account status flag; TRUE after OTP verification"],
        ["created_at", "DATETIME", "NOT NULL", "None", "CURRENT_TIMESTAMP", "Record creation audit timestamp"],
        ["updated_at", "DATETIME", "NULL", "None", "NULL", "Last update audit timestamp"]
    ];
    elements.push(...table(uHeaders, uRows, [16, 16, 20, 16, 14, 18], "Table 5.4: Relational Database Schema: users Table"));

    // Table 5.5: roles and user_roles
    const rHeaders = ["Column Name", "Data Type", "Constraints", "Key Type", "Default", "Description"];
    const rRows = [
        ["id", "BIGINT", "NOT NULL, AUTO_INCREMENT", "Primary Key (PK)", "AUTO", "Unique role identifier"],
        ["name", "VARCHAR(50)", "NOT NULL, UNIQUE", "Unique Key", "None", "Authority name (ROLE_STUDENT, ROLE_COMPANY, etc.)"],
        ["user_id", "BIGINT", "NOT NULL", "Foreign Key (FK)", "None", "References users(id) in join table user_roles"],
        ["role_id", "BIGINT", "NOT NULL", "Foreign Key (FK)", "None", "References roles(id) in join table user_roles"]
    ];
    elements.push(...table(rHeaders, rRows, [16, 16, 20, 16, 14, 18], "Table 5.5: Relational Database Schema: roles and user_roles Tables"));

    // Table 5.6: students
    const sHeaders = ["Column Name", "Data Type", "Constraints", "Key Type", "Default", "Description"];
    const sRows = [
        ["id", "BIGINT", "NOT NULL, AUTO_INCREMENT", "Primary Key (PK)", "AUTO", "Unique student entity identifier"],
        ["user_id", "BIGINT", "NOT NULL, UNIQUE", "Foreign Key (FK)", "None", "References users(id) (1:1 relationship)"],
        ["full_name", "VARCHAR(100)", "NOT NULL", "None", "None", "Student complete legal name"],
        ["register_number", "VARCHAR(30)", "NOT NULL, UNIQUE", "Unique Key", "None", "Institutional examination register number"],
        ["department", "VARCHAR(50)", "NOT NULL", "None", "None", "Academic engineering department (CSE, IT, etc.)"],
        ["cgpa", "DOUBLE", "NOT NULL", "None", "0.0", "Cumulative Grade Point Average (0.0 to 10.0)"],
        ["skills", "TEXT", "NULL", "None", "NULL", "Comma-separated technical skill tags"],
        ["phone", "VARCHAR(15)", "NULL", "None", "NULL", "Mobile telephone contact number"],
        ["graduation_year", "INT", "NOT NULL", "None", "2026", "Year of graduation completion"],
        ["profile_image", "VARCHAR(255)", "NULL", "None", "NULL", "Filesystem path to student avatar image"]
    ];
    elements.push(...table(sHeaders, sRows, [16, 16, 20, 16, 14, 18], "Table 5.6: Relational Database Schema: students Table"));

    // Table 5.7: companies
    const cHeaders = ["Column Name", "Data Type", "Constraints", "Key Type", "Default", "Description"];
    const cRows = [
        ["id", "BIGINT", "NOT NULL, AUTO_INCREMENT", "Primary Key (PK)", "AUTO", "Unique company identifier"],
        ["user_id", "BIGINT", "NOT NULL, UNIQUE", "Foreign Key (FK)", "None", "References users(id) (1:1 relationship)"],
        ["company_name", "VARCHAR(150)", "NOT NULL", "None", "None", "Registered legal enterprise name"],
        ["industry", "VARCHAR(100)", "NULL", "None", "None", "Industry domain sector (Software, BFSI, Cloud)"],
        ["website", "VARCHAR(200)", "NULL", "None", "NULL", "Official corporate website URL"],
        ["location", "VARCHAR(100)", "NULL", "None", "NULL", "Corporate headquarters or office location"],
        ["contact_person", "VARCHAR(100)", "NULL", "None", "NULL", "Lead campus talent acquisition manager name"],
        ["logo_url", "VARCHAR(255)", "NULL", "None", "NULL", "Filesystem or static path to company logo image"]
    ];
    elements.push(...table(cHeaders, cRows, [16, 16, 20, 16, 14, 18], "Table 5.7: Relational Database Schema: companies Table"));

    // Table 5.8: faculties
    const fHeaders = ["Column Name", "Data Type", "Constraints", "Key Type", "Default", "Description"];
    const fRows = [
        ["id", "BIGINT", "NOT NULL, AUTO_INCREMENT", "Primary Key (PK)", "AUTO", "Unique faculty coordinator identifier"],
        ["user_id", "BIGINT", "NOT NULL, UNIQUE", "Foreign Key (FK)", "None", "References users(id) (1:1 relationship)"],
        ["faculty_name", "VARCHAR(100)", "NOT NULL", "None", "None", "Faculty coordinator full name"],
        ["department", "VARCHAR(50)", "NOT NULL", "None", "None", "Academic engineering department"],
        ["designation", "VARCHAR(50)", "NOT NULL", "None", "None", "Academic rank (Assistant Professor, HOD)"],
        ["employee_code", "VARCHAR(30)", "NOT NULL, UNIQUE", "Unique Key", "None", "Institutional faculty identification code"]
    ];
    elements.push(...table(fHeaders, fRows, [16, 16, 20, 16, 14, 18], "Table 5.8: Relational Database Schema: faculties Table"));

    // Table 5.9: admins
    const aHeaders = ["Column Name", "Data Type", "Constraints", "Key Type", "Default", "Description"];
    const aRows = [
        ["id", "BIGINT", "NOT NULL, AUTO_INCREMENT", "Primary Key (PK)", "AUTO", "Unique administrator identifier"],
        ["user_id", "BIGINT", "NOT NULL, UNIQUE", "Foreign Key (FK)", "None", "References users(id) (1:1 relationship)"],
        ["admin_name", "VARCHAR(100)", "NOT NULL", "None", "None", "Administrator full name"],
        ["department", "VARCHAR(50)", "NOT NULL", "None", "Administration", "Administrative division"],
        ["contact_email", "VARCHAR(100)", "NOT NULL", "None", "None", "Official administrative email address"]
    ];
    elements.push(...table(aHeaders, aRows, [16, 16, 20, 16, 14, 18], "Table 5.9: Relational Database Schema: admins Table"));

    // Table 5.10: jobs
    const jHeaders = ["Column Name", "Data Type", "Constraints", "Key Type", "Default", "Description"];
    const jRows = [
        ["id", "BIGINT", "NOT NULL, AUTO_INCREMENT", "Primary Key (PK)", "AUTO", "Unique job posting identifier"],
        ["company_id", "BIGINT", "NOT NULL", "Foreign Key (FK)", "None", "References companies(id) (1:N relationship)"],
        ["title", "VARCHAR(150)", "NOT NULL", "None", "None", "Job role title designation"],
        ["description", "TEXT", "NOT NULL", "None", "None", "Detailed technical role description"],
        ["required_skills", "TEXT", "NOT NULL", "None", "None", "Comma-separated mandatory technical skill tags"],
        ["min_cgpa", "DOUBLE", "NOT NULL", "None", "0.0", "Minimum academic CGPA eligibility cutoff"],
        ["target_department", "VARCHAR(50)", "NULL", "None", "All", "Eligible engineering department"],
        ["salary_package", "VARCHAR(50)", "NULL", "None", "Not Disclosed", "Compensation package structure (e.g. 8.5 LPA)"],
        ["deadline", "DATE", "NOT NULL", "None", "None", "Application closing deadline date"],
        ["status", "VARCHAR(20)", "NOT NULL", "None", "OPEN", "Lifecycle status: OPEN, CLOSED, ARCHIVED"],
        ["created_at", "DATETIME", "NOT NULL", "None", "CURRENT_TIMESTAMP", "Job posting publication timestamp"]
    ];
    elements.push(...table(jHeaders, jRows, [16, 16, 20, 16, 14, 18], "Table 5.10: Relational Database Schema: jobs Table"));

    // Table 5.11: resumes
    const resHeaders = ["Column Name", "Data Type", "Constraints", "Key Type", "Default", "Description"];
    const resRows = [
        ["id", "BIGINT", "NOT NULL, AUTO_INCREMENT", "Primary Key (PK)", "AUTO", "Unique resume document identifier"],
        ["student_id", "BIGINT", "NOT NULL", "Foreign Key (FK)", "None", "References students(id) (1:N relationship)"],
        ["file_name", "VARCHAR(255)", "NOT NULL", "None", "None", "Original uploaded PDF filename"],
        ["file_path", "VARCHAR(255)", "NOT NULL", "None", "None", "Filesystem path to mirrored PDF file"],
        ["file_data", "LONGBLOB", "NOT NULL", "None", "None", "Raw PDF binary payload (Dual Redundancy)"],
        ["file_size", "BIGINT", "NOT NULL", "None", "0", "Document size in bytes (max 10MB)"],
        ["mime_type", "VARCHAR(50)", "NOT NULL", "None", "application/pdf", "MIME type; verified via %PDF magic bytes"],
        ["is_active", "BOOLEAN", "NOT NULL", "None", "TRUE", "Active resume flag; FALSE upon re-upload"],
        ["uploaded_at", "DATETIME", "NOT NULL", "None", "CURRENT_TIMESTAMP", "Document ingestion timestamp"]
    ];
    elements.push(...table(resHeaders, resRows, [16, 16, 20, 16, 14, 18], "Table 5.11: Relational Database Schema: resumes Table"));

    // Table 5.12: applications
    const appHeaders = ["Column Name", "Data Type", "Constraints", "Key Type", "Default", "Description"];
    const appRows = [
        ["id", "BIGINT", "NOT NULL, AUTO_INCREMENT", "Primary Key (PK)", "AUTO", "Unique job application identifier"],
        ["student_id", "BIGINT", "NOT NULL", "Foreign Key (FK)", "None", "References students(id) (M:N mapping)"],
        ["job_id", "BIGINT", "NOT NULL", "Foreign Key (FK)", "None", "References jobs(id) (M:N mapping)"],
        ["applied_at", "DATETIME", "NOT NULL", "None", "CURRENT_TIMESTAMP", "Application submission timestamp"],
        ["status", "VARCHAR(20)", "NOT NULL", "None", "APPLIED", "Status: APPLIED, SHORTLISTED, SELECTED, REJECTED"],
        ["remarks", "TEXT", "NULL", "None", "NULL", "Recruiter feedback remarks"]
    ];
    elements.push(...table(appHeaders, appRows, [16, 16, 20, 16, 14, 18], "Table 5.12: Relational Database Schema: applications Table"));

    // Table 5.13: ai_analysis
    const aiHeaders = ["Column Name", "Data Type", "Constraints", "Key Type", "Default", "Description"];
    const aiRows = [
        ["id", "BIGINT", "NOT NULL, AUTO_INCREMENT", "Primary Key (PK)", "AUTO", "Unique AI analysis evaluation identifier"],
        ["student_id", "BIGINT", "NOT NULL", "Foreign Key (FK)", "None", "References students(id) (purged on re-upload)"],
        ["job_id", "BIGINT", "NOT NULL", "Foreign Key (FK)", "None", "References jobs(id) evaluated"],
        ["ats_score", "INT", "NOT NULL", "None", "0", "Computed ATS match percentage (0–100)"],
        ["matched_skills", "TEXT", "NULL", "None", "NULL", "JSON array of verified matching skills"],
        ["missing_skills", "TEXT", "NULL", "None", "NULL", "JSON array of critical missing competencies"],
        ["ai_feedback", "TEXT", "NULL", "None", "NULL", "Structured interview preparation recommendations"],
        ["created_at", "DATETIME", "NOT NULL", "None", "CURRENT_TIMESTAMP", "Evaluation generation timestamp"]
    ];
    elements.push(...table(aiHeaders, aiRows, [16, 16, 20, 16, 14, 18], "Table 5.13: Relational Database Schema: ai_analysis Table"));

    // Table 5.14: otp_verifications and audit_logs
    const otpHeaders = ["Column Name", "Data Type", "Constraints", "Key Type", "Default", "Description"];
    const otpRows = [
        ["id", "BIGINT", "NOT NULL, AUTO_INCREMENT", "Primary Key (PK)", "AUTO", "Unique OTP verification record identifier"],
        ["email", "VARCHAR(100)", "NOT NULL", "None", "None", "Recipient institutional email address"],
        ["otp_code", "VARCHAR(10)", "NOT NULL", "None", "None", "Cryptographically generated 6-digit numeric OTP"],
        ["expires_at", "DATETIME", "NOT NULL", "None", "None", "Expiration timestamp (10 minutes from creation)"],
        ["verified", "BOOLEAN", "NOT NULL", "None", "FALSE", "Verification flag; TRUE upon successful validation"]
    ];
    elements.push(...table(otpHeaders, otpRows, [16, 16, 20, 16, 14, 18], "Table 5.14: Relational Database Schema: otp_verifications Table"));

    // ==========================================
    // 5.6 OUTPUT DESIGN
    // ==========================================
    elements.push(sectionHeading("5.6 Output Design"));

    elements.push(subSectionHeading("5.6.1 User Interface and Analytics Output Reports"));
    elements.push(
        p("Output design defines visual presentations and reporting interfaces across stakeholder dashboards:"),
        bullet("Student AI ATS Scorecard: Renders circular progress gauges for ATS scores (0–100%), green badges for matched skills, amber badges for missing competencies, and tailored interview advice.", "1. Diagnostic Scorecard:"),
        bullet("'Jobs For You' Recommender View: Renders ranked job listings with suitability badges and match progress bars, accompanied by an asynchronous loading spinner during calculation.", "2. Matched Jobs View:"),
        bullet("Recruiter Applicant Pipeline: Displays candidate rosters pre-sorted by ATS match score, with one-click resume streaming downloads and status update controls.", "3. Candidate Pipeline:"),
        bullet("Faculty Analytics Dashboard: Renders interactive Chart.js bar and doughnut charts tracking placed vs. unplaced ratios and cohort skill deficits.", "4. Departmental Analytics:")
    );

    return elements;
}

module.exports = { getChapter5 };
