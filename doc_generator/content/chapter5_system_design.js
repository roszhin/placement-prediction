const path = require('path');
const { Paragraph, p, bullet, chapterHeading, sectionHeading, subSectionHeading, figure, table, codeBlock } = require('../doc_helper');

function getChapter5() {
    const elements = [];

    elements.push(chapterHeading("5. SYSTEM DESIGN"));

    elements.push(
        p("System Design constitutes the creative and technical nucleus of the engineering lifecycle, translating conceptual requirements, functional specifications, and domain logic into a structured, executable architectural blueprint. In enterprise software engineering, robust system design ensures that data structures, behavioral flows, process decompositions, human-computer interfaces, and relational persistence schemas are mathematically rigorous, scalable, modular, and resilient against runtime exceptions. A well-executed system design eliminates architectural ambiguity, accelerates implementation fidelity, and establishes verifiable standards for quality assurance and future extensibility."),
        p("In this chapter, the complete technical architecture of the Campus Placement Prediction & Skill Gap Analyzer platform is systematically documented. First, Section 5.1 presents the end-to-end System Flow Chart (Figure 5.1), accompanied by an exhaustive narrative analyzing every operational decision gate from initial student onboarding to final corporate offer processing. Next, Section 5.2 articulates the Data Flow Diagrams across multiple levels of abstraction: Level-0 Context Diagram (Figure 5.2), Level-1 Overview Decomposition (Figure 5.3), Level-2 AI Resume Evaluation Subsystem (Figure 5.4), and Level-3 Recruiter Lifecycle Subsystem (Figure 5.5). Section 5.3 delivers the complete Entity-Relationship (E-R) Diagram (Figure 5.6), defining all relational cardinalities, constraints, and business integrity rules. Section 5.4 details the Input Design and validation protocols across Tables 5.1, 5.2, and 5.3. Section 5.5 provides complete relational database schema definitions across all eleven database tables (Tables 5.4 through 5.14). Finally, Section 5.6 specifies the Output Design across interactive dashboards, AI evaluation cards, and Chart.js analytical visualizers (Table 5.15).")
    );

    // ==========================================
    // 5.1 SYSTEM FLOW CHART
    // ==========================================
    elements.push(sectionHeading("5.1 Flow Chart"));

    elements.push(subSectionHeading("5.1.1 System Flow Chart Diagram"));
    elements.push(
        p("The System Flow Chart visualizes the holistic operational trajectory of the platform, tracing the discrete procedural pathways traversed by Students, Corporate Recruiters, Faculty Coordinators, and System Administrators. It details entry authentication gates, document ingestion pathways, reactive AI evaluation branches, error-handling fallbacks, application state transitions, and analytical reporting loops."),
        p("Figure 5.1 illustrates the complete End-to-End System Flow Chart:"),
        new Paragraph({ spacing: { before: 100 } })
    );

    const flowImgPath = path.join(__dirname, '..', 'diagrams', 'flowchart_diagram.png');
    elements.push(...figure(
        flowImgPath,
        "Figure 5.1: End-to-End Placement & AI ATS Evaluation System Flow Chart",
        560,
        390
    ));

    elements.push(subSectionHeading("5.1.2 Comprehensive Step-by-Step Flow Chart Narrative Analysis"));
    elements.push(
        p("The operational logic depicted in Figure 5.1 comprises twelve sequential and conditional execution phases:"),
        bullet("Phase 1: Entry Point & User Registration: A new user accesses the web application homepage. If unauthenticated, the user proceeds to the registration view (`/register`), submitting their email, full name, password, and designated role. For student and faculty registrations, `AuthService` generates a 6-digit numeric OTP with a 10-minute expiry timestamp, which is dispatched via `EmailService` using JavaMailSender over SMTP TLS. The user enters the OTP on the `/verify-otp` view to activate the account.", "1. Registration & OTP:"),
        bullet("Phase 2: Authentication & Role Dispatch: An authenticated user submits their credentials at `/login`. Spring Security 6 intercepts the request, verifies the BCrypt hashed password against the `users` table, populates the `SecurityContext`, and routes the authenticated user to their role-specific dashboard via `CustomAuthenticationSuccessHandler`: Students -> `/student/dashboard`; Companies -> `/company/dashboard`; Faculty -> `/faculty/dashboard`; Admins -> `/admin/dashboard`.", "2. Role-Based Routing:"),
        bullet("Phase 3: Student Profile Completion & Resume Upload: Upon reaching the student dashboard, the student navigates to `/student/profile` to input their academic department, graduation year, cumulative CGPA, contact phone, and technical skill tags. The student uploads their resume in PDF format. `StudentService` validates the file header magic bytes (`%PDF`), writes the raw binary stream into a MySQL `LONGBLOB` column (`file_data` in `resumes`), mirrors the file to `uploads/resumes/`, sets `is_active = true`, and deactivates any previously uploaded resumes.", "3. Profile & Dual Storage:"),
        bullet("Phase 4: Automatic Stale AI Cache Purge: Concurrently with saving a new active resume, `StudentService` executes `@Transactional` method `aiAnalysisRepository.deleteByStudentId(student.getId())`. This purges all previously computed AI match scores for that student, ensuring that subsequent job evaluations reflect the newly uploaded resume without displaying stale cached data.", "4. Stale Cache Invalidation:"),
        bullet("Phase 5: Job Exploration & 'Jobs For You' Recommender: The student browses active job openings (`/student/jobs`) or accesses the AI-ranked 'Jobs For You' portal (`/student/jobs/matched`). If matched jobs are requested, the platform triggers an asynchronous background calculation across all active corporate postings, rendering an interactive loading view (`matched-jobs-loading.html`) while calculations proceed.", "5. Opportunity Discovery:"),
        bullet("Phase 6: Triggering AI ATS Evaluation: When the student inspects a specific job (`/student/job/{id}`), the system checks whether an `AiAnalysis` record already exists for the student and job. If absent, `AIService` is invoked. The active resume is retrieved via `StudentService.getResumeFileBytes()`. If the file is within 20MB, the raw bytes are Base64 encoded and transmitted via multimodal `inlineData` to the Google Gemini 1.5 Flash API; otherwise, Apache PDFBox extracts raw text strings.", "6. AI ATS Ingestion:"),
        bullet("Phase 7: Non-Blocking Gemini API Call & Timeout Guard: Spring WebFlux `WebClient` executes an asynchronous POST request to the Gemini 1.5 Flash endpoint with a hard 15-second response timeout (`Duration.ofSeconds(15)`). The service sends a structured prompt requesting an ATS match percentage (0–100%), matched skills array, missing skills array, and tailored interview advice in strictly validated JSON format.", "7. Reactive AI Execution:"),
        bullet("Phase 8: Response Parsing & Heuristic Fallback Gate: If the Gemini API returns a successful response, `AIService` sanitizes the JSON body using regex extraction, maps fields into `ResumeAnalysisDTO`, and saves a new `AiAnalysis` row. If the call times out or throws an exception, the catch block intercepts the error, logs the stack trace, and seamlessly invokes `buildFallbackResult()`, delivering deterministic heuristic scores to guarantee that the UI never crashes.", "8. Resilient Parsing:"),
        bullet("Phase 9: Diagnostic UI Rendering: Thymeleaf renders the job details page (`job-details.html`). Fully null-safe expressions inspect `aiAnalysis`, displaying a circular progress gauge representing the ATS match score, green badges for matched skills, amber badges for missing skills, and detailed interview preparation recommendations.", "9. Visual Feedback:"),
        bullet("Phase 10: Job Application Submission: If the student satisfies the minimum CGPA and wishes to apply, they click 'Apply Now'. `ApplicationService` records a new `Application` entity linking the student and job, timestamped with the current time and initialized with status `APPLIED`.", "10. Application Processing:"),
        bullet("Phase 11: Corporate Recruiter Review & Status Transition: Corporate recruiters log in to `/company/dashboard`, viewing applicant rosters for their posted jobs pre-sorted by ATS match scores. Recruiters inspect candidate profiles, download active PDF resumes directly from the dual-redundancy storage layer, and transition application statuses: `APPLIED` -> `SHORTLISTED` -> `SELECTED` or `REJECTED`.", "11. Recruiter Workflow:"),
        bullet("Phase 12: Academic Monitoring & Administrative Oversight: Departmental faculty coordinators access `/faculty/dashboard` to track student application histories, monitor placement statistics, and identify systemic cohort skill gaps. System administrators monitor platform audit logs, user accounts, and database health.", "12. Academic Governance:")
    );

    // ==========================================
    // 5.2 DATA FLOW DIAGRAMS (DFDs)
    // ==========================================
    elements.push(sectionHeading("5.2 Data Flow Diagrams (DFDs)"));

    elements.push(subSectionHeading("5.2.1 DFD Level-0 / Context Diagram"));
    elements.push(
        p("The Data Flow Diagram Level-0 (Context Diagram) establishes the external boundary of the software system. It models the entire platform as a single centralized process (Process 0.0: Campus Placement Prediction & AI ATS Skill Gap Analyzer) and illustrates the data flows exchanged with external entities: Students, Company Recruiters, Faculty Coordinators, System Administrators, and the external Google Gemini Generative AI API."),
        p("Figure 5.2 presents the DFD Level-0 Context Diagram:"),
        new Paragraph({ spacing: { before: 100 } })
    );

    const dfd0ImgPath = path.join(__dirname, '..', 'diagrams', 'dfd0_diagram.png');
    elements.push(...figure(
        dfd0ImgPath,
        "Figure 5.2: Data Flow Diagram (DFD) Level-0 / Context Diagram",
        560,
        350
    ));

    elements.push(
        p("As illustrated in Figure 5.2, external entities interface with Process 0.0 through well-defined data flows:"),
        bullet("Student Data Flows: Inbound data flows include Student Registration Credentials, Profile Details, PDF Resume Files, and Job Application Submissions. Outbound data flows returned to the student include Account Verification OTPs, AI ATS Match Scores (0–100%), Diagnostic Skill Gap Badges, Tailored Interview Recommendations, 'Jobs For You' Ranked Match Results, and Real-Time Application Lifecycle Status Updates.", "• Student Boundary:"),
        bullet("Company Recruiter Data Flows: Inbound data flows include Corporate Profile Information, Job Openings (titles, descriptions, required skill tags, CGPA cutoffs, salaries, deadlines), and Candidate Status Transitions. Outbound data flows returned to recruiters include Applicant Rosters, Candidate Academic Records, Downloadable Resumes, and Pre-Computed ATS Match Scores.", "• Recruiter Boundary:"),
        bullet("Faculty Coordinator Data Flows: Inbound data flows include Departmental Search Filters and Student Verification Queries. Outbound data flows returned to faculty include Student Placement Ratios, Departmental Skill Gap Analyses, and Corporate Partner Hiring Statistics.", "• Faculty Boundary:"),
        bullet("System Administrator Data Flows: Inbound data flows include User Governance Commands, Account Activations, and Configuration Updates. Outbound data flows include Audit Logs, Security Event Alerts, and Database System Health Metrics.", "• Administrator Boundary:"),
        bullet("Google Gemini 1.5 Flash Data Flows: Inbound data flows transmitted from Process 0.0 to the Gemini API include Base64 Encoded Multimodal PDF Streams or Apache PDFBox Extracted Resume Strings alongside Corporate Job Requirements. Outbound data flows returned to Process 0.0 comprise Strictly Structured JSON Payloads containing ATS match scores, matched skills, missing skills, and tailored interview advice.", "• External AI Service Boundary:")
    );

    elements.push(subSectionHeading("5.2.2 DFD Level-1 / Overview Diagram"));
    elements.push(
        p("The DFD Level-1 Overview Diagram decomposes the centralized context process into six primary operational subsystems (Processes 1.0 through 6.0), exposing the internal data stores (D1 through D5) that maintain state across the relational database."),
        p("Figure 5.3 presents the DFD Level-1 Overview Diagram:"),
        new Paragraph({ spacing: { before: 100 } })
    );

    const dfd1ImgPath = path.join(__dirname, '..', 'diagrams', 'dfd1_diagram.png');
    elements.push(...figure(
        dfd1ImgPath,
        "Figure 5.3: Data Flow Diagram (DFD) Level-1 (Top-Level Process Decomposition)",
        560,
        390
    ));

    elements.push(
        p("The operational processes and data stores depicted in Figure 5.3 operate as follows:"),
        bullet("Process 1.0 (User Authentication & OTP Verification): Ingests registration and login credentials, validates passwords against BCrypt hashes in Data Store D1 (`users`, `roles`), generates cryptographic OTPs, records verification states in D2 (`otp_verifications`), and establishes authenticated Spring Security sessions.", "• Process 1.0:"),
        bullet("Process 2.0 (Profile & Resume Management): Manages student academic data within Data Store D3 (`students`), processes uploaded PDF resumes, verifies PDF magic bytes, writes raw binary payloads into Data Store D4 (`resumes` LONGBLOB), mirrors files to disk, and updates active resume flags.", "• Process 2.0:"),
        bullet("Process 3.0 (Job Posting & Company Management): Ingests corporate profiles and job announcements from recruiters, persisting company records in D5 (`companies`) and posting records in D6 (`jobs`).", "• Process 3.0:"),
        bullet("Process 4.0 (AI ATS Engine & Skill Gap Analyzer): Pulls active resumes from D4 and job criteria from D6, orchestrates reactive WebClient communications with Google Gemini 1.5 Flash, parses output JSON, and persists computed evaluations in Data Store D7 (`ai_analysis`).", "• Process 4.0:"),
        bullet("Process 5.0 (Job Application & Tracking Workflow): Receives application requests from students, records submissions in Data Store D8 (`applications`), exposes applicant rosters to recruiters, and persists recruiter status transitions (Applied -> Shortlisted -> Selected).", "• Process 5.0:"),
        bullet("Process 6.0 (Analytics, Placement Prediction & Reporting): Aggregates cross-relational data from D3, D6, D7, and D8, rendering dynamic Chart.js dashboards for faculty and institutional administrators.", "• Process 6.0:")
    );

    elements.push(subSectionHeading("5.2.3 DFD Level-2 / AI Resume Analysis Subsystem"));
    elements.push(
        p("The DFD Level-2 Diagram decomposes Process 4.0 (AI ATS Resume Evaluation and Skill Gap Analyzer) into six granular sub-processes (4.1 through 4.6), illustrating the exact sequence of data transformations during AI evaluation."),
        p("Figure 5.4 presents the DFD Level-2 Diagram:"),
        new Paragraph({ spacing: { before: 100 } })
    );

    const dfd2ImgPath = path.join(__dirname, '..', 'diagrams', 'dfd2_diagram.png');
    elements.push(...figure(
        dfd2ImgPath,
        "Figure 5.4: DFD Level-2 (Process 4.0 - AI ATS Resume Evaluation & Skill Gap Subsystem)",
        560,
        350
    ));

    elements.push(
        p("The sub-processes depicted in Figure 5.4 function as follows:"),
        bullet("Process 4.1 (PDF Extraction & MIME Validation): Inspects uploaded resume bytes using magic-byte headers, confirms `application/pdf` MIME validity, and invokes Apache PDFBox 3.0.2 to strip textual content if text-only fallback is required.", "• Sub-Process 4.1:"),
        bullet("Process 4.2 (Cache Purge & Stale Row Invalidation): Intercepts resume re-upload events and executes `deleteByStudentId()`, clearing outdated records from `ai_analysis` to ensure zero stale score contamination.", "• Sub-Process 4.2:"),
        bullet("Process 4.3 (Prompt Engineering & Payload Assembly): Constructs a structured JSON payload encapsulating Base64-encoded PDF inlineData (or stripped text) alongside target job requirements, specifying strict output schema expectations.", "• Sub-Process 4.3:"),
        bullet("Process 4.4 (Reactive Gemini API Execution): Dispatches an asynchronous HTTP POST request to Google Gemini 1.5 Flash via Spring WebFlux `WebClient`, enforcing a strict 15-second response timeout.", "• Sub-Process 4.4:"),
        bullet("Process 4.5 (Response Parsing & JSON Extraction): Sanitizes raw response text using regex boundary matching, extracts JSON blocks, validates required fields (`overallMatch`, `matchedSkills`, `missingSkills`), and handles syntax errors.", "• Sub-Process 4.5:"),
        bullet("Process 4.6 (Persist Scores & Render Diagnostics): Maps extracted data into `AiAnalysis` entity, saves to MySQL Data Store D4 (`ai_analysis`), and returns `ResumeAnalysisDTO` to the Thymeleaf view layer.", "• Sub-Process 4.6:")
    );

    elements.push(subSectionHeading("5.2.4 DFD Level-3 / Job Application & Recruiter Lifecycle Subsystem"));
    elements.push(
        p("The DFD Level-3 Diagram decomposes Process 5.0 (Job Application and Recruiter Lifecycle Workflow) into four granular sub-processes (5.1 through 5.4)."),
        p("Figure 5.5 presents the DFD Level-3 Diagram:"),
        new Paragraph({ spacing: { before: 100 } })
    );

    const dfd3ImgPath = path.join(__dirname, '..', 'diagrams', 'dfd3_diagram.png');
    elements.push(...figure(
        dfd3ImgPath,
        "Figure 5.5: DFD Level-3 (Process 5.0 - Job Application & Recruiter Lifecycle Subsystem)",
        560,
        350
    ));

    elements.push(
        p("The sub-processes depicted in Figure 5.5 function as follows:"),
        bullet("Process 5.1 (Eligibility Verification & Application Submission): Validates student academic eligibility (CGPA >= job minimum CGPA, matching department), captures application submission timestamp, and persists an `Application` record with status `APPLIED`.", "• Sub-Process 5.1:"),
        bullet("Process 5.2 (Candidate Roster Assembly & ATS Screening): Aggregates applicant profiles for the recruiter, joining student academic records with pre-computed ATS match scores from `ai_analysis`, pre-sorting candidates by match percentage.", "• Sub-Process 5.2:"),
        bullet("Process 5.3 (Recruiter Evaluation & Status Transition): Ingests recruiter decisions, executing state transitions: `APPLIED` -> `SHORTLISTED` -> `SELECTED` / `REJECTED`, recording recruiter notes in `applications`.", "• Sub-Process 5.3:"),
        bullet("Process 5.4 (Student Notification & Analytics Synchronization): Synchronizes updated application statuses with student dashboards in real time and updates institutional placement metrics.", "• Sub-Process 5.4:")
    );

    // ==========================================
    // 5.3 ENTITY-RELATIONSHIP (E-R) DIAGRAM
    // ==========================================
    elements.push(sectionHeading("5.3 Entity-Relationship (E-R) Diagram"));

    elements.push(subSectionHeading("5.3.1 Complete E-R Diagram Description"));
    elements.push(
        p("The Entity-Relationship (E-R) Diagram establishes the conceptual and logical data model of the system. It defines all entity classes, primary key identifiers, foreign key linkages, relational cardinalities (One-to-One, One-to-Many, Many-to-Many), and attribute constraints across the MySQL relational database."),
        p("Figure 5.6 illustrates the complete Entity-Relationship Diagram:"),
        new Paragraph({ spacing: { before: 100 } })
    );

    const erImgPath = path.join(__dirname, '..', 'diagrams', 'er_diagram.png');
    elements.push(...figure(
        erImgPath,
        "Figure 5.6: Complete Entity-Relationship (E-R) Diagram (10 Entities with Cardinalities)",
        560,
        390
    ));

    elements.push(subSectionHeading("5.3.2 Entity Definitions, Attribute Cardinalities, and Foreign Keys"));
    elements.push(
        p("The relational architecture comprises ten core entities interconnected by rigorous referential integrity constraints:"),
        bullet("User Entity: Centralized authentication master storing `id` (PK, BIGINT), `email` (VARCHAR 100, UNIQUE), `password` (VARCHAR 255, BCrypt hashed), `role` (VARCHAR 20), `enabled` (BOOLEAN), and auditing timestamps (`created_at`, `updated_at`).", "1. User Entity:"),
        bullet("Role Entity: Represents security authority groups (`ROLE_STUDENT`, `ROLE_COMPANY`, `ROLE_FACULTY`, `ROLE_ADMIN`), linked to `User` via Many-to-Many join table `user_roles` (`user_id` FK, `role_id` FK).", "2. Role Entity:"),
        bullet("Student Entity: Extends candidate credentials, storing `id` (PK, BIGINT), `user_id` (FK, BIGINT, UNIQUE, 1:1 with User), `full_name`, `register_number` (UNIQUE), `department`, `cgpa` (DOUBLE), `skills` (TEXT), `phone`, and `graduation_year`.", "3. Student Entity:"),
        bullet("Company Entity: Represents recruiting corporate partners, storing `id` (PK, BIGINT), `user_id` (FK, BIGINT, UNIQUE, 1:1 with User), `company_name`, `industry`, `website`, `location`, `contact_person`, and `logo_url`.", "4. Company Entity:"),
        bullet("Faculty Entity: Represents academic coordinators, storing `id` (PK, BIGINT), `user_id` (FK, BIGINT, UNIQUE, 1:1 with User), `faculty_name`, `department`, `designation`, and `employee_code`.", "5. Faculty Entity:"),
        bullet("Job Entity: Represents corporate openings, storing `id` (PK, BIGINT), `company_id` (FK, BIGINT, N:1 with Company), `title`, `description` (TEXT), `department`, `required_skills` (TEXT), `min_cgpa` (DOUBLE), `salary_package`, `status` (`OPEN`/`CLOSED`), and `deadline` (DATE).", "6. Job Entity:"),
        bullet("Application Entity: Represents candidate job submissions, storing `id` (PK, BIGINT), `student_id` (FK, BIGINT, N:1 with Student), `job_id` (FK, BIGINT, N:1 with Job), `applied_at` (DATETIME), `status` (VARCHAR 30), and `recruiter_notes` (TEXT).", "7. Application Entity:"),
        bullet("Resume Entity: Implements dual-redundancy document persistence, storing `id` (PK, BIGINT), `student_id` (FK, BIGINT, N:1 with Student), `file_name`, `file_type`, `file_size` (BIGINT), `file_path` (VARCHAR 500), `file_data` (LONGBLOB), `is_active` (BOOLEAN), and `uploaded_at` (DATETIME).", "8. Resume Entity:"),
        bullet("AiAnalysis Entity: Stores pre-computed AI evaluations, storing `id` (PK, BIGINT), `student_id` (FK, BIGINT, N:1 with Student), `job_id` (FK, BIGINT, N:1 with Job), `overall_match` (INT, 0–100), `matched_skills` (TEXT), `missing_skills` (TEXT), `ai_feedback` (LONGTEXT), and `analyzed_at` (DATETIME).", "9. AiAnalysis Entity:"),
        bullet("OtpVerification Entity: Manages two-factor registration security, storing `id` (PK, BIGINT), `email` (VARCHAR 100), `otp_code` (VARCHAR 6), `expiry_time` (DATETIME), `is_verified` (BOOLEAN), and `created_at` (DATETIME).", "10. OtpVerification Entity:")
    );

    // ==========================================
    // 5.4 INPUT DESIGN
    // ==========================================
    elements.push(sectionHeading("5.4 Input Design"));

    elements.push(subSectionHeading("5.4.1 Principles of Input Design and Validation Strategies"));
    elements.push(
        p("Input design is the pivotal interface between human users and automated data processing. Poorly designed input mechanisms lead to user frustration, data entry errors, security vulnerabilities, and database corruption. In this platform, input design is governed by five foundational human-computer interaction (HCI) and security principles:"),
        bullet("Defensive Data Validation: All input fields are validated across both client-side (HTML5 `required`, `pattern`, `min`, `max`) and server-side (Jakarta Bean Validation `@NotNull`, `@NotBlank`, `@Email`, `@Size`) layers, preventing bypass attacks.", "1. Dual Validation:"),
        bullet("Strict MIME-Type and Magic-Byte Inspection: File upload endpoints inspect raw binary magic bytes (`%PDF` 0x25 0x50 0x44 0x46) rather than trusting client-provided Content-Type headers, blocking malicious script execution.", "2. Binary File Validation:"),
        bullet("Clear Error Messaging & Visual Feedback: Form errors are returned inline adjacent to the offending input element, styled with red error text and alert borders, guiding users to instant correction without losing previously entered data.", "3. Inline Error Guidance:"),
        bullet("Cross-Site Request Forgery (CSRF) Tokens: Every form dynamically includes hidden CSRF tokens (`_csrf`), verified by Spring Security before processing POST requests.", "4. CSRF Tokens:"),
        bullet("Responsive Layouts & Mobile Adaptation: Forms utilize Bootstrap 5.3 form-control classes, adapting seamlessly to desktop, tablet, and mobile touchscreen viewports.", "5. Responsive Layouts:")
    );

    elements.push(subSectionHeading("5.4.2 Detailed Form Specifications"));
    elements.push(
        p("Tables 5.1, 5.2, and 5.3 document the exact input specifications for all system forms, defining field names, input types, UI controls, validation constraints, and error messages:"),
        new Paragraph({ spacing: { before: 80 } })
    );

    const inForm1Headers = ["Field Name", "Data Type", "UI Control", "Validation Constraints", "Error Handling & Feedback"];
    const inForm1Rows = [
        ["Email Address", "String", "Email Input Box", "Valid RFC 5322 email; Unique in DB", "Displays 'Please provide a valid, unique institutional email address.'"],
        ["Password", "String", "Password Masked", "Min 8 chars, 1 uppercase, 1 number, 1 special", "Displays 'Password must contain at least 8 characters with numbers & symbols.'"],
        ["User Role", "String", "Dropdown Select", "Selected from {STUDENT, COMPANY, FACULTY}", "Displays 'Please select a valid user role.'"],
        ["Full Name", "String", "Text Input Box", "Min 3, Max 100 characters; Alphabetic", "Displays 'Full name must contain 3 to 100 characters.'"],
        ["OTP Code", "String", "6-Digit Text Box", "Exactly 6 numeric digits; Not expired (<10m)", "Displays 'Invalid or expired OTP code. Please request a new code.'"]
    ];

    elements.push(...table(
        inForm1Headers,
        inForm1Rows,
        [20, 14, 18, 24, 24],
        "Table 5.1: Input Form Specifications: User Registration & Authentication"
    ));

    const inForm2Headers = ["Field Name", "Data Type", "UI Control", "Validation Constraints", "Error Handling & Feedback"];
    const inForm2Rows = [
        ["Register Number", "String", "Text Input Box", "Alphanumeric (e.g. 7376221CS101); Unique", "Displays 'Register number is required and must be unique.'"],
        ["Department", "String", "Dropdown Select", "Selected from {CSE, IT, ECE, EEE, MECH}", "Displays 'Please select an accredited academic department.'"],
        ["Cumulative CGPA", "Double", "Decimal Input", "Range: 0.00 to 10.00; Step: 0.01", "Displays 'CGPA must be a valid decimal value between 0.0 and 10.0.'"],
        ["Contact Phone", "String", "Tel Input Box", "10-digit numeric format; Optional +91", "Displays 'Please enter a valid 10-digit mobile telephone number.'"],
        ["Graduation Year", "Integer", "Number Input", "Range: 2020 to 2030", "Displays 'Graduation year must fall within a valid academic range.'"],
        ["Technical Skills", "String", "Textarea / Tags", "Comma-delimited text; Max 1000 chars", "Displays 'Skills text exceeds allowable character limit.'"],
        ["Resume File", "MultipartFile", "File Chooser (.pdf)", "MIME: application/pdf; Magic bytes: %PDF; Max 10MB", "Displays 'Upload failed: Only valid PDF resumes under 10MB are permitted.'"]
    ];

    elements.push(...table(
        inForm2Headers,
        inForm2Rows,
        [20, 14, 18, 24, 24],
        "Table 5.2: Input Form Specifications: Student Profile & Resume Ingestion"
    ));

    const inForm3Headers = ["Field Name", "Data Type", "UI Control", "Validation Constraints", "Error Handling & Feedback"];
    const inForm3Rows = [
        ["Job Title", "String", "Text Input Box", "Min 5, Max 150 characters", "Displays 'Job title must be between 5 and 150 characters.'"],
        ["Job Description", "String", "Rich Textarea", "Min 20 characters; Required", "Displays 'Job description must provide comprehensive role responsibilities.'"],
        ["Required Skills", "String", "Textarea / Tags", "Comma-delimited skills; Max 1000 chars", "Displays 'Please list required skills separated by commas.'"],
        ["Minimum CGPA", "Double", "Decimal Input", "Range: 0.00 to 10.00", "Displays 'Minimum CGPA threshold must be between 0.0 and 10.0.'"],
        ["Target Department", "String", "Dropdown Select", "Accredited engineering discipline", "Displays 'Please select the target academic department.'"],
        ["Salary Package", "String", "Text Input Box", "e.g. '8.5 LPA', '12 - 15 LPA'", "Displays 'Please specify the compensation package structure.'"],
        ["Application Deadline", "Date", "Datepicker Control", "Future date; Cannot be in past", "Displays 'Deadline must be a valid future date.'"]
    ];

    elements.push(...table(
        inForm3Headers,
        inForm3Rows,
        [20, 14, 18, 24, 24],
        "Table 5.3: Input Form Specifications: Job Posting & Application Submission"
    ));

    // ==========================================
    // 5.5 DATABASE DESIGN
    // ==========================================
    elements.push(sectionHeading("5.5 Database Design"));

    elements.push(subSectionHeading("5.5.1 Relational Database Normalization Analysis"));
    elements.push(
        p("Database normalization is the formal mathematical technique utilized in relational schema design to eliminate data redundancy, prevent insertion, update, and deletion anomalies, and enforce referential integrity. The database schema of this platform was engineered through progressive normalization stages:"),
        bullet("First Normal Form (1NF): Achieved by ensuring that all column values are atomic (e.g., separating user first and last names, isolating distinct phone numbers) and guaranteeing that every table possesses a primary key identifier (`id` BIGINT AUTO_INCREMENT).", "• First Normal Form (1NF):"),
        bullet("Second Normal Form (2NF): Achieved by ensuring that all non-key attributes are fully functionally dependent on the entire primary key. In entities with composite natural keys (such as `user_roles`), partial functional dependencies were eliminated by isolating join mappings.", "• Second Normal Form (2NF):"),
        bullet("Third Normal Form (3NF): Achieved by eliminating transitive dependencies (where non-key column A determines non-key column B). For example, rather than embedding company details inside the `jobs` table, company information is isolated within the `companies` table, and `jobs` references `company_id` as a foreign key.", "• Third Normal Form (3NF):"),
        bullet("Boyce-Codd Normal Form (BCNF): Achieved across all tables by ensuring that for every functional dependency X -> Y, X is a superkey.", "• Boyce-Codd Normal Form (BCNF):")
    );

    elements.push(subSectionHeading("5.5.2 Complete Database Schema Tables"));
    elements.push(
        p("Tables 5.4 through 5.14 provide the complete, formal relational database schema definitions for all eleven tables within the MySQL 8.0 `placement_db` database, specifying Field Name, Data Type, Constraints, Key Type, Default Value, and Field Description:"),
        new Paragraph({ spacing: { before: 80 } })
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
        ["location", "VARCHAR(100)", "NULL", "None", "NULL", "Corporate headquarters or recruitment office location"],
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
        ["designation", "VARCHAR(50)", "NOT NULL", "None", "None", "Academic rank (Assistant Professor, HOD, etc.)"],
        ["employee_code", "VARCHAR(30)", "NOT NULL, UNIQUE", "Unique Key", "None", "Official institutional faculty identification code"]
    ];
    elements.push(...table(fHeaders, fRows, [16, 16, 20, 16, 14, 18], "Table 5.8: Relational Database Schema: faculties Table"));

    // Table 5.9: admins
    const aHeaders = ["Column Name", "Data Type", "Constraints", "Key Type", "Default", "Description"];
    const aRows = [
        ["id", "BIGINT", "NOT NULL, AUTO_INCREMENT", "Primary Key (PK)", "AUTO", "Unique administrator identifier"],
        ["user_id", "BIGINT", "NOT NULL, UNIQUE", "Foreign Key (FK)", "None", "References users(id) (1:1 relationship)"],
        ["admin_name", "VARCHAR(100)", "NOT NULL", "None", "None", "Administrator full name"],
        ["permissions", "VARCHAR(255)", "NOT NULL", "None", "ALL", "System authority permission scope"]
    ];
    elements.push(...table(aHeaders, aRows, [16, 16, 20, 16, 14, 18], "Table 5.9: Relational Database Schema: admins Table"));

    // Table 5.10: jobs
    const jHeaders = ["Column Name", "Data Type", "Constraints", "Key Type", "Default", "Description"];
    const jRows = [
        ["id", "BIGINT", "NOT NULL, AUTO_INCREMENT", "Primary Key (PK)", "AUTO", "Unique job posting identifier"],
        ["company_id", "BIGINT", "NOT NULL", "Foreign Key (FK)", "None", "References companies(id) (N:1 relationship)"],
        ["title", "VARCHAR(150)", "NOT NULL", "None", "None", "Job role title (e.g. Software Engineer)"],
        ["description", "TEXT", "NOT NULL", "None", "None", "Comprehensive role responsibilities & description"],
        ["department", "VARCHAR(50)", "NOT NULL", "None", "None", "Target engineering department eligibility"],
        ["required_skills", "TEXT", "NOT NULL", "None", "None", "Comma-separated required technical competencies"],
        ["min_cgpa", "DOUBLE", "NOT NULL", "None", "0.0", "Minimum academic CGPA cutoff threshold"],
        ["salary_package", "VARCHAR(50)", "NOT NULL", "None", "None", "Compensation package (e.g. 8.5 LPA)"],
        ["status", "VARCHAR(20)", "NOT NULL", "None", "OPEN", "Posting lifecycle status (OPEN, CLOSED)"],
        ["deadline", "DATE", "NOT NULL", "None", "None", "Final application cutoff date"]
    ];
    elements.push(...table(jHeaders, jRows, [16, 16, 20, 16, 14, 18], "Table 5.10: Relational Database Schema: jobs Table"));

    // Table 5.11: applications
    const appHeaders = ["Column Name", "Data Type", "Constraints", "Key Type", "Default", "Description"];
    const appRows = [
        ["id", "BIGINT", "NOT NULL, AUTO_INCREMENT", "Primary Key (PK)", "AUTO", "Unique job application record identifier"],
        ["student_id", "BIGINT", "NOT NULL", "Foreign Key (FK)", "None", "References students(id) (N:1 relationship)"],
        ["job_id", "BIGINT", "NOT NULL", "Foreign Key (FK)", "None", "References jobs(id) (N:1 relationship)"],
        ["applied_at", "DATETIME", "NOT NULL", "None", "CURRENT_TIMESTAMP", "Timestamp of initial application submission"],
        ["status", "VARCHAR(30)", "NOT NULL", "None", "APPLIED", "Status (APPLIED, SHORTLISTED, SELECTED, REJECTED)"],
        ["recruiter_notes", "TEXT", "NULL", "None", "NULL", "Confidential recruiter notes or feedback comments"]
    ];
    elements.push(...table(appHeaders, appRows, [16, 16, 20, 16, 14, 18], "Table 5.11: Relational Database Schema: applications Table"));

    // Table 5.12: resumes (Dual Storage)
    const resHeaders = ["Column Name", "Data Type", "Constraints", "Key Type", "Default", "Description"];
    const resRows = [
        ["id", "BIGINT", "NOT NULL, AUTO_INCREMENT", "Primary Key (PK)", "AUTO", "Unique resume document identifier"],
        ["student_id", "BIGINT", "NOT NULL", "Foreign Key (FK)", "None", "References students(id) (N:1 relationship)"],
        ["file_name", "VARCHAR(255)", "NOT NULL", "None", "None", "Original sanitized filename of uploaded PDF"],
        ["file_type", "VARCHAR(50)", "NOT NULL", "None", "application/pdf", "MIME type confirmed by magic-byte verification"],
        ["file_size", "BIGINT", "NOT NULL", "None", "0", "Binary document file size in bytes (max 10MB)"],
        ["file_path", "VARCHAR(500)", "NOT NULL", "None", "None", "Mirrored relative disk storage path"],
        ["file_data", "LONGBLOB", "NOT NULL", "None", "None", "Primary raw binary stream stored in database"],
        ["is_active", "BOOLEAN", "NOT NULL", "None", "TRUE", "Active resume indicator; older versions set FALSE"],
        ["uploaded_at", "DATETIME", "NOT NULL", "None", "CURRENT_TIMESTAMP", "Timestamp of document upload and ingestion"]
    ];
    elements.push(...table(resHeaders, resRows, [16, 16, 20, 16, 14, 18], "Table 5.12: Relational Database Schema: resumes Table (Dual Storage)"));

    // Table 5.13: ai_analysis
    const aiHeaders = ["Column Name", "Data Type", "Constraints", "Key Type", "Default", "Description"];
    const aiRows = [
        ["id", "BIGINT", "NOT NULL, AUTO_INCREMENT", "Primary Key (PK)", "AUTO", "Unique AI evaluation analysis record identifier"],
        ["student_id", "BIGINT", "NOT NULL", "Foreign Key (FK)", "None", "References students(id) (N:1 relationship)"],
        ["job_id", "BIGINT", "NOT NULL", "Foreign Key (FK)", "None", "References jobs(id) (N:1 relationship)"],
        ["overall_match", "INT", "NOT NULL", "None", "0", "Computed ATS match percentage score (0 to 100)"],
        ["matched_skills", "TEXT", "NULL", "None", "NULL", "JSON array or text list of verified matched skills"],
        ["missing_skills", "TEXT", "NULL", "None", "NULL", "JSON array or text list of critical missing skills"],
        ["ai_feedback", "LONGTEXT", "NULL", "None", "NULL", "Structured interview preparation advice and suggestions"],
        ["analyzed_at", "DATETIME", "NOT NULL", "None", "CURRENT_TIMESTAMP", "Timestamp of AI evaluation execution"]
    ];
    elements.push(...table(aiHeaders, aiRows, [16, 16, 20, 16, 14, 18], "Table 5.13: Relational Database Schema: ai_analysis Table"));

    // Table 5.14: otp_verifications
    const otpHdrs = ["Column Name", "Data Type", "Constraints", "Key Type", "Default", "Description"];
    const otpRows = [
        ["id", "BIGINT", "NOT NULL, AUTO_INCREMENT", "Primary Key (PK)", "AUTO", "Unique OTP verification transaction identifier"],
        ["email", "VARCHAR(100)", "NOT NULL", "None", "None", "Target institutional email address"],
        ["otp_code", "VARCHAR(6)", "NOT NULL", "None", "None", "Cryptographically generated 6-digit numeric token"],
        ["expiry_time", "DATETIME", "NOT NULL", "None", "None", "Expiration timestamp (strictly 10 minutes from creation)"],
        ["is_verified", "BOOLEAN", "NOT NULL", "None", "FALSE", "Flag indicating whether token has been redeemed"],
        ["created_at", "DATETIME", "NOT NULL", "None", "CURRENT_TIMESTAMP", "Timestamp of OTP generation and email dispatch"]
    ];
    elements.push(...table(otpHdrs, otpRows, [16, 16, 20, 16, 14, 18], "Table 5.14: Relational Database Schema: otp_verifications Table"));

    // ==========================================
    // 5.6 OUTPUT DESIGN
    // ==========================================
    elements.push(sectionHeading("5.6 Output Design"));

    elements.push(subSectionHeading("5.6.1 Output Design Principles and Dashboard Layouts"));
    elements.push(
        p("Output design dictates how processed information is transformed into intuitive visual artifacts that empower stakeholders to make informed decisions. The output interfaces of the platform are engineered to deliver high information density without visual clutter, employing modern SaaS Orange design motifs, responsive card grids, color-coded badges, and interactive Chart.js graphical visualizations."),
        p("Key output design principles implemented include:"),
        bullet("Hierarchical Information Visual Hierarchy: The most critical metrics (e.g., Overall ATS Match Score, Application Status, Open Vacancy Counts) are prominently displayed at the top of views utilizing large typography and high-contrast color badges.", "1. Visual Hierarchy:"),
        bullet("Consistent Semantic Color Palettes: Emerald Green signifies success, high ATS compatibility (>=75%), and selection; Amber signifies warning, moderate match (50–74%), and missing skills; Crimson Red signifies critical deficiency, low match (<50%), or rejection.", "2. Semantic Color Schemes:"),
        bullet("Fully Null-Safe Thymeleaf Rendering: To prevent `net::ERR_INCOMPLETE_CHUNKED_ENCODING` stream crashes, all output templates employ defensive null-checks before accessing properties (`th:text=\"${aiDetails != null && aiDetails.recommendation != null ? aiDetails.recommendation : 'Analysis not available.'}\"`).", "3. Null-Safe Stream Safety:"),
        bullet("Interactive Chart.js Visualizers: Dynamic HTML5 Canvas charts render placement probability curves, departmental placement distributions, and salary histograms.", "4. Interactive Analytics:")
    );

    elements.push(subSectionHeading("5.6.2 Detailed Specifications of Output Interfaces and AI Views"));
    elements.push(
        p("Table 5.15 presents the comprehensive Output Interface Specifications across all ten primary views of the application:"),
        new Paragraph({ spacing: { before: 80 } })
    );

    const outHeaders = ["Output Screen / View", "Target User Role", "Primary Display Elements & Controls", "Data Source / Entity", "Visual Presentation Style"];
    const outRows = [
        ["Student Dashboard (/student/dashboard)", "Student", "Recent job postings, active applications counter, profile completion badge", "jobs, applications, students", "Card grid with SaaS Orange accents; responsive tables."],
        ["Job Details & AI ATS View (/student/job/{id})", "Student", "Job criteria, ATS Match gauge (0-100%), Matched skills, Missing skills, AI advice", "jobs, ai_analysis, resumes", "Circular progress bar; green/amber pill badges; advice card."],
        ["'Jobs For You' Recommender (/student/jobs/matched)", "Student", "Ranked job cards sorted by ATS match score; match percentage badges; quick apply", "jobs, ai_analysis", "Ranked card grid with animated loading screen indicator."],
        ["Companies Directory (/student/companies)", "Student", "Alphabetical company grid, corporate logo, industry, open vacancies counter", "companies, jobs", "Modern SaaS card grid; clickable links to company details."],
        ["Company Details (/student/company/{id})", "Student", "Company profile overview, location, website, list of currently active job postings", "companies, jobs", "Split layout: company branding header with job cards."],
        ["Application Status View (/student/applications)", "Student", "Table of submitted applications, applied date, recruiter status badge, notes", "applications, jobs", "Striped responsive table; color-coded status badges."],
        ["Recruiter Dashboard (/company/dashboard)", "Company Recruiter", "Active job listings counter, total applicant count, recent applications table", "jobs, applications", "Analytical stat cards; recent activity stream table."],
        ["Candidate Screening View (/company/job/{id}/applicants)", "Company Recruiter", "Applicant roster pre-sorted by ATS score; resume download; status dropdown", "applications, students, ai_analysis", "Sortable data table; single-click PDF download & status updater."],
        ["Faculty Placement View (/faculty/dashboard)", "Faculty Coordinator", "Departmental placement percentage, placed vs unplaced ratio, skill deficit chart", "students, applications, jobs", "Chart.js doughnut and bar charts; student roster filters."],
        ["System Governance View (/admin/dashboard)", "System Administrator", "User count by role, system audit event logs, database health indicator", "users, audit_logs", "High-density admin table; system health status indicators."]
    ];

    elements.push(...table(
        outHeaders,
        outRows,
        [20, 16, 26, 18, 20],
        "Table 5.15: Output Interface Specifications: Dashboards, Cards, and Analytical Views"
    ));

    return elements;
}

module.exports = { getChapter5 };
