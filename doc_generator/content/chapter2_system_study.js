const { Paragraph, p, bullet, chapterHeading, sectionHeading, subSectionHeading, table } = require('../doc_helper');

function getChapter2() {
    const elements = [];

    elements.push(chapterHeading("2. SYSTEM STUDY"));

    elements.push(
        p("A comprehensive system study is an indispensable preliminary phase in the software engineering lifecycle. It establishes an empirical baseline by conducting a rigorous critical examination of prevailing operational methods, workflow hierarchies, and information processing protocols within the problem domain. By dissecting the manual procedures, technological limitations, and administrative friction points inherent in traditional campus recruitment management, the system study provides the foundational justification for developing an automated, AI-augmented, and cloud-ready software architecture."),
        p("In this chapter, the current campus placement operational model is critically scrutinized, detailing its administrative bottlenecks, screening inefficiencies, lack of diagnostic feedback, and data consistency vulnerabilities. Subsequently, the proposed architectural framework—anchored by Spring Boot 3.3.0, Java 21, MySQL 8.0, and Google Gemini 1.5 Flash Large Language Model integration—is formally introduced, delineating its technical superiority, multi-role governance, automated ATS parsing, and comprehensive advantages. Finally, an exhaustive comparative evaluation matrix is presented to systematically juxtapose the operational parameters of both systems.")
    );

    elements.push(sectionHeading("2.1 Existing System"));

    elements.push(subSectionHeading("2.1.1 Operational Workflow of Traditional Placement Systems"));
    elements.push(
        p("In most collegiate institutions, the conventional placement workflow relies heavily on disparate administrative artifacts: static Microsoft Excel spreadsheets, unstructured email inboxes, physical paper files, generic Google Drive folders, and ad-hoc WhatsApp broadcast channels. When an enterprise recruiter expresses an interest in hiring graduates from the college, the company sends a textual job description via email to the placement officer."),
        p("Upon receipt of this job specification, the placement coordinator manually transcribes the academic eligibility criteria (e.g., minimum CGPA threshold of 7.5, zero active backlogs, specific engineering disciplines) into an announcement bulletin. This notice is broadcast across various messaging groups or posted on physical campus notice boards. Interested students are instructed to fill out an online Google Form and attach their resume in whatever file format they possess (ranging from PDF and DOCX to scanned JPEG images or cloud storage links)."),
        p("Once the application window closes, the placement coordinator must manually download hundreds of resume files, verify whether the applicant's self-reported CGPA and backlog counts match official university examination records, compile the valid entries into a consolidated master spreadsheet, and manually compress the collection into a ZIP archive for email transmission to the corporate talent acquisition team."),
        p("At the corporate recruiter's office, the evaluation phase is fraught with screening fatigue. Human resource personnel and technical screening committees are forced to skim through hundreds of heterogeneous resume formats. Due to severe time constraints, recruiters spend an average of six to eight seconds scanning each resume, looking for familiar keywords or university brand names. Highly qualified engineering students whose resumes happen to use non-standard formatting, two-column visual tables that break generic parsers, or alternative terminology are routinely overlooked, leading to arbitrary candidate shortlisting.")
    );

    elements.push(subSectionHeading("2.1.2 Limitations and Structural Bottlenecks of Existing Systems"));
    elements.push(
        p("The manual and semi-digital methods employed in the existing placement administration suffer from profound structural liabilities that severely degrade operational efficiency, institutional reputation, and student outcomes:"),
        bullet("High Clerical Overhead & Human Error: Placement officers spend hundreds of hours manually compiling spreadsheets, verifying eligibility against university transcripts, and cross-checking candidate rosters. A single transcription error in a spreadsheet can inadvertently disqualify an eligible student or forward an ineligible candidate, resulting in corporate compliance disputes.", "1. Administrative Burden:"),
        bullet("Absence of Automated ATS Evaluation: Traditional platforms provide zero analytical evaluation of student resumes. Neither students nor placement officers can assess whether a candidate's resume adheres to industry ATS formatting standards, contains necessary technical keywords, or accurately mirrors the technical requirements of the target role.", "2. Lack of Intelligent Screening:"),
        bullet("Complete Absence of Diagnostic Skill Gap Feedback: When a student is rejected during preliminary screening, the existing system offers no explanation. Students remain entirely oblivious to whether their rejection was caused by low academic scores, unparseable document layouts, or specific missing technical frameworks (e.g., lack of Spring Boot, AWS, Docker, or React experience). Consequently, students continue submitting identical resumes across subsequent company drives with zero pedagogical improvement.", "3. Zero Diagnostic Feedback:"),
        bullet("Data Redundancy, Desynchronization & Security Risks: Storing candidate resumes across unsecured Google Drive links or local office hard drives exposes sensitive student personally identifiable information (PII)—including home addresses, telephone numbers, examination marks, and government identity numbers—to unauthorized access. Furthermore, document versioning is nonexistent; when a student updates their resume after learning a new skill, placement officers often forward outdated versions to recruiters.", "4. Security & Data Integrity:"),
        bullet("Recruiter Screening Fatigue & Inefficient Sourcing: Corporate recruiters visiting college campuses are overwhelmed by the volume of unstructured candidate profiles. Without automated pre-ranking or objective ATS matching scores, talent acquisition teams must expend significant technical labor screening candidates who fail to meet baseline job requirements.", "5. Recruiter Bottlenecks:"),
        bullet("No Centralized Multi-Role Visibility: Students, recruiters, faculty mentors, and academic administrators operate in isolated information silos. Faculty mentors have no real-time dashboard to monitor which students in their department have secured job offers, which students remain unplaced, or which technical domains exhibit systemic skill gaps.", "6. Information Fragmentation:")
    );

    elements.push(subSectionHeading("2.1.3 Advantages of Existing System"));
    elements.push(
        p("Despite its numerous structural limitations, the existing manual and basic spreadsheet-driven system possesses certain practical characteristics that explain its historical persistence across smaller institutions:"),
        bullet("Conceptual Simplicity: The system relies on universally familiar software tools such as Microsoft Excel, Google Forms, and email clients, requiring minimal technical orientation or specialized onboarding for administrative staff.", "• Low Technical Threshold:"),
        bullet("Minimal Direct Capital Outlay: The existing workflow does not require upfront investment in enterprise cloud infrastructure, dedicated application servers, commercial software licenses, or external Generative AI API subscriptions.", "• Zero Software Licensing Cost:"),
        bullet("Suitability for Small-Scale Operations: For institutions with very small student cohorts (e.g., fewer than fifty graduates) and infrequent recruitment visits, manual coordination can be sustained through direct human interaction without complex automation software.", "• Low Initial Complexity:")
    );

    elements.push(sectionHeading("2.2 Proposed System"));

    elements.push(subSectionHeading("2.2.1 Architecture and Operational Paradigm of the Proposed AI-Powered Platform"));
    elements.push(
        p("The proposed system, entitled the \"Campus Placement Prediction & Skill Gap Analyzer with AI ATS Resume Evaluation and Hiring Companies Portal\", is engineered as a state-of-the-art, enterprise-grade, distributed web platform designed to completely supersede manual campus placement management. Built upon the robust architectural foundations of Java 21 LTS, Spring Boot 3.3.0, Spring Security 6, Spring Data JPA, and MySQL 8.0, the platform introduces an intelligent, automated recruitment operational environment that serves four distinct stakeholders: Students, Corporate Recruiters, Faculty Coordinators, and System Administrators."),
        p("At the core of the proposed system is the integration of advanced Generative Artificial Intelligence—specifically Google Gemini 1.5 Flash—orchestrated through high-performance, non-blocking Spring WebClient pipelines. When a student uploads their resume in Portable Document Format (PDF), the system executes a multi-stage ingestion protocol. The binary document is validated via file header magic-byte inspection (verifying '%PDF' 0x25 0x50 0x44 0x46) and persisted within a resilient dual-storage architecture (storing raw binary bytes directly within MySQL LONGBLOB columns while simultaneously maintaining a mirrored physical file copy on the host server disk)."),
        p("Apache PDFBox 3.0.2 strips the underlying textual content, and the platform constructs a contextual, multimodal AI prompt containing the candidate's extracted profile and the comprehensive corporate job description. The Gemini 1.5 Flash engine evaluates candidate compatibility across semantic dimensions, calculating an objective ATS match percentage (0–100%), isolating exact matched technical skills, identifying critical missing proficiencies, and generating tailored interview preparation advice in strictly validated JSON format."),
        p("Furthermore, the platform provides an intelligent job matching recommendation engine ('Jobs For You') that computes a student's suitability against all active company listings, an interactive verified Companies Directory with live open vacancy counters, multi-status application lifecycle management (Applied, Shortlisted, Selected, Rejected), real-time SMTP OTP security verification, and rich analytics visualizers powered by Bootstrap 5.3 and Chart.js.")
    );

    elements.push(subSectionHeading("2.2.2 Detailed Advantages of the Proposed System"));
    elements.push(
        p("The proposed platform delivers transformative quantitative and qualitative advantages across all operational dimensions:"),
        bullet("Objective, Real-Time ATS Evaluation: Students receive instant, scientific assessments of their resume compatibility against active corporate job postings. The platform eliminates guesswork, enabling students to understand exactly how industry ATS algorithms perceive their technical qualifications.", "1. Instant ATS Diagnostics:"),
        bullet("Actionable Skill Gap Identification: Rather than receiving uninformative binary rejections, students are presented with explicit visual skill gap analyses. If a position requires Docker, Kubernetes, and Microservices, and the student's profile lacks these proficiencies, the system explicitly highlights them under 'Missing Skills' and provides structured pedagogical recommendations for remediation.", "2. Diagnostic Career Guidance:"),
        bullet("AI-Ranked Job Discovery ('Jobs For You'): The platform dynamically analyzes all active job postings against the student's active resume, automatically ranking positions from most suitable to least suitable. A dedicated loading screen provides seamless user feedback during background API calculations, ensuring a smooth user experience.", "3. Intelligent Job Matching:"),
        bullet("Guaranteed Cache Freshness & Stale Row Invalidation: Whenever a student updates their skills or uploads a new resume, the system automatically invalidates and purges all previous AI analysis records tied to that student, ensuring that displayed ATS match scores and recruiter evaluations strictly reflect the candidate's latest resume.", "4. Dynamic Cache Invalidation:"),
        bullet("Recruiter Productivity & Automated Screening: Corporate recruiters are freed from manual screening fatigue. Recruiters can view applicant rosters pre-sorted by ATS match score, inspect matched vs. missing skills at a glance, access dual-redundancy resume downloads, and transition candidate statuses (Applied -> Shortlisted -> Selected) with a single click.", "5. Recruiter Sourcing Acceleration:"),
        bullet("Dual-Redundancy Storage Architecture: By storing uploaded resumes as binary data in MySQL LONGBLOB structures as well as local disk paths, the system achieves complete fault tolerance against disk failures, filesystem path corruptions, or server migration data loss.", "6. Uncompromising Data Resilience:"),
        bullet("Institutional Governance & Academic Transparency: Departmental faculty coordinators and institutional administrators gain real-time visibility into student placement trajectories, departmental skill deficits, and recruiter engagement metrics through interactive Chart.js graphical dashboards.", "7. Multi-Role Academic Oversight:")
    );

    elements.push(subSectionHeading("2.2.3 Comparative Evaluation Matrix: Existing vs. Proposed System"));
    elements.push(
        p("To formally establish the operational and technical superiority of the proposed architecture, Table 2.1 presents a comprehensive comparative evaluation matrix contrasting the existing placement workflow against the proposed AI-powered platform across ten critical operational dimensions:"),
        new Paragraph({ spacing: { before: 100 } })
    );

    const compHeaders = ["Evaluation Dimension", "Traditional / Existing System", "Proposed AI-Integrated Platform"];
    const compRows = [
        ["Resume Ingestion & Format", "Manual submission via Google Forms / email; unvalidated file formats, scanned images.", "Automated ingestion; strictly validated PDF format via magic-byte inspection; dual BLOB & disk storage."],
        ["ATS Compatibility Scoring", "Nonexistent; zero objective evaluation of candidate resume formatting or keywords.", "Real-time AI ATS scoring (0–100%) powered by Google Gemini 1.5 Flash LLM."],
        ["Skill Gap Diagnosis", "Binary rejection/selection without diagnostic feedback; students unaware of deficits.", "Granular skill gap extraction isolating matched competencies, missing frameworks, and custom advice."],
        ["Candidate Pre-Ranking", "Unstructured candidate rosters; manual chronological or alphabetical sorting.", "Intelligent 'Jobs For You' engine ranking active postings from most suitable to least suitable."],
        ["Data Freshness & Cache", "Stale resume versions frequently retained and forwarded by clerical staff.", "Automated cache purge: deleting old AI rows on resume re-upload guarantees 100% data freshness."],
        ["Recruiter Screening Workflow", "Screening fatigue; 6–8 seconds manual skim per resume; subjective shortlisting.", "Automated candidate roster pre-sorted by ATS score; instant inspection of matched/missing proficiencies."],
        ["Employer Directory & Discovery", "Fragmented PDF notices; students unaware of all visiting corporate partners.", "Interactive Companies Directory displaying verified recruiters with live open vacancy counters."],
        ["Application Status Tracking", "Ad-hoc WhatsApp/notice board updates; high student anxiety and administrative queries.", "Real-time multi-status lifecycle tracking: APPLIED, SHORTLISTED, SELECTED, and REJECTED."],
        ["Security & Data Protection", "Sensitive student PII stored on public cloud drives without access governance.", "Spring Security 6 RBAC, BCrypt password hashing, session controls, and SMTP OTP verification."],
        ["Institutional Analytics", "Manual semester-end spreadsheet aggregation; delayed and error-prone reports.", "Real-time Chart.js visual dashboards displaying departmental placement percentages and skill trends."]
    ];

    elements.push(...table(
        compHeaders,
        compRows,
        [24, 38, 38],
        "Table 2.1: Comparative Evaluation Matrix: Existing System vs. Proposed Platform"
    ));

    return elements;
}

module.exports = { getChapter2 };
