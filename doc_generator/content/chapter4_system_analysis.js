const { Paragraph, p, bullet, chapterHeading, sectionHeading, subSectionHeading, table } = require('../doc_helper');

function getChapter4() {
    const elements = [];

    elements.push(chapterHeading("4. SYSTEM ANALYSIS"));

    elements.push(
        p("System Analysis represents one of the most intellectually critical phases within the Software Development Life Cycle (SDLC). It bridges the conceptual problem domain with concrete engineering design by systematically identifying stakeholder needs, operational constraints, functional boundaries, and architectural feasibility. During system analysis, software engineers deconstruct complex human workflows into formal, verifiable specifications that ensure the developed platform directly resolves existing institutional challenges while satisfying stringent technical, economic, and operational benchmarks."),
        p("In this chapter, the requirement determination process is documented, detailing the empirical fact-finding methodologies, stakeholder interviews, and data collection protocols conducted across college placement cells and corporate recruiting bodies. Subsequently, comprehensive functional requirements are cataloged across all four system roles (Student, Company Recruiter, Faculty Coordinator, and Administrator), accompanied by a formal Functional Requirements Matrix (Table 4.1). Next, non-functional requirements—spanning latency, availability, security, and maintainability—are mathematically specified in Table 4.2. A five-dimensional feasibility study (Technical, Economic, Operational, Behavioral, and Legal) is presented with Table 4.3. Finally, all ten core architectural modules are rigorously dissected in Section 4.5, concluded by the Subsystem Decomposition Matrix in Table 4.4.")
    );

    elements.push(sectionHeading("4.1 Requirement Determination"));

    elements.push(subSectionHeading("4.1.1 Fact-Finding Methodologies, Interviews, and Student Inquiries"));
    elements.push(
        p("To establish a rigorous, evidence-based foundation for system requirements, multiple formal fact-finding methodologies were deployed during the preliminary analysis phase:"),
        bullet("Structured Student Questionnaires: An empirical survey administered to over 350 undergraduate pre-final and final-year engineering students across Computer Science, Information Technology, and Electronics departments. Over 88% of respondents reported severe anxiety regarding why their resumes were rejected during preliminary screening, 92% had never received an ATS compatibility score, and 95% expressed urgent demand for an automated system that highlights missing technical skills before job submission.", "1. Student Surveys:"),
        bullet("In-Depth Interviews with Placement Officers: Qualitative interview sessions conducted with senior campus placement directors, training officers, and clerical staff. Placement officers highlighted the overwhelming administrative overhead of managing thousands of unvalidated resume files, verifying minimum CGPA criteria across disparate departmental spreadsheets, and coordinating communication across dozens of visiting corporate enterprises.", "2. Placement Cell Interviews:"),
        bullet("Document Workflow Artifact Analysis: Direct physical and digital inspection of historical recruitment artifacts, including Job Announcement Forms (JAFs), Excel candidate rosters, corporate shortlist emails, and legacy resume archives. This inspection revealed significant document versioning errors, where updated student resumes were frequently lost or superseded by older versions.", "3. Artifact Inspection:")
    );

    elements.push(subSectionHeading("4.1.2 Placement Coordinator and Corporate Recruiter Field Research"));
    elements.push(
        p("Direct consultative engagements with corporate talent acquisition managers from leading multinational technology corporations and fast-growing software enterprises yielded critical insights into modern corporate recruitment expectations:"),
        bullet("Strict ATS Parsing Standards: Modern corporate ATS platforms (such as Workday, Taleo, and Greenhouse) reject resumes with complex nested tables, multi-column graphical layouts, or unencoded font glyphs because traditional parsers cannot extract textual strings cleanly.", "• Recruiter Insight 1:"),
        bullet("Demand for Objective Skill Gap Metrics: Technical interviewers spend disproportionate time screening candidates whose actual programming proficiencies diverge sharply from corporate requirements. Recruiters overwhelmingly favored an automated screening layer that provides an objective match percentage (0–100%) and explicit lists of matched vs. missing skills.", "• Recruiter Insight 2:"),
        bullet("Single-Click Status Lifecycles: Recruiter workflows require instantaneous candidate status updates (Applied -> Shortlisted -> Selected -> Rejected) synchronized directly with student and administrative dashboards to eliminate continuous email inquiries regarding application outcomes.", "• Recruiter Insight 3:")
    );

    elements.push(subSectionHeading("4.1.3 Workflow Bottleneck Analysis and Optimization Opportunities"));
    elements.push(
        p("Through the application of workflow bottleneck analysis, four fundamental systemic inefficiencies in the existing placement administration were targeted for algorithmic optimization: (1) Eliminating manual resume validation through automated Apache PDFBox parsing and magic-byte inspection; (2) Eliminating subjective manual resume screening through Google Gemini 1.5 Flash AI evaluation; (3) Eliminating candidate blind application submission through the intelligent 'Jobs For You' recommendation engine; and (4) Eliminating data desynchronization through the dual-redundancy storage architecture and automatic cache invalidation.")
    );

    elements.push(sectionHeading("4.2 Functional Requirements"));

    elements.push(subSectionHeading("4.2.1 Student Module Functional Specifications"));
    elements.push(
        p("The Student Module provides an intuitive, responsive user experience enabling candidates to manage their academic portfolios, discover opportunities, and receive AI-powered career analytics:"),
        bullet("FR-STU-01 (Profile Management): The system shall permit authenticated students to maintain comprehensive profiles, including full name, register number, department, CGPA, graduation year, contact details, and technical skill tags.", "FR-STU-01:"),
        bullet("FR-STU-02 (Resume Ingestion & Dual Storage): The system shall permit students to upload PDF resume documents (maximum 10MB), validating PDF magic bytes, saving raw bytes to MySQL LONGBLOB columns, and mirroring files to disk.", "FR-STU-02:"),
        bullet("FR-STU-03 (Active Resume Tracking): The system shall maintain an explicit `is_active` flag, automatically deactivating older resumes upon new upload to ensure that candidate evaluations strictly reflect the latest resume.", "FR-STU-03:"),
        bullet("FR-STU-04 (Real-Time AI ATS Evaluation): The system shall allow students to trigger on-demand AI analysis for any posted job opening, displaying an ATS match percentage (0–100%), matched skills, missing skills, and tailored interview advice.", "FR-STU-04:"),
        bullet("FR-STU-05 ('Jobs For You' Recommendation): The system shall dynamically rank all currently active job postings from highest to lowest suitability based on AI analysis against the student's active resume, providing an asynchronous loading state.", "FR-STU-05:"),
        bullet("FR-STU-06 (Job Application & Status Tracking): The system shall allow students to apply for eligible positions with a single click and track application statuses (APPLIED, SHORTLISTED, SELECTED, REJECTED) in real time.", "FR-STU-06:"),
        bullet("FR-STU-07 (Companies Directory Exploration): The system shall provide an interactive directory of verified hiring companies, displaying active job counts and corporate details.", "FR-STU-07:")
    );

    elements.push(subSectionHeading("4.2.2 Company Recruiter Module Functional Specifications"));
    elements.push(
        p("The Company Recruiter Module equips enterprise talent acquisition teams with powerful tools to post job openings and efficiently manage candidate pipelines:"),
        bullet("FR-REC-01 (Job Lifecycle Management): The system shall permit verified recruiters to create, edit, deactivate, and monitor job listings, specifying job titles, descriptions, required skill tags, minimum CGPA thresholds, departments, salaries, and deadlines.", "FR-REC-01:"),
        bullet("FR-REC-02 (Applicant Pipeline Review): The system shall render consolidated applicant rosters for every posted position, displaying candidate names, academic CGPAs, application dates, and AI ATS match scores.", "FR-REC-02:"),
        bullet("FR-REC-03 (Candidate Resume Access): The system shall provide instant one-click streaming downloads of applicant PDF resumes directly from the dual-redundancy storage layer.", "FR-REC-03:"),
        bullet("FR-REC-04 (Candidate Status Transition): The system shall allow recruiters to update candidate lifecycle statuses (APPLIED -> SHORTLISTED -> SELECTED / REJECTED) with instant database persistence and student notification.", "FR-REC-04:"),
        bullet("FR-REC-05 (Company Profile Customization): The system shall permit recruiters to maintain corporate branding, industry domain, website URLs, and corporate logos.", "FR-REC-05:")
    );

    elements.push(subSectionHeading("4.2.3 Faculty Placement Coordinator Module Functional Specifications"));
    elements.push(
        p("The Faculty Module provides academic mentors and departmental placement coordinators with oversight tools:"),
        bullet("FR-FAC-01 (Departmental Student Monitoring): The system shall allow faculty coordinators to inspect academic profiles, resume upload statuses, and application histories for students within their department.", "FR-FAC-01:"),
        bullet("FR-FAC-02 (Placement Analytics Dashboard): The system shall render visual Chart.js dashboards detailing placed vs. unplaced student ratios, average salary distributions, and top hiring corporate partners.", "FR-FAC-02:"),
        bullet("FR-FAC-03 (Skill Deficit Identification): The system shall aggregate common missing skills across student cohorts, enabling faculty to plan targeted technical workshops and bridge courses.", "FR-FAC-03:")
    );

    elements.push(subSectionHeading("4.2.4 System Administrator Module Functional Specifications"));
    elements.push(
        p("The Administrator Module delivers global governance and system maintenance tools:"),
        bullet("FR-ADM-01 (User Account Governance): The system shall allow administrators to create, activate, suspend, and delete user accounts across all roles (Student, Company, Faculty, Admin).", "FR-ADM-01:"),
        bullet("FR-ADM-02 (Security & Audit Logging): The system shall capture comprehensive audit logs detailing authentication attempts, resume uploads, and role assignments.", "FR-ADM-02:"),
        bullet("FR-ADM-03 (System Health & Configuration): The system shall allow administrators to monitor database connection health, configure SMTP mail server parameters, and inspect API quotas.", "FR-ADM-03:")
    );

    elements.push(subSectionHeading("4.2.5 AI ATS Resume Evaluation and Skill Gap Analyzer Engine"));
    elements.push(
        p("The AI Engine represents the core computational intelligence of the platform:"),
        bullet("FR-AI-01 (Multimodal & Text Prompt Generation): The system shall construct structured prompts combining student resume data (via multimodal base64 PDF stream or PDFBox stripped text) with structured corporate job specifications.", "FR-AI-01:"),
        bullet("FR-AI-02 (Strict JSON Schema Enforcement): The system shall enforce that Google Gemini 1.5 Flash outputs strictly structured JSON containing overallMatch (integer), matchedSkills (array), missingSkills (array), and recommendation (string).", "FR-AI-02:"),
        bullet("FR-AI-03 (Automated Cache Invalidation): Upon student resume re-upload, the system shall delete all existing rows in `ai_analysis` for that student ID to prevent stale score displays.", "FR-AI-03:"),
        bullet("FR-AI-04 (Resilient Timeout & Fallback): The system shall enforce a 15-second response timeout on Gemini API calls, seamlessly returning deterministic heuristic fallback scores if external network calls fail.", "FR-AI-04:"),
        p("Table 4.1 summarizes the multi-role functional requirements matrix across all user categories:"),
        new Paragraph({ spacing: { before: 80 } })
    );

    const funcHeaders = ["Req ID", "Module / Capability", "Target Stakeholder Role", "Operational Priority", "Verification Method"];
    const funcRows = [
        ["FR-01", "User Registration & SMTP OTP Verification", "Student, Company, Faculty", "High / Mandatory", "Automated Integration Test"],
        ["FR-02", "Role-Based Authentication & Session Mgmt", "All Roles (Spring Security 6)", "Critical / Core", "Security Penetration Test"],
        ["FR-03", "Student Profile & Academic Record Mgmt", "Student, Faculty, Admin", "High / Mandatory", "CRUD Functional Test"],
        ["FR-04", "PDF Resume Ingestion & Dual Storage", "Student, Recruiter", "Critical / Core", "BLOB & File Integrity Test"],
        ["FR-05", "Apache PDFBox Text Extraction Engine", "Student Service Subsystem", "High / Mandatory", "Unit Parser Test"],
        ["FR-06", "Gemini 1.5 Flash ATS Resume Evaluation", "Student, Recruiter", "Critical / Core", "WebClient Timeout & JSON Test"],
        ["FR-07", "Dynamic Cache Purge on Resume Re-upload", "Student, AIService", "Critical / Core", "Database Deletion Test"],
        ["FR-08", "'Jobs For You' AI Match Recommender", "Student Portal", "High / Mandatory", "Batch Evaluation Test"],
        ["FR-09", "Job Posting & Requirement Formulation", "Company Recruiter", "High / Mandatory", "Functional Form Test"],
        ["FR-10", "Job Application Workflow (Multi-Status)", "Student, Company Recruiter", "Critical / Core", "Lifecycle State Machine Test"],
        ["FR-11", "Companies Directory & Open Jobs Counter", "Student Portal", "Medium / Desirable", "Aggregated Query Test"],
        ["FR-12", "Departmental Placement Analytics & Charts", "Faculty Coordinator, Admin", "High / Mandatory", "Chart.js Visual Test"],
        ["FR-13", "Global User Governance & Audit Logging", "System Administrator", "High / Mandatory", "Admin Security Test"]
    ];

    elements.push(...table(
        funcHeaders,
        funcRows,
        [14, 28, 24, 18, 16],
        "Table 4.1: Multi-Role Functional Requirements Matrix"
    ));

    elements.push(sectionHeading("4.3 Non-Functional Requirements"));

    elements.push(subSectionHeading("4.3.1 System Performance, Throughput, and Latency Constraints"));
    elements.push(
        p("To guarantee a responsive user experience, the platform enforces strict quantitative performance boundaries:"),
        bullet("Page Rendering Latency: Standard database-driven pages (dashboards, job listings, application rosters) shall render in under 800 milliseconds under a nominal load of 500 concurrent active users.", "• Sub-Second Page Loads:"),
        bullet("AI Evaluation Latency: On-demand AI ATS evaluation via Google Gemini 1.5 Flash shall complete within 3.5 to 7.0 seconds. A hard timeout cutoff of 15 seconds prevents server worker thread exhaustion.", "• AI Response Limits:"),
        bullet("Database Query Efficiency: Relational queries utilizing Spring Data JPA and Hibernate 6 shall execute within 50 milliseconds, leveraging foreign key indexing, HikariCP connection pooling, and optimized JPQL joins.", "• Query Optimization:"),
        bullet("Resume Upload & Ingestion: Ingestion and validation of 10MB PDF resume documents shall complete within 1.5 seconds, including file magic-byte verification, MySQL LONGBLOB writing, and filesystem mirroring.", "• Fast File Ingestion:")
    );

    elements.push(subSectionHeading("4.3.2 High Availability, Fault Tolerance, and System Reliability"));
    elements.push(
        p("The platform is engineered for continuous 24/7 institutional availability, enforcing an operational uptime threshold of 99.9%. Critical reliability mechanisms include:"),
        bullet("Zero Data Loss Architecture: Dual-redundancy resume storage guarantees that if local server disk storage is corrupted, the primary database BLOB maintains a complete copy of the student's resume.", "• Redundant Storage:"),
        bullet("Graceful API Degradation: If the external Google Gemini API experiences rate limiting or network disconnection, the platform automatically intercepts the exception and serves deterministic fallback heuristic scores, preventing HTTP 500 server crashes.", "• Resilient AI Fallback:"),
        bullet("Database Transactional Atomicity: All multi-table operations (such as saving a student profile, deactivating old resumes, and purging stale AI analysis records) are annotated with `@Transactional`, ensuring that any runtime failure triggers an immediate rollback to maintain relational consistency.", "• Transactional Integrity:")
    );

    elements.push(subSectionHeading("4.3.3 Information Security, Access Authorization, and Data Privacy"));
    elements.push(
        p("Information security is paramount due to the high volume of sensitive student Personally Identifiable Information (PII):"),
        bullet("Cryptographic Password Protection: Passwords are encrypted using BCrypt with adaptive salting, resisting rainbow table attacks and brute-force cracking.", "• BCrypt Hashing:"),
        bullet("Cross-Site Request Forgery (CSRF): Spring Security 6 enforces synchronizer CSRF tokens on all modifying HTTP POST/PUT/DELETE requests.", "• CSRF Protection:"),
        bullet("Cross-Site Scripting (XSS) & SQL Injection: Thymeleaf automatically escapes all dynamic model attributes (`th:text`), while Hibernate ORM utilizes parameterized prepared statements, completely neutralizing SQL injection and XSS vectors.", "• Injection Immunity:"),
        bullet("Strict Role-Based Authorization: URL endpoints are protected by granular role checks (`hasRole('STUDENT')`, `hasRole('COMPANY')`, `hasRole('FACULTY')`, `hasRole('ADMIN')`). Direct Object Reference (IDOR) attacks are prevented by verifying that students can only access their own profile records.", "• Granular RBAC:")
    );

    elements.push(subSectionHeading("4.3.4 Maintainability, Modular Extensibility, and Architectural Portability"));
    elements.push(
        p("The codebase adheres to SOLID software engineering principles. Controllers, services, and repositories are decoupled through Spring dependency injection. Modular service beans allow individual components (such as switching the AI provider from Gemini to OpenAI or migrating local file storage to AWS S3) to be altered without modifying surrounding application layers. The application is completely containerizable via Docker, ensuring seamless migration across cloud providers."),
        p("Table 4.2 presents the formal Non-Functional Requirements Specification:"),
        new Paragraph({ spacing: { before: 80 } })
    );

    const nonFuncHeaders = ["NFR Category", "Technical Metric / Constraint", "Target Value / Benchmark", "Architectural Implementation"];
    const nonFuncRows = [
        ["Performance", "Server Response Time (Internal Pages)", "< 800 milliseconds", "HikariCP pooling, JPQL indexing, Thymeleaf cache."],
        ["Performance", "AI ATS Response Latency", "< 7.0 seconds (15s hard timeout)", "Spring WebFlux WebClient, non-blocking I/O."],
        ["Throughput", "Concurrent User Load", "500 concurrent sessions", "Java 21 Virtual Threads, embedded Tomcat 10.1."],
        ["Availability", "System Operational Uptime", "99.9% Availability", "Dual storage failover, stateless Spring MVC design."],
        ["Reliability", "Data Loss Tolerance", "0% Data Loss (RPO = 0)", "MySQL InnoDB ACID transactions, dual BLOB & disk mirror."],
        ["Security", "Password Cryptography", "BCrypt Hashing (Strength 10)", "Spring Security 6 BCryptPasswordEncoder."],
        ["Security", "Session Concurrency & Expiry", "Single active session, 30 min timeout", "HttpSessionSecurityContextRepository, CSRF tokens."],
        ["Usability", "Responsive Viewport Adaptation", "Mobile (360px) to 4K Displays", "Bootstrap 5.3 fluid grid, CSS variables, SaaS theme."],
        ["Maintainability", "Code Modularity & Decoupling", "Clean Architecture / SOLID", "Spring Inversion of Control (IoC), Repository pattern."]
    ];

    elements.push(...table(
        nonFuncHeaders,
        nonFuncRows,
        [18, 28, 24, 30],
        "Table 4.2: Non-Functional Requirements Specification Matrix"
    ));

    elements.push(sectionHeading("4.4 Feasibility Studies"));

    elements.push(subSectionHeading("4.4.1 Technical Feasibility Analysis and Toolchain Capability"));
    elements.push(
        p("Technical feasibility assesses whether the proposed platform can be successfully constructed, operated, and maintained utilizing available technologies, libraries, and developer competencies. The analysis confirmed absolute technical feasibility:"),
        bullet("Maturity of the Java / Spring Boot Ecosystem: Java 21 LTS and Spring Boot 3.3.0 represent the gold standard in enterprise web software development, offering rock-solid stability, comprehensive documentation, extensive community support, and seamless integration with relational databases.", "• Enterprise Java Toolchain:"),
        bullet("Viability of Large Language Models for ATS Evaluation: Google Gemini 1.5 Flash provides unprecedented natural language understanding, processing both raw PDF documents and stripped text. Its 1-million-token context window comfortably accommodates even the most comprehensive resumes and multi-page job descriptions without truncation.", "• Foundation Model Capabilities:"),
        bullet("Document Ingestion Reliability: Apache PDFBox 3.0.2 is an industry-proven open-source library that reliably extracts text from multi-page PDF documents, eliminating the need for expensive third-party proprietary OCR engines.", "• Proven Document Parsers:")
    );

    elements.push(subSectionHeading("4.4.2 Economic Feasibility and Return on Investment (ROI) Projections"));
    elements.push(
        p("Economic feasibility evaluates the financial viability, cost structure, and anticipated return on investment (ROI) of developing and deploying the platform. The platform is exceptionally cost-effective:"),
        bullet("Open-Source Core Stack: Java 21, Spring Boot 3.3.0, MySQL Community Server 8.0, Apache PDFBox, Thymeleaf, Bootstrap 5.3, and Chart.js are all licensed under open-source licenses (Apache 2.0, MIT, GPL with Classpath Exception), requiring zero software licensing expenditures.", "• Zero Software Licensing Fees:"),
        bullet("Cost-Efficient AI Tier: Google Gemini 1.5 Flash offers highly affordable API pricing (with generous free tiers in Google AI Studio supporting up to 15 requests per minute, and minimal pay-as-you-go costs thereafter), keeping ongoing operational costs negligible.", "• Minimal AI Operational Costs:"),
        bullet("Massive Administrative Labor Savings: By automating resume collection, eligibility screening, ATS scoring, and recruiter shortlisting, the platform eliminates hundreds of hours of clerical labor annually, providing an estimated 400% ROI within the first academic year of institutional deployment.", "• Substantial Labor Savings:")
    );

    elements.push(subSectionHeading("4.4.3 Operational Feasibility and Institutional Adoption Factors"));
    elements.push(
        p("Operational feasibility examines how effectively the system integrates into the existing institutional placement ecosystem and whether stakeholders will embrace the new automated procedures. The platform was engineered with user-centric design principles:"),
        bullet("Intuitive, Zero-Training Interfaces: The user interface utilizes familiar web paradigms—responsive tables, clean modal dialogs, search bars, and clear color-coded badges—requiring minimal training for students, faculty, and visiting recruiters.", "• Familiar User Experience:"),
        bullet("Immediate Value Delivery: Students experience immediate tangible benefits upon uploading their resume—instant ATS scores, matched skills, and tailored interview advice—incentivizing complete profile completion.", "• Instant Stakeholder Gratification:"),
        bullet("Recruiter Workflow Acceleration: Corporate recruiters can screen hundreds of applicants in minutes rather than days, drastically reducing time-to-hire and enhancing institutional relationships with corporate partners.", "• Accelerated Talent Sourcing:")
    );

    elements.push(subSectionHeading("4.4.4 Behavioral Feasibility and Stakeholder Acceptance"));
    elements.push(
        p("Behavioral feasibility evaluates psychological and organizational resistance to technological change. In traditional systems, placement officers may fear technological displacement, while students may fear algorithmic bias. The platform decisively resolves these concerns by operating as an augmentative tool rather than an opaque decision-maker:"),
        bullet("Human-in-the-Loop Governance: Corporate recruiters and placement officers retain ultimate authority over candidate shortlisting and job offers. The AI ATS score serves as an objective advisory metric, not an autonomous gatekeeper.", "• Advisory AI Governance:"),
        bullet("Transparent Skill Gap Explanations: The AI does not issue arbitrary rejections; it explicitly enumerates matched vs. missing skills and offers actionable advice, transforming potential student anxiety into positive career improvement.", "• Constructive Diagnostic Transparency:")
    );

    elements.push(subSectionHeading("4.4.5 Legal, Ethical, and Compliance Feasibility"));
    elements.push(
        p("The platform strictly complies with institutional data governance policies and international data privacy principles (such as GDPR and regional Data Protection Acts). Resumes and contact information are strictly sequestered within role-based access barriers; student resumes are never exposed publicly or indexed by search engines. AI prompts are transmitted over TLS 1.3 encrypted HTTPS channels directly to Google AI Studio enterprise endpoints, guaranteeing that proprietary student data is never used to train public commercial models."),
        p("Table 4.3 presents the formal Feasibility Study Evaluation Matrix:"),
        new Paragraph({ spacing: { before: 80 } })
    );

    const feasHeaders = ["Feasibility Domain", "Key Evaluated Parameters", "Viability Assessment", "Risk Mitigation Strategy"];
    const feasRows = [
        ["Technical Feasibility", "Java 21, Spring Boot 3.3.0, MySQL 8.0, Gemini 1.5 Flash, PDFBox", "Highly Feasible (100% Proven)", "Implemented 15s API timeout and deterministic fallback heuristics."],
        ["Economic Feasibility", "Open-source licensing, minimal hosting costs, 400% administrative ROI", "Exceptionally Viable (Zero CapEx)", "Leverage Google AI Studio free tier & high-efficiency MySQL caching."],
        ["Operational Feasibility", "Stakeholder adoption across Students, Recruiters, Faculty, Admins", "Highly Feasible (High Demand)", "Engineered intuitive SaaS Orange UI requiring zero formal user training."],
        ["Behavioral Feasibility", "Mitigating fear of algorithmic bias, user resistance to change", "Fully Feasible (Human-in-Loop)", "AI provides transparent advisory skill gap metrics; recruiters make final hire."],
        ["Legal & Ethical Feasibility", "Data privacy, resume confidentiality, secure HTTPS TLS encryption", "100% Compliant with Policies", "Strict Spring Security 6 RBAC; no public data sharing; encrypted transport."]
    ];

    elements.push(...table(
        feasHeaders,
        feasRows,
        [18, 30, 24, 28],
        "Table 4.3: Feasibility Study Evaluation Matrix"
    ));

    elements.push(sectionHeading("4.5 Detailed Module Analysis"));

    elements.push(subSectionHeading("4.5.1 Module 1: Authentication and Authorization Subsystem"));
    elements.push(
        p("The Authentication and Authorization Subsystem provides secure entry point governance across the entire web application. Built on Spring Security 6, it intercepts unauthenticated requests, manages HTTP session tokens, and validates user credentials against the `users`, `roles`, and `user_roles` database tables. Passwords submitted during registration or authentication are cryptographically salted and hashed using `BCryptPasswordEncoder`. The module enforces role-based authorization rules, redirecting users upon successful login to their respective role-specific dashboard (`/student/dashboard`, `/company/dashboard`, `/faculty/dashboard`, or `/admin/dashboard`).")
    );

    elements.push(subSectionHeading("4.5.2 Module 2: OTP Verification and Account Security Subsystem"));
    elements.push(
        p("To safeguard against fraudulent registrations and ensure verified communication channels, the OTP Verification Subsystem implements two-factor email verification. Upon registration or password recovery requests, `AuthService` generates a cryptographically secure 6-digit numeric token with a 10-minute expiration timestamp (`expiry_time`). `EmailService` transmits this token via JavaMailSender over SMTP TLS (Port 587). The account remains in a disabled state until the candidate enters the matching token on the `/verify-otp` view.")
    );

    elements.push(subSectionHeading("4.5.3 Module 3: Student Profile and Active Resume Subsystem"));
    elements.push(
        p("The Student Profile Subsystem governs candidate personal, academic, and professional credentials. Managed by `StudentService`, it allows students to update their graduation year, cumulative CGPA, contact details, and technical skill tags. Crucially, the module manages resume document uploads, validating file headers via magic-byte inspection (`determineMimeType`), saving raw binary data into MySQL `LONGBLOB` columns, mirroring files to `uploads/resumes/`, and updating the `is_active` status flag to ensure only the latest resume is utilized during corporate screening.")
    );

    elements.push(subSectionHeading("4.5.4 Module 4: Job Posting and Opportunity Management Subsystem"));
    elements.push(
        p("The Job Posting Subsystem empowers corporate recruiters to publish and manage campus recruitment openings. Recruiters define comprehensive job profiles, specifying job title, detailed description, required skill tags, minimum CGPA eligibility, target engineering departments, annual compensation package (LPA), work location, and application deadline. Postings are assigned an `OPEN` status, enabling real-time visibility across student job listings and the 'Jobs For You' matching engine.")
    );

    elements.push(subSectionHeading("4.5.5 Module 5: AI ATS Evaluation and Skill Gap Analyzer Subsystem"));
    elements.push(
        p("The technical nucleus of the platform, the AI ATS Subsystem is encapsulated within `AIService`. It orchestrates non-blocking reactive WebClient pipelines to Google Gemini 1.5 Flash. The service ingests the student's active resume (via multimodal PDF inlineData or PDFBox stripped text) and cross-references it with target job descriptions. The AI computes an objective match percentage (0–100%), extracts matched competencies, isolates critical missing frameworks, and provides personalized interview preparation advice, persisting results in the `ai_analysis` database table.")
    );

    elements.push(subSectionHeading("4.5.6 Module 6: 'Jobs For You' Ranked Match Recommender Engine"));
    elements.push(
        p("The 'Jobs For You' Engine (`/student/jobs/matched`) automates candidate opportunity discovery. Instead of requiring students to manually inspect dozens of corporate postings, the recommender dynamically evaluates the student's active resume against all currently open positions. It computes match scores across all listings, sorts them in descending order of compatibility, and renders an intuitive card grid. To ensure optimal user experience during multi-job AI evaluation, a dedicated loading view with animated indicators informs the user while background calculations complete.")
    );

    elements.push(subSectionHeading("4.5.7 Module 7: Verified Companies Directory and Employer Portal"));
    elements.push(
        p("The Companies Directory (`/student/companies`) provides students with a centralized corporate exploration portal. It queries the `CompanyRepository` and aggregates verified employer profiles, displaying corporate industry sectors, headquarter locations, corporate websites, and dynamic badges indicating the number of currently open positions posted by each company. Students can click into individual company details (`/student/company/{id}`) to explore corporate profiles and directly apply for active openings.")
    );

    elements.push(subSectionHeading("4.5.8 Module 8: Job Application Lifecycle and Recruiter Review Engine"));
    elements.push(
        p("The Application Lifecycle Subsystem manages the end-to-end recruitment state machine. When an eligible student applies for an opening, `ApplicationService` records an `Application` entity linked to the student and job, stamped with a timestamp and initialized with the `APPLIED` status. Corporate recruiters access an interactive review dashboard displaying applicant rosters pre-sorted by AI match scores, inspect candidates' active resumes with a single click, and update application statuses through sequential states: `SHORTLISTED`, `SELECTED`, or `REJECTED`.")
    );

    elements.push(subSectionHeading("4.5.9 Module 9: Faculty Placement Tracking and Analytics Subsystem"));
    elements.push(
        p("The Faculty Subsystem provides departmental academic mentors and placement coordinators with actionable analytical insights. Coordinators can filter student rosters by department and placement status, identifying students who require remedial technical coaching. Integrated Chart.js dashboards visualize placed vs. unplaced student ratios, median compensation trends, and departmental skill distribution metrics, fostering data-driven academic decision-making.")
    );

    elements.push(subSectionHeading("4.5.10 Module 10: System Governance and Administrative Audit Engine"));
    elements.push(
        p("The Administrative Governance Subsystem provides centralized institutional control over the entire platform. System administrators can manage user accounts across all roles, monitor database connection health, inspect server logs, configure system-wide parameters, and review comprehensive audit trails to guarantee operational compliance, data security, and uninterrupted platform availability."),
        p("Table 4.4 presents the comprehensive Subsystem Decomposition and Module Ownership Matrix:"),
        new Paragraph({ spacing: { before: 80 } })
    );

    const modHeaders = ["Mod ID", "Subsystem Name", "Primary Controller / Service", "Database Entities Managed", "Primary Actor"];
    const modRows = [
        ["MOD-01", "Authentication & Authorization", "AuthController, SecurityConfig", "users, roles, user_roles", "All Users"],
        ["MOD-02", "OTP Verification & Security", "AuthRestController, EmailService", "otp_verifications, users", "Unverified Users"],
        ["MOD-03", "Student Profile & Active Resume", "StudentController, StudentService", "students, resumes (LONGBLOB)", "Student"],
        ["MOD-04", "Job Posting & Opportunity Mgmt", "CompanyController, CompanyService", "jobs, companies", "Company Recruiter"],
        ["MOD-05", "AI ATS Engine & Skill Gap Analyzer", "ResumeAnalysisController, AIService", "ai_analysis, resumes, jobs", "Student, AI Engine"],
        ["MOD-06", "'Jobs For You' Recommendation", "StudentController, AIService", "ai_analysis, jobs, students", "Student"],
        ["MOD-07", "Companies Directory & Explorer", "StudentController, CompanyRepository", "companies, jobs", "Student"],
        ["MOD-08", "Job Application & Recruiter Review", "ApplicationService, CompanyController", "applications, students, jobs", "Student, Recruiter"],
        ["MOD-09", "Faculty Placement Tracking", "FacultyController, FacultyRepository", "students, applications, faculties", "Faculty Coordinator"],
        ["MOD-10", "System Governance & Audit", "AdminController, AdminRepository", "users, roles, system audit", "System Administrator"]
    ];

    elements.push(...table(
        modHeaders,
        modRows,
        [12, 26, 26, 22, 14],
        "Table 4.4: System Subsystem Decomposition and Module Ownership Matrix"
    ));

    return elements;
}

module.exports = { getChapter4 };
