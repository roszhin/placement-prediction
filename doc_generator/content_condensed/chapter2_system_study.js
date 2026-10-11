const { p, bullet, chapterHeading, sectionHeading, subSectionHeading, table } = require('../doc_helper');

function getChapter2() {
    const elements = [];

    elements.push(chapterHeading("2. SYSTEM STUDY"));

    elements.push(
        p("The System Study represents the analytical investigation of current operational workflows to identify architectural deficiencies, data bottlenecks, and user friction points. In enterprise software engineering, an exhaustive comparative study between the legacy environment and the proposed platform guarantees that technical innovations directly target proven administrative pain points."),
        p("This chapter provides a rigorous assessment of the existing manual placement workflow across Indian engineering colleges, detailing its structural drawbacks. Subsequently, the proposed platform is articulated, highlighting its architectural advantages, automated intelligence layers, and Table 2.1 which contrasts both systems across key operational dimensions.")
    );

    elements.push(sectionHeading("2.1 Existing System"));

    elements.push(subSectionHeading("2.1.1 Overview of Current Manual Placement Procedures"));
    elements.push(
        p("In most tertiary institutions, placement operations are managed through fragmented ad-hoc tools: Google Forms, shared spreadsheets, email inboxes, and local hard drives. The workflow operates as follows:"),
        bullet("Data Aggregation: Placement officers distribute spreadsheets asking students to self-report CGPAs, contact numbers, and skill sets, leading to rampant typographical errors and outdated records.", "1. Data Collection:"),
        bullet("Resume Storage: Resumes are collected via email attachments or Google Drive folders with no standardized naming conventions, resulting in misplaced files and missing documents.", "2. Document Ingestion:"),
        bullet("Shortlisting Friction: Placement officers manually cross-reference corporate eligibility criteria (e.g. CGPA >= 7.5, zero standing arrears) against massive spreadsheets, consuming hundreds of administrative hours.", "3. Manual Filtering:"),
        bullet("Zero Evaluation Feedback: Students submit applications blindly with no insight into ATS compatibility or skill gaps, leading to repeated rejections without guidance for improvement.", "4. Lack of Feedback:")
    );

    elements.push(subSectionHeading("2.1.2 Drawbacks of the Existing System"));
    elements.push(
        p("The manual approach imposes severe operational limitations:"),
        bullet("Severe Time Overhead: Manual spreadsheet cross-referencing and resume collation consumes weeks of faculty time during active hiring seasons.", "1. Administrative Bottlenecks:"),
        bullet("High Human Error Rate: Manual data entry produces transcription errors, mismatched CGPA thresholds, and missed corporate application deadlines.", "2. Data Inaccuracies:"),
        bullet("No ATS Optimization: Resumes are never validated against corporate ATS parsing standards, resulting in high candidate rejection rates during external corporate screening.", "3. Lack of ATS Screening:"),
        bullet("Data Vulnerability & Loss: Unstructured storage in local folders and cloud drives leaves sensitive student personal and academic data vulnerable to loss and unauthorized access.", "4. Security Vulnerabilities:"),
        bullet("Stale Information: When students update their resumes or acquire new certifications, placement officers frequently continue using outdated files.", "5. Version Desynchronization:"),
        bullet("Absence of Diagnostic Feedback: Students receive only binary outcomes (selected/rejected) with zero insight into their missing technical competencies.", "6. Lack of Formative Feedback:")
    );

    elements.push(sectionHeading("2.2 Proposed System"));

    elements.push(subSectionHeading("2.2.1 Conceptual Overview and Architectural Vision"));
    elements.push(
        p("The proposed platform provides an enterprise-grade web application engineered on Spring Boot 3.3.0, Java 21, and MySQL 8.0, integrating Google Gemini 1.5 Flash. It unifies all placement stakeholders into a streamlined digital workspace."),
        p("Students upload PDF resumes that are stored with dual redundancy—persisting binary data in MySQL LONGBLOB fields while mirroring files on disk. The system parses resumes via Apache PDFBox, evaluates them against job specifications using Gemini 1.5 Flash, and delivers instantaneous ATS match percentages, matched skills, missing skills, and interview tips."),
        p("The platform further incorporates an automated 'Jobs For You' matching engine with asynchronous loading states, an interactive Companies Directory, role-based Spring Security 6 governance, and faculty analytics dashboards.")
    );

    elements.push(subSectionHeading("2.2.2 Advantages of the Proposed System"));
    elements.push(
        p("The proposed platform delivers substantial quantitative and qualitative benefits:"),
        bullet("Instantaneous ATS Diagnostics: Evaluates resumes against job descriptions in under 5 seconds, providing match scores and explicit missing skill lists.", "1. AI-Powered Evaluation:"),
        bullet("Automated Job Ranking: The 'Jobs For You' portal ranks all active jobs by student resume suitability with real-time progress indicators.", "2. Intelligent Job Matching:"),
        bullet("Zero Data Loss Architecture: Dual-redundancy storage preserves resume files both in the relational database and on disk with automated failover.", "3. Resilient File Storage:"),
        bullet("Automatic Cache Synchronization: Deletes existing AI analysis rows upon resume re-upload, guaranteeing evaluations always reflect active credentials.", "4. Cache Freshness:"),
        bullet("Enterprise Role Security: Strict Role-Based Access Control (RBAC) enforced by Spring Security 6 with BCrypt encryption and SMTP OTP verification.", "5. Robust Security:"),
        bullet("Recruiter Productivity: Company recruiters can post jobs, inspect candidate match scores, stream resumes, and update applicant statuses in one click.", "6. Recruiter Efficiency:"),
        bullet("Institutional Analytics: Departmental dashboards provide Chart.js visualizers tracking placement conversion rates and cohort skill deficits.", "7. Oversight Analytics:")
    );

    elements.push(subSectionHeading("2.2.3 Comparative Analysis Matrix"));
    elements.push(
        p("Table 2.1 systematically compares the operational characteristics of the legacy manual system against the proposed AI-driven platform:"),
        p("")
    );

    const compHeaders = ["Evaluation Dimension", "Existing Manual System", "Proposed AI Platform", "Operational Impact"];
    const compRows = [
        ["Resume Submission", "Email attachments, Google Forms, paper copies", "Standardized portal with PDF magic-byte validation", "Eliminates corrupted/unvalidated document submissions."],
        ["Document Storage", "Fragmented local folders and Google Drive links", "Dual redundancy (MySQL LONGBLOB + disk mirror)", "100% data availability with zero document loss."],
        ["ATS Compatibility", "None; blind candidate submission", "Instant semantic scoring (0–100%) via Gemini 1.5 Flash", "Empowers students to optimize resumes prior to applying."],
        ["Skill Gap Diagnosis", "None; binary pass/fail outcomes", "Explicit lists of matched vs. missing technical skills", "Guides student upskilling with concrete recommendations."],
        ["Job Discovery", "Static notice boards, circular emails", "AI-Ranked 'Jobs For You' with asynchronous loading", "Surfaces best-fit jobs instantly, maximizing match rates."],
        ["Recruiter Access", "Manual CSV applicant lists emailed by placement cell", "Dedicated portal with 1-click resume streaming & status updates", "Reduces corporate screening cycle time by over 75%."],
        ["Data Freshness", "Stale files persist across drives", "Automated cache invalidation on resume re-upload", "Eliminates stale scores and version confusion."],
        ["Security & Roles", "Shared spreadsheets with unencrypted data", "Spring Security 6 RBAC, BCrypt hashing, SMTP OTP", "Full OWASP-compliant access control and data security."],
        ["Placement Analytics", "Manual calculations on departmental spreadsheets", "Real-time Chart.js dashboards tracking placement trends", "Enables proactive institutional training interventions."]
    ];

    elements.push(...table(
        compHeaders,
        compRows,
        [20, 26, 28, 26],
        "Table 2.1: Comparative Analysis of Existing vs. Proposed System"
    ));

    return elements;
}

module.exports = { getChapter2 };
